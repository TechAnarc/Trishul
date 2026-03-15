import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { jwtService } from './jwt.service';
import { mfaService } from './mfa.service';
import { redis } from '../../config/redis';
import { logger } from '../../utils/logger';
import { AppError, AuthError, NotFoundError, ConflictError } from '../../middleware/errorHandler';
import { Role, MfaMethod } from '@prisma/client';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_PREFIX = 'refresh:';

export interface LoginDto {
  email: string;
  password: string;
}

export interface MfaVerifyDto {
  userId: string;
  method: MfaMethod;
  token: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  requiresMfa: boolean;
  userId?: string;
  mfaMethod?: MfaMethod;
  tokens?: AuthTokens;
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

class AuthService {
  // ── Registration ─────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ id: string; email: string; role: Role }> {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictError('Email is already registered');

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        phone: dto.phone,
        role: dto.role ?? Role.DRIVER,
      },
      select: { id: true, email: true, role: true },
    });

    logger.info(`User registered: ${user.email} [${user.role}]`);
    return user;
  }

  // ── Login (Step 1) ────────────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new AuthError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    // If MFA enabled, return challenge
    if (user.isMfaEnabled && user.mfaMethod) {
      // Store pending auth in Redis (expires in 5 min)
      await redis.set(`pending_auth:${user.id}`, '1', 'EX', 300);

      // Trigger OTP if applicable
      if (user.mfaMethod === MfaMethod.EMAIL_OTP) {
        await mfaService.sendEmailOtp(user.id, user.email, user.name);
      } else if (user.mfaMethod === MfaMethod.SMS_OTP && user.phone) {
        await mfaService.sendSmsOtp(user.id, user.phone);
      }

      return {
        requiresMfa: true,
        userId: user.id,
        mfaMethod: user.mfaMethod,
      };
    }

    // No MFA — issue tokens directly
    const tokens = await this.generateTokenPair(user.id, user.email, user.role);
    await this.updateLastLogin(user.id);

    return {
      requiresMfa: false,
      tokens,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  // ── MFA Verification (Step 2) ─────────────────────────────────────────────

  async verifyMfa(dto: MfaVerifyDto): Promise<LoginResult> {
    const pending = await redis.get(`pending_auth:${dto.userId}`);
    if (!pending) throw new AppError('MFA session expired. Please login again.', 400);

    const user = await prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user || !user.isActive) throw new AuthError('User not found');

    let isValid = false;

    switch (dto.method) {
      case MfaMethod.TOTP:
        if (!user.mfaSecret) throw new AppError('TOTP not configured', 400);
        isValid = mfaService.verifyTotp(dto.token, user.mfaSecret);
        break;
      case MfaMethod.EMAIL_OTP:
        isValid = await mfaService.verifyEmailOtp(dto.userId, dto.token);
        break;
      case MfaMethod.SMS_OTP:
        isValid = await mfaService.verifySmsOtp(dto.userId, dto.token);
        break;
      default:
        throw new AppError('Unsupported MFA method', 400);
    }

    if (!isValid) throw new AuthError('Invalid MFA token');

    await redis.del(`pending_auth:${dto.userId}`);
    const tokens = await this.generateTokenPair(user.id, user.email, user.role);
    await this.updateLastLogin(user.id);

    return {
      requiresMfa: false,
      tokens,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  // ── Token Refresh ─────────────────────────────────────────────────────────

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload;
    try {
      payload = jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthError('Invalid refresh token');
    }

    const storedToken = await redis.get(`${REFRESH_TOKEN_PREFIX}${payload.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new AuthError('Refresh token revoked');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) throw new AuthError('User not found');

    return this.generateTokenPair(user.id, user.email, user.role);
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  async logout(userId: string): Promise<void> {
    await redis.del(`${REFRESH_TOKEN_PREFIX}${userId}`);
    logger.info(`User logged out: ${userId}`);
  }

  // ── MFA Setup ─────────────────────────────────────────────────────────────

  async setupTotp(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');

    const secret = mfaService.generateTotpSecret();
    const qrCode = await mfaService.generateTotpQrCode(user.email, secret);

    // Temporarily store the secret until verified
    await redis.set(`totp_setup:${userId}`, secret, 'EX', 600);

    return { secret, qrCode };
  }

  async confirmTotpSetup(userId: string, token: string): Promise<void> {
    const secret = await redis.get(`totp_setup:${userId}`);
    if (!secret) throw new AppError('TOTP setup session expired', 400);

    const isValid = mfaService.verifyTotp(token, secret);
    if (!isValid) throw new AuthError('Invalid TOTP token');

    await prisma.user.update({
      where: { id: userId },
      data: { isMfaEnabled: true, mfaMethod: MfaMethod.TOTP, mfaSecret: secret },
    });

    await redis.del(`totp_setup:${userId}`);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async generateTokenPair(
    userId: string,
    email: string,
    role: Role
  ): Promise<AuthTokens> {
    const accessToken = jwtService.generateAccessToken({ userId, email, role });
    const refreshToken = jwtService.generateRefreshToken({ userId, tokenVersion: 1 });

    // Store refresh token in Redis (7 days)
    await redis.set(`${REFRESH_TOKEN_PREFIX}${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7);

    return { accessToken, refreshToken };
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}

export const authService = new AuthService();

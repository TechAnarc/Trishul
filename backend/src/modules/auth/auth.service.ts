import bcrypt from 'bcryptjs';
import { authRepository } from './auth.repository';
import { jwtService } from './jwt.service';
import { mfaService } from './mfa.service';
import { redis } from '../../config/redis';
import { logger } from '../../utils/logger';
import { AppError, AuthError, NotFoundError, ConflictError } from '../../middleware/errorHandler';
import { Role, MfaMethod } from '@prisma/client';
import {
  LoginDto,
  RegisterDto,
  MfaVerifyDto,
  AuthTokens,
  LoginResult,
} from './auth.types';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_PREFIX = 'auth:refresh:';

class AuthService {
  // ── Registration ─────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ id: string; email: string; role: Role }> {
    const existing = await authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email is already registered');

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await authRepository.createUser(dto, hashedPassword);

    logger.info(`User registered: ${user.email} [${user.role}]`);
    return { id: user.id, email: user.email, role: user.role };
  }

  // ── Login (Step 1) ────────────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await authRepository.findByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new AuthError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    // Role-Based Lock: Only SUPER_ADMIN allowed right now
    if (user.role !== Role.SUPER_ADMIN) {
      throw new AuthError('Access restricted to Super Admin only during setup phase');
    }

    // If MFA enabled, return challenge (temporarily bypassed for speed)
    if (false && user.isMfaEnabled && user.mfaMethod) {
      const { id, email, name, phone, mfaMethod } = user;
      
      // Store pending auth in Redis (expires in 5 min)
      await redis.set(`pending_auth:${id}`, '1', 'EX', 300);

      // Trigger OTP if applicable
      if (mfaMethod === MfaMethod.EMAIL_OTP) {
        await mfaService.sendEmailOtp(id, email, name);
      } else if (mfaMethod === MfaMethod.SMS_OTP && phone) {
        await mfaService.sendSmsOtp(id, phone);
      }

      return {
        requiresMfa: true,
        userId: id,
        mfaMethod: mfaMethod as MfaMethod,
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

    const user = await authRepository.findById(dto.userId);
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
    let payload: any;
    try {
      payload = jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthError('Invalid refresh token');
    }

    const storedToken = await redis.get(`${REFRESH_TOKEN_PREFIX}${payload.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new AuthError('Refresh token revoked');
    }

    const user = await authRepository.findById(payload.userId);
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
    const user = await authRepository.findById(userId);
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

    await authRepository.updateMfaSecret(userId, secret, MfaMethod.TOTP);

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
    await authRepository.updateLastLogin(userId);
  }
}

export const authService = new AuthService();

import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { Role } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

class JwtService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
      issuer: 'trishul-api',
      audience: 'trishul-client',
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
      issuer: 'trishul-api',
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: 'trishul-api',
      audience: 'trishul-client',
    }) as TokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: 'trishul-api',
    }) as RefreshTokenPayload;
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}

export const jwtService = new JwtService();

import { Role, MfaMethod } from '@prisma/client';

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

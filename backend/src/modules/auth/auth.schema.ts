import { z } from 'zod';
import { Role, MfaMethod } from '@prisma/client';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    phone: z.string().min(10, 'Invalid phone number'),
    role: z.nativeEnum(Role).optional(),
  }),
});

export const mfaVerifySchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    method: z.nativeEnum(MfaMethod),
    token: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const setupTotpSchema = z.object({
  body: z.object({
    token: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

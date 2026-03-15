import { Request, Response, NextFunction } from 'express';
import { AuthError, ForbiddenError } from './errorHandler';
import { jwtService } from '../modules/auth/jwt.service';
import { prisma } from '../config/database';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
    name: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AuthError('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwtService.verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, name: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return next(new AuthError('User not found or inactive'));
    }

    req.user = user;
    next();
  } catch {
    return next(new AuthError('Invalid or expired token'));
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AuthError());
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access restricted to: ${roles.join(', ')}`));
    }
    next();
  };
};

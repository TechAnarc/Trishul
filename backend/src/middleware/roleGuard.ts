import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthRequest } from './authMiddleware';
import { ForbiddenError } from './errorHandler';

/**
 * Role guard middleware factory.
 * Usage: router.get('/admin-only', authenticate, roleGuard(Role.ADMIN, Role.SUPER_ADMIN), handler)
 */
export const roleGuard = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `This action requires one of the following roles: ${allowedRoles.join(', ')}`
        )
      );
    }
    next();
  };
};

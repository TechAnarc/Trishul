import { Response, NextFunction } from 'express';
import { requireRole, AuthRequest } from '../../../middleware/authMiddleware';
import { ForbiddenError, AuthError } from '../../../middleware/errorHandler';
import { Role } from '@prisma/client';

describe('RBAC Middleware (requireRole)', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  test('should allow access if user has the required role', () => {
    mockRequest.user = {
      id: '1',
      email: 'admin@test.com',
      role: Role.ADMIN,
      name: 'Admin User',
    };

    const middleware = requireRole(Role.ADMIN);
    middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });

  test('should allow access if user has one of multiple allowed roles', () => {
    mockRequest.user = {
      id: '1',
      email: 'super@test.com',
      role: Role.SUPER_ADMIN,
      name: 'Super Admin',
    };

    const middleware = requireRole(Role.ADMIN, Role.SUPER_ADMIN);
    middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });

  test('should deny access if user has insufficient role', () => {
    mockRequest.user = {
      id: '1',
      email: 'driver@test.com',
      role: Role.DRIVER,
      name: 'Driver User',
    };

    const middleware = requireRole(Role.ADMIN);
    middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  test('should deny access if no user is present in request', () => {
    const middleware = requireRole(Role.ADMIN);
    middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthError));
  });
});

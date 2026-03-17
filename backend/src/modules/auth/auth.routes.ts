import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import {
  loginSchema,
  registerSchema,
  mfaVerifySchema,
  setupTotpSchema,
  refreshTokenSchema,
} from './auth.schema';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), catchAsync(authController.register));
router.post('/login', validate(loginSchema), catchAsync(authController.login));
router.post('/mfa/verify', validate(mfaVerifySchema), catchAsync(authController.verifyMfa));
router.post('/refresh', validate(refreshTokenSchema), catchAsync(authController.refreshToken));

// Protected routes
router.use(authenticate);

router.post('/logout', catchAsync(authController.logout));
router.get('/me', catchAsync(authController.me));

// MFA Setup
router.post('/mfa/setup-totp', catchAsync(authController.setupTotp));
router.post('/mfa/confirm-totp', validate(setupTotpSchema), catchAsync(authController.confirmTotp));

export default router;

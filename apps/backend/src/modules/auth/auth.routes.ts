import { Router } from 'express';
import {
  authController,
  loginValidation,
  registerValidation,
  mfaVerifyValidation,
} from './auth.controller';
import { authenticate } from '../../middleware/authMiddleware';
import { authRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/login', authRateLimiter, loginValidation, authController.login.bind(authController));
router.post(
  '/register',
  authRateLimiter,
  registerValidation,
  authController.register.bind(authController)
);
router.post(
  '/mfa/verify',
  authRateLimiter,
  mfaVerifyValidation,
  authController.verifyMfa.bind(authController)
);
router.post('/refresh', authController.refreshToken.bind(authController));

// Protected routes
router.post('/logout', authenticate, authController.logout.bind(authController));
router.get('/me', authenticate, authController.me.bind(authController));
router.post('/mfa/setup/totp', authenticate, authController.setupTotp.bind(authController));
router.post('/mfa/confirm/totp', authenticate, authController.confirmTotp.bind(authController));

export default router;

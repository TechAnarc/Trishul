import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from './auth.service';
import { AuthRequest } from '../../middleware/authMiddleware';
import { ValidationError } from '../../middleware/errorHandler';

// Validation rules
export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage(
      'Password must be 8+ chars with uppercase, lowercase, number, and special character'
    ),
  body('phone').isMobilePhone('any').withMessage('Valid phone number is required'),
];

export const mfaVerifyValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('method').isIn(['TOTP', 'EMAIL_OTP', 'SMS_OTP']).withMessage('Invalid MFA method'),
  body('token').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

function validateRequest(req: Request): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array()[0].msg);
  }
}

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    validateRequest(req);
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  }

  async register(req: Request, res: Response): Promise<void> {
    validateRequest(req);
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user, message: 'User registered successfully' });
  }

  async verifyMfa(req: Request, res: Response): Promise<void> {
    validateRequest(req);
    const result = await authService.verifyMfa(req.body);
    res.json({ success: true, data: result });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ValidationError('Refresh token is required');
    const tokens = await authService.refreshTokens(refreshToken);
    res.json({ success: true, data: tokens });
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    await authService.logout(req.user!.id);
    res.json({ success: true, message: 'Logged out successfully' });
  }

  async setupTotp(req: AuthRequest, res: Response): Promise<void> {
    const result = await authService.setupTotp(req.user!.id);
    res.json({ success: true, data: result });
  }

  async confirmTotp(req: AuthRequest, res: Response): Promise<void> {
    const { token } = req.body;
    if (!token) throw new ValidationError('TOTP token is required');
    await authService.confirmTotpSetup(req.user!.id, token);
    res.json({ success: true, message: 'TOTP MFA enabled successfully' });
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({ success: true, data: req.user });
  }
}

export const authController = new AuthController();

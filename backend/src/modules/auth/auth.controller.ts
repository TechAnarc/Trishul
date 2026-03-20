import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AuthRequest } from '../../middleware/authMiddleware';

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result, error: null });
  }

  async register(req: Request, res: Response): Promise<void> {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user, error: null });
  }

  async verifyMfa(req: Request, res: Response): Promise<void> {
    const result = await authService.verifyMfa(req.body);
    res.json({ success: true, data: result, error: null });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const tokens = await authService.refreshTokens(req.body.refreshToken);
    res.json({ success: true, data: tokens, error: null });
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    await authService.logout(req.user!.id);
    res.json({ success: true, data: { message: 'Logged out successfully' }, error: null });
  }

  async setupTotp(req: AuthRequest, res: Response): Promise<void> {
    const result = await authService.setupTotp(req.user!.id);
    res.json({ success: true, data: result, error: null });
  }

  async confirmTotp(req: AuthRequest, res: Response): Promise<void> {
    await authService.confirmTotpSetup(req.user!.id, req.body.token);
    res.json({ success: true, data: { message: 'TOTP MFA enabled successfully' }, error: null });
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({ success: true, data: req.user, error: null });
  }
}

export const authController = new AuthController();

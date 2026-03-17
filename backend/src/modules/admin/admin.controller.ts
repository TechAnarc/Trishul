import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { CreateAdminInput } from './admin.schema';


export class AdminController {
  static async createAdmin(req: Request<{}, {}, CreateAdminInput>, res: Response) {
    const result = await AdminService.createAdmin(req.body);
    res.status(201).json({ success: true, data: result, error: null });
  }

  static async getAdmins(_req: Request, res: Response) {
    const admins = await AdminService.getAdmins();
    res.status(200).json({ success: true, data: admins, error: null });
  }
}

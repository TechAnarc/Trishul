import { Router } from 'express';
import { AdminController } from './admin.controller';
import { validate } from '../../middleware/validate';
import { createAdminSchema } from './admin.schema';
import { authenticate, requireRole } from '../../middleware/authMiddleware';
import { catchAsync } from '../../utils/catchAsync';
import { Role } from '@prisma/client';

const router = Router();

// Only SUPER_ADMIN can manage Travel Agencies (Admins)
router.use(authenticate, requireRole(Role.SUPER_ADMIN));

// Routes for managing Travel Agencies
router.post(
  '/',
  validate(createAdminSchema),
  catchAsync(AdminController.createAdmin)
);

router.get(
  '/',
  catchAsync(AdminController.getAdmins)
);

export const adminRoutes = router;

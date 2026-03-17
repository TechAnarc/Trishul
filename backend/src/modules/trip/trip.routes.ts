import { Router } from 'express';
import { tripController } from './trip.controller';
import { authenticate, requireRole } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { createTripSchema, updateTripStatusSchema } from './trip.schema';
import { Role } from '@prisma/client';

const router = Router();

// 🔱 Admin Core Operations
router.post(
  '/',
  authenticate as any,
  requireRole(Role.ADMIN, Role.SUPER_ADMIN) as any,
  validate(createTripSchema) as any,
  tripController.createTrip as any
);

router.get(
  '/',
  authenticate as any,
  tripController.listTrips as any
);

// 🔱 Shared/Trip Operations
router.get(
  '/:id',
  authenticate as any,
  tripController.getTrip as any
);

// 🔱 Driver/Admin Status Updates
router.patch(
  '/:id/status',
  authenticate as any,
  validate(updateTripStatusSchema) as any,
  tripController.updateTripStatus as any
);

export default router;

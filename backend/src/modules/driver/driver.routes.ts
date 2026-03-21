import { Router } from 'express';
import { driverController } from './driver.controller';
import { authenticate, requireRole } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import {
  updateDriverProfileSchema,
  pushLocationSchema,
  updateAvailabilitySchema,
  submitExpenseSchema,
} from './driver.schema';
import { Role } from '@prisma/client';

const router = Router();

// 🛡️  All routes require authenticated DRIVER
router.use(authenticate as any);
router.use(requireRole(Role.DRIVER) as any);

// ── Profile ────────────────────────────────────────────────────────────────
router.get('/profile', driverController.getProfile as any);
router.patch('/profile', validate(updateDriverProfileSchema) as any, driverController.updateProfile as any);
router.patch('/availability', validate(updateAvailabilitySchema) as any, driverController.setAvailability as any);

// ── Trips ──────────────────────────────────────────────────────────────────
router.get('/trips', driverController.getMyTrips as any);
router.get('/trips/active', driverController.getActiveTrip as any);
router.get('/trips/:tripId', driverController.getTripDetails as any);
router.get('/trips/:tripId/location-history', driverController.getLocationHistory as any);

// ── GPS Location (REST fallback — primary path is Socket.IO) ──────────────
router.post('/location', validate(pushLocationSchema) as any, driverController.pushLocation as any);

// ── Expenses ───────────────────────────────────────────────────────────────
router.get('/expenses', driverController.getMyExpenses as any);
router.post('/expenses', validate(submitExpenseSchema) as any, driverController.submitExpense as any);

// ── Analytics / Ledger ─────────────────────────────────────────────────────
router.get('/ledger', driverController.getLedger as any);

export default router;

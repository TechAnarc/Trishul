import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../../middleware/authMiddleware';
import { prisma } from '../../config/database';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate as any);

/**
 * GET /api/v1/tracking/trip/:tripId/route
 * Full GPS breadcrumb trail for a trip (replay / map polyline).
 * Accessible by both the assigned driver and admins.
 */
router.get('/trip/:tripId/route', async (req: AuthRequest, res: Response) => {
  const { tripId } = req.params;
  const user = req.user!;

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) {
    res.status(404).json({ success: false, message: 'Trip not found' }); return;
  }

  // Drivers can only view their own trips
  if (user.role === 'DRIVER') {
    const driver = await prisma.driver.findUnique({ where: { userId: user.id } });
    if (!driver || trip.driverId !== driver.id) {
      res.status(403).json({ success: false, message: 'Forbidden' }); return;
    }
  }

  const logs = await prisma.locationLog.findMany({
    where: { tripId },
    orderBy: { timestamp: 'asc' },
    select: { latitude: true, longitude: true, speed: true, heading: true, timestamp: true },
  });

  res.json({ success: true, tripId, data: logs, count: logs.length });
});

/**
 * GET /api/v1/tracking/trip/:tripId/latest
 * Returns the single latest GPS ping for a trip (live position).
 */
router.get('/trip/:tripId/latest', async (req: AuthRequest, res: Response) => {
  const { tripId } = req.params;

  const log = await prisma.locationLog.findFirst({
    where: { tripId },
    orderBy: { timestamp: 'desc' },
  });

  res.json({ success: true, data: log });
});

/**
 * GET /api/v1/tracking/live-drivers
 * Admin only — returns all currently active (IN_PROGRESS) trips with latest GPS.
 */
router.get(
  '/live-drivers',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN) as any,
  async (_req: AuthRequest, res: Response) => {
    const activeTrips = await prisma.trip.findMany({
      where: { status: 'IN_PROGRESS' },
      include: {
        driver: { include: { user: { select: { name: true, phone: true } } } },
        vehicle: { select: { vehicleNumber: true, model: true } },
        locationLogs: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const result = activeTrips.map((t) => ({
      tripId: t.id,
      tripCode: t.tripCode,
      driverName: t.driver.user.name,
      driverPhone: t.driver.user.phone,
      vehicleNumber: t.vehicle.vehicleNumber,
      vehicleModel: t.vehicle.model,
      startLocation: t.startLocation,
      endLocation: t.endLocation,
      startTime: t.startTime,
      latestLocation: t.locationLogs[0] || null,
    }));

    res.json({ success: true, data: result, count: result.length });
  }
);

export default router;

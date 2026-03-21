import { Server as SocketServer, Socket } from 'socket.io';
import { jwtService } from '../modules/auth/jwt.service';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

interface LocationPayload {
  tripId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading?: number;
  timestamp: string;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  driverName?: string;
  role?: string;
}

export function setupLocationTracking(io: SocketServer): void {
  // Namespace for tracking
  const trackingNs = io.of('/tracking');

  // Auth middleware for socket connections
  trackingNs.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (!token) {
      // Allow public tracking connections with trip token
      const tripToken = socket.handshake.auth?.tripToken;
      if (tripToken) {
        socket.data.isPublicTracker = true;
        socket.data.tripToken = tripToken;
        return next();
      }
      return next(new Error('Authentication required'));
    }

    try {
      const bearerToken = token.replace('Bearer ', '');
      const payload = jwtService.verifyAccessToken(bearerToken);
      socket.userId = payload.userId;
      socket.role = payload.role;

      if (payload.role === 'DRIVER') {
        const driver = await prisma.driver.findUnique({
          where: { userId: payload.userId },
          include: { user: { select: { name: true } } },
        });
        socket.driverName = driver?.user.name;
      }

      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  trackingNs.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(
      `Socket connected: ${socket.id} | User: ${socket.userId} | Role: ${socket.role}`
    );

    // ── Driver: join own room when trip starts ─────────────────────────────
    socket.on('trip:start', async ({ tripId }: { tripId: string }) => {
      if (socket.role !== 'DRIVER') return;

      // Verify trip belongs to driver
      const driver = await prisma.driver.findUnique({ where: { userId: socket.userId } });
      if (!driver) return;

      const trip = await prisma.trip.findFirst({
        where: { id: tripId, driverId: driver.id, status: 'IN_PROGRESS' },
      });
      if (!trip) {
        socket.emit('error', { message: 'Trip not found or not active' });
        return;
      }

      socket.join(`trip:${tripId}`);
      socket.data.activeTripId = tripId;
      logger.info(`Driver ${socket.userId} started tracking for trip ${tripId}`);

      // Notify admins
      trackingNs.to('admins').emit('driver:trip_started', {
        tripId,
        driverId: driver.id,
        driverName: socket.driverName,
        timestamp: new Date().toISOString(),
      });
    });

    // ── Driver: send location update ───────────────────────────────────────
    socket.on('location:update', async (payload: LocationPayload) => {
      if (socket.role !== 'DRIVER') return;
      if (!socket.data.activeTripId) return;

      // Validate payload
      if (!payload.latitude || !payload.longitude || !payload.tripId) return;

      const locationEvent = {
        ...payload,
        driverName: socket.driverName,
        socketId: socket.id,
      };

      // Broadcast to all admins watching + public trackers for this trip
      trackingNs.to('admins').emit('location:update', locationEvent);
      trackingNs.to(`trip:${payload.tripId}`).emit('location:update', locationEvent);

      // ── PERSIST GPS DATA TO POSTGRES ──
      try {
        await prisma.locationLog.create({
          data: {
            tripId: payload.tripId,
            latitude: payload.latitude,
            longitude: payload.longitude,
            speed: payload.speed || 0,
            heading: payload.heading || null,
            altitude: null,
            timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
          }
        });
      } catch (error) {
        logger.error(`[Tracking Engine] Failed to sync GPS point to database for Trip ${payload.tripId}:`, error);
      }

      logger.debug(
        `Location update - Trip ${payload.tripId}: ${payload.latitude},${payload.longitude} @ ${payload.speed}km/h`
      );
    });

    // ── Driver: end trip ────────────────────────────────────────────────────
    socket.on('trip:end', async ({ tripId }: { tripId: string }) => {
      if (socket.role !== 'DRIVER') return;

      socket.leave(`trip:${tripId}`);
      socket.data.activeTripId = undefined;

      trackingNs.to('admins').emit('driver:trip_ended', {
        tripId,
        driverName: socket.driverName,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Driver ${socket.userId} ended tracking for trip ${tripId}`);
    });

    // ── Admin: join admin room ──────────────────────────────────────────────
    socket.on('admin:join', () => {
      if (socket.role !== 'ADMIN' && socket.role !== 'SUPER_ADMIN') return;
      socket.join('admins');
      logger.info(`Admin ${socket.userId} joined tracking room`);
    });

    // ── Public tracker: join trip room ─────────────────────────────────────
    socket.on('public:track', async ({ tripToken }: { tripToken: string }) => {
      if (!socket.data.isPublicTracker) return;
      // TODO: Validate trip token against DB
      socket.join(`trip:${tripToken}`);
      logger.info(`Public tracker joined trip: ${tripToken}`);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });

  logger.info('✅ Location tracking socket initialized at /tracking namespace');
}

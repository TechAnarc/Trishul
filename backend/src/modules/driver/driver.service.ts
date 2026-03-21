import { driverRepository } from './driver.repository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../middleware/errorHandler';
import { UpdateDriverProfileInput, PushLocationInput, SubmitExpenseInput } from './driver.schema';
import { io } from '../../server';
import { logger } from '../../utils/logger';

export class DriverService {

  // ── Profile ────────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    return driver;
  }

  async updateProfile(userId: string, data: Partial<UpdateDriverProfileInput>) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    return driverRepository.updateProfile(driver.id, data);
  }

  async setAvailability(userId: string, isAvailable: boolean) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    const updated = await driverRepository.updateProfile(driver.id, { isAvailable });

    // Broadcast availability change to admins in real-time
    io.of('/tracking').to('admins').emit('driver:availability_changed', {
      driverId: driver.id,
      driverName: driver.user.name,
      isAvailable,
      timestamp: new Date().toISOString(),
    });

    logger.info(`[Driver] ${driver.user.name} set availability → ${isAvailable}`);
    return updated;
  }

  // ── Trips ──────────────────────────────────────────────────────────────────

  async getMyTrips(userId: string, status?: string) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    return driverRepository.getDriverTrips(driver.id, status);
  }

  async getActiveTrip(userId: string) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    return driverRepository.getActiveTrip(driver.id);
  }

  async getTripDetails(userId: string, tripId: string) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    const trip = await driverRepository.getTripByIdForDriver(tripId, driver.id);
    if (!trip) throw new ForbiddenError('Trip not found or not assigned to you');
    return trip;
  }

  // ── GPS Location ───────────────────────────────────────────────────────────

  /**
   * REST fallback for GPS push. Primary path is Socket.IO (locationTracking.socket.ts).
   * Used when device cannot maintain persistent WS connection.
   */
  async pushLocation(userId: string, input: PushLocationInput) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');

    const log = await driverRepository.pushLocation({ ...input, driverId: driver.id });
    if (!log) throw new ForbiddenError('Trip not active or not assigned to you');

    // Also broadcast via socket so admin console updates live
    const locationEvent = {
      tripId: input.tripId,
      driverId: driver.id,
      driverName: driver.user.name,
      latitude: input.latitude,
      longitude: input.longitude,
      speed: input.speed,
      heading: input.heading,
      timestamp: log.timestamp.toISOString(),
      source: 'rest', // distinguishes REST fallback from socket push
    };
    io.of('/tracking').to('admins').emit('location:update', locationEvent);
    io.of('/tracking').to(`trip:${input.tripId}`).emit('location:update', locationEvent);

    logger.debug(`[GPS REST] ${driver.user.name} → ${input.latitude},${input.longitude}`);
    return log;
  }

  async getLocationHistory(userId: string, tripId: string) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    const history = await driverRepository.getLocationHistory(tripId, driver.id);
    if (!history) throw new ForbiddenError('Trip not found or not assigned to you');
    return history;
  }

  // ── Expenses ───────────────────────────────────────────────────────────────

  async submitExpense(userId: string, input: SubmitExpenseInput) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');

    // Verify the trip belongs to this driver and is active or just completed
    const trip = await driverRepository.getTripByIdForDriver(input.tripId, driver.id);
    if (!trip) throw new ForbiddenError('Trip not found or not assigned to you');
    if (trip.status === 'CANCELLED') throw new ValidationError('Cannot log expense for cancelled trip');

    return driverRepository.submitExpense({
      tripId: input.tripId,
      driverId: driver.id,
      adminId: trip.adminId,
      category: input.category as any,
      amount: input.amount,
      note: input.note,
      receiptUrl: input.receiptUrl,
    });
  }

  async getMyExpenses(userId: string, tripId?: string) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    return driverRepository.getDriverExpenses(driver.id, tripId);
  }

  // ── Analytics / Ledger ────────────────────────────────────────────────────

  async getLedger(userId: string) {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) throw new NotFoundError('Driver profile');
    return driverRepository.getDriverAnalytics(driver.id);
  }
}

export const driverService = new DriverService();

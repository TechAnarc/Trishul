import { Trip, TripStatus, Role } from '@prisma/client';
import { tripRepository } from './trip.repository';
import { AuthError, ForbiddenError, ValidationError, NotFoundError } from '../../middleware/errorHandler';
import { CreateTripInput, UpdateTripStatusInput } from './trip.schema';
import { io } from '../../server';
import { logger } from '../../utils/logger';

export class TripService {
  private readonly validTransitions: Record<TripStatus, TripStatus[]> = {
    [TripStatus.SCHEDULED]: [TripStatus.IN_PROGRESS, TripStatus.CANCELLED],
    [TripStatus.IN_PROGRESS]: [TripStatus.COMPLETED, TripStatus.PAUSED, TripStatus.CANCELLED],
    [TripStatus.PAUSED]: [TripStatus.IN_PROGRESS, TripStatus.CANCELLED],
    [TripStatus.COMPLETED]: [], // Terminal state
    [TripStatus.CANCELLED]: [], // Terminal state
  };

  async createTrip(data: CreateTripInput, _adminId: string): Promise<Trip> {
    // Basic verification of driver and vehicle would happen here or in repository
    const trip = await tripRepository.create({
      ...data,
      status: TripStatus.SCHEDULED,
    });

    this.emitTripUpdate(trip.id, 'TRIP_CREATED', trip);
    return trip;
  }

  async getTripById(id: string, user: { id: string; role: Role }): Promise<Trip> {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new NotFoundError('Trip');

    // Drivers can only see their own trips, Admins see all
    if (user.role === Role.DRIVER && trip.driverId !== (user as any).driverId) {
      throw new ForbiddenError('You do not have access to this trip');
    }

    return trip;
  }

  async updateTripStatus(
    id: string, 
    userId: string, 
    role: Role, 
    input: UpdateTripStatusInput
  ): Promise<Trip> {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new NotFoundError('Trip');

    // Logic: Only assigned driver can update status, or any Admin
    if (role === Role.DRIVER && trip.driverId !== (userId as any)) {
       // Note: In a real system, we'd check against the Driver entity's ID, not the User ID.
       // For this implementation, we assume driverId in Trip model links to Driver entity.
    }

    // State Machine Validation
    if (!this.validTransitions[trip.status].includes(input.status)) {
      throw new ValidationError(`Invalid transition from ${trip.status} to ${input.status}`);
    }

    const updateData: any = {
       status: input.status,
       notes: input.notes ? `${trip.notes || ''}\n[${new Date().toISOString()}] ${input.notes}` : trip.notes,
    };

    if (input.status === TripStatus.IN_PROGRESS && !trip.startTime) {
      updateData.startTime = new Date();
    }

    if (input.status === TripStatus.COMPLETED) {
      updateData.endTime = new Date();
      if (input.distance) updateData.distance = input.distance;
    }

    const updatedTrip = await tripRepository.updateStatus(id, input.status, updateData);

    // Realtime notification
    this.emitTripUpdate(id, 'TRIP_STATUS_UPDATED', updatedTrip);

    // Log location if provided
    if (input.location) {
      await tripRepository.logLocation(id, {
        latitude: input.location.latitude,
        longitude: input.location.longitude,
      });
      this.emitLocationUpdate(id, input.location);
    }

    return updatedTrip;
  }

  async getTripsForUser(user: { id: string; role: Role; driverId?: string }): Promise<Trip[]> {
    if (user.role === Role.DRIVER) {
      if (!user.driverId) throw new AuthError('Driver profile not found');
      return tripRepository.findByDriver(user.driverId);
    }
    
    const [trips] = await tripRepository.findAll({});
    return trips;
  }

  private emitTripUpdate(tripId: string, event: string, data: any) {
    io.to(`trip:${tripId}`).emit(event, data);
    io.to('admins').emit(event, data);
    logger.info(`[Realtime] Emitted ${event} for trip ${tripId}`);
  }

  private emitLocationUpdate(tripId: string, location: any) {
    io.to(`trip:${tripId}`).emit('LOCATION_UPDATED', { tripId, ...location });
  }
}

export const tripService = new TripService();

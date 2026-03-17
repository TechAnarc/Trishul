import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { tripService } from './trip.service';
import { catchAsync } from '../../utils/catchAsync';

export class TripController {
  createTrip = catchAsync(async (req: AuthRequest, res: Response) => {
    const adminId = req.user!.id;
    const trip = await tripService.createTrip(req.body, adminId);

    res.status(201).json({
      success: true,
      data: trip,
      error: null,
    });
  });

  getTrip = catchAsync(async (req: AuthRequest, res: Response) => {
    const trip = await tripService.getTripById(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: trip,
      error: null,
    });
  });

  updateTripStatus = catchAsync(async (req: AuthRequest, res: Response) => {
    const trip = await tripService.updateTripStatus(
      req.params.id,
      req.user!.id,
      req.user!.role,
      req.body
    );

    res.status(200).json({
      success: true,
      data: trip,
      error: null,
    });
  });

  listTrips = catchAsync(async (req: AuthRequest, res: Response) => {
    const trips = await tripService.getTripsForUser(req.user! as any);

    res.status(200).json({
      success: true,
      data: trips,
      error: null,
    });
  });

  // Additional methods: assignDriver, cancelTrip, etc.
}

export const tripController = new TripController();

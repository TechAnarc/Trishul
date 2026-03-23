import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { driverService } from './driver.service';

export const driverController = {

  // GET /api/v1/driver/profile
  getProfile: async (req: AuthRequest, res: Response) => {
    const driver = await driverService.getProfile(req.user!.id);
    res.json({ success: true, data: driver });
  },

  // PATCH /api/v1/driver/profile
  updateProfile: async (req: AuthRequest, res: Response) => {
    const driver = await driverService.updateProfile(req.user!.id, req.body);
    res.json({ success: true, data: driver, message: 'Profile updated' });
  },

  // PATCH /api/v1/driver/availability
  setAvailability: async (req: AuthRequest, res: Response) => {
    const { isAvailable } = req.body;
    const driver = await driverService.setAvailability(req.user!.id, isAvailable);
    res.json({ success: true, data: { isAvailable: driver.isAvailable }, message: `You are now ${isAvailable ? 'Online' : 'Offline'}` });
  },

  // GET /api/v1/driver/trips?status=IN_PROGRESS
  getMyTrips: async (req: AuthRequest, res: Response) => {
    const status = req.query.status as string | undefined;
    const trips = await driverService.getMyTrips(req.user!.id, status);
    res.json({ success: true, data: trips, count: trips.length });
  },

  // GET /api/v1/driver/trips/active
  getActiveTrip: async (req: AuthRequest, res: Response) => {
    const trip = await driverService.getActiveTrip(req.user!.id);
    res.json({ success: true, data: trip });
  },

  // GET /api/v1/driver/trips/:tripId
  getTripDetails: async (req: AuthRequest, res: Response) => {
    const trip = await driverService.getTripDetails(req.user!.id, req.params.tripId);
    res.json({ success: true, data: trip });
  },

  // POST /api/v1/driver/location
  pushLocation: async (req: AuthRequest, res: Response) => {
    const log = await driverService.pushLocation(req.user!.id, req.body);
    res.status(201).json({ success: true, data: log, message: 'GPS location recorded' });
  },

  // GET /api/v1/driver/trips/:tripId/location-history
  getLocationHistory: async (req: AuthRequest, res: Response) => {
    const history = await driverService.getLocationHistory(req.user!.id, req.params.tripId);
    res.json({ success: true, data: history, count: history.length });
  },

  // POST /api/v1/driver/expenses
  submitExpense: async (req: AuthRequest, res: Response) => {
    const expense = await driverService.submitExpense(req.user!.id, req.body);
    res.status(201).json({ success: true, data: expense, message: 'Expense submitted for review' });
  },

  // GET /api/v1/driver/expenses?tripId=xxx
  getMyExpenses: async (req: AuthRequest, res: Response) => {
    const tripId = req.query.tripId as string | undefined;
    const expenses = await driverService.getMyExpenses(req.user!.id, tripId);
    res.json({ success: true, data: expenses });
  },

  // GET /api/v1/driver/ledger
  getLedger: async (req: AuthRequest, res: Response) => {
    const ledger = await driverService.getLedger(req.user!.id);
    res.json({ success: true, data: ledger });
  },
};

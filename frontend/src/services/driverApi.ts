/**
 * Trishul Driver API Service
 * Complete typed service layer connecting the React Native frontend
 * to the backend REST + Socket.IO tracking stack.
 */
import api from './api';

// ── Types ────────────────────────────────────────────────────────────────────

export interface DriverProfile {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string | null;
  experience: number;
  isAvailable: boolean;
  emergencyPhone: string | null;
  address: string | null;
  user: { id: string; name: string; email: string; phone: string | null };
  assignedVehicle: Array<{
    vehicle: {
      vehicleNumber: string;
      model: string;
      make: string | null;
      fuelType: string;
    };
  }>;
}

export interface Trip {
  id: string;
  tripCode: string;
  startLocation: string;
  endLocation: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
  startTime: string | null;
  endTime: string | null;
  scheduledAt: string | null;
  estimatedDistance: number | null;
  distance: number | null;
  notes: string | null;
  clientName: string | null;
  clientPhone: string | null;
  vehicle: { vehicleNumber: string; model: string };
  expenses: Array<{ amount: number; category: string; isVerified: boolean }>;
  invoice: { totalFare: number; status: string } | null;
}

export interface LocationLog {
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  timestamp: string;
}

export interface Expense {
  id: string;
  tripId: string;
  category: string;
  amount: number;
  note: string | null;
  receiptUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  trip: { startLocation: string; endLocation: string };
}

export interface DriverLedger {
  totalTrips: number;
  completedTrips: number;
  totalEarnings: number;
  totalExpenses: number;
  netEarnings: number;
  dailyBreakdown: Array<{ date: string; amount: number }>;
  expenseByCategory: Record<string, number>;
}

// ── Driver Profile API ────────────────────────────────────────────────────────

export const driverApi = {
  /** Fetch the logged-in driver's full profile with assigned vehicle */
  getProfile: async (): Promise<DriverProfile> => {
    const res = await api.get('/driver/profile');
    return res.data.data;
  },

  /** Update address, emergency phone, etc. */
  updateProfile: async (data: Partial<Pick<DriverProfile, 'emergencyPhone' | 'address'>>): Promise<DriverProfile> => {
    const res = await api.patch('/driver/profile', data);
    return res.data.data;
  },

  /** Go online / offline */
  setAvailability: async (isAvailable: boolean): Promise<{ isAvailable: boolean; message: string }> => {
    const res = await api.patch('/driver/availability', { isAvailable });
    return { isAvailable: res.data.data.isAvailable, message: res.data.message };
  },

  // ── Trips ────────────────────────────────────────────────────────────────

  /** Get all trips for this driver. Pass status to filter */
  getMyTrips: async (status?: string): Promise<Trip[]> => {
    const res = await api.get('/driver/trips', { params: status ? { status } : undefined });
    return res.data.data;
  },

  /** Get the single currently active IN_PROGRESS trip (with latest GPS point) */
  getActiveTrip: async (): Promise<Trip | null> => {
    const res = await api.get('/driver/trips/active');
    return res.data.data;
  },

  /** Get full trip detail including all location logs and invoice */
  getTripDetails: async (tripId: string): Promise<Trip> => {
    const res = await api.get(`/driver/trips/${tripId}`);
    return res.data.data;
  },

  // ── GPS / Live Tracking ──────────────────────────────────────────────────

  /**
   * REST GPS push — used as fallback when Socket.IO cannot maintain connection.
   * PRIMARY path is Socket.IO in useLocationTracking hook.
   */
  pushLocation: async (payload: {
    tripId: string;
    latitude: number;
    longitude: number;
    speed: number;
    heading?: number;
    altitude?: number;
    timestamp?: string;
  }): Promise<LocationLog> => {
    const res = await api.post('/driver/location', payload);
    return res.data.data;
  },

  /** Fetch full GPS breadcrumb trail for a completed or active trip */
  getLocationHistory: async (tripId: string): Promise<LocationLog[]> => {
    const res = await api.get(`/driver/trips/${tripId}/location-history`);
    return res.data.data;
  },

  // ── Expenses ─────────────────────────────────────────────────────────────

  /** Get all driver expenses. Opionally filter by tripId */
  getMyExpenses: async (tripId?: string): Promise<Expense[]> => {
    const res = await api.get('/driver/expenses', { params: tripId ? { tripId } : undefined });
    return res.data.data;
  },

  /** Submit a new expense (fuel, toll, food, etc.) */
  submitExpense: async (data: {
    tripId: string;
    category: string;
    amount: number;
    note?: string;
    receiptUrl?: string;
  }): Promise<Expense> => {
    const res = await api.post('/driver/expenses', data);
    return res.data.data;
  },

  // ── Ledger / Analytics ───────────────────────────────────────────────────

  /** Fetch aggregated driver ledger: earnings, expenses, daily breakdown, rating etc. */
  getLedger: async (): Promise<DriverLedger> => {
    const res = await api.get('/driver/ledger');
    return res.data.data;
  },

  // ── Tracking (Admin / Shared) ────────────────────────────────────────────

  /** Get latest GPS position for a trip (poll-based live tracker) */
  getLatestLocation: async (tripId: string): Promise<LocationLog | null> => {
    const res = await api.get(`/tracking/trip/${tripId}/latest`);
    return res.data.data;
  },

  /** Get full route polyline coordinates for map replay */
  getRoutePolyline: async (tripId: string): Promise<LocationLog[]> => {
    const res = await api.get(`/tracking/trip/${tripId}/route`);
    return res.data.data;
  },
};

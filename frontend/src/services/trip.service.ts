import api from './api';
import { TripStatus } from '../constants';

export interface Trip {
  id: string;
  tripCode: string;
  driverId: string;
  vehicleId: string;
  clientName?: string;
  clientPhone?: string;
  startLocation: string;
  endLocation: string;
  waypoints?: string[];
  distance?: number;
  estimatedDistance?: number;
  status: TripStatus;
  startTime?: string;
  endTime?: string;
  scheduledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: any;
  driver?: any;
}

export interface CreateTripDTO {
  driverId: string;
  vehicleId: string;
  clientName?: string;
  clientPhone?: string;
  startLocation: string;
  endLocation: string;
  waypoints?: string[];
  scheduledAt?: string;
  notes?: string;
}

export interface UpdateTripStatusDTO {
  status: TripStatus;
  notes?: string;
  distance?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

class TripService {
  private readonly endpoint = '/trip';

  async getTrips(): Promise<Trip[]> {
    const response = await api.get(this.endpoint);
    return response.data.data;
  }

  async getTripById(id: string): Promise<Trip> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data.data;
  }

  async createTrip(data: CreateTripDTO): Promise<Trip> {
    const response = await api.post(this.endpoint, data);
    return response.data.data;
  }

  async updateStatus(id: string, data: UpdateTripStatusDTO): Promise<Trip> {
    const response = await api.patch(`${this.endpoint}/${id}/status`, data);
    return response.data.data;
  }
}

export const tripService = new TripService();

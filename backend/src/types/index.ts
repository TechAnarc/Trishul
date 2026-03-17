// Trishul Shared Types
// Shared between mobile and backend for type safety

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'DRIVER';

export type MfaMethod = 'TOTP' | 'EMAIL_OTP' | 'SMS_OTP';

export type TripStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';

export type VehicleStatus = 'ACTIVE' | 'MAINTENANCE' | 'RETIRED' | 'AVAILABLE';

export type FuelType = 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID';

export type ExpenseCategory =
  | 'FUEL'
  | 'TOLL'
  | 'FOOD'
  | 'MAINTENANCE'
  | 'ACCOMMODATION'
  | 'PARKING'
  | 'PERMIT'
  | 'POLICE'
  | 'OTHER';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isMfaEnabled: boolean;
  mfaMethod?: MfaMethod;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

// Auth types
export interface LoginResult {
  requiresMfa: boolean;
  userId?: string;
  mfaMethod?: MfaMethod;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  user?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

// Vehicle types
export interface Vehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  make?: string;
  year?: number;
  fuelType: FuelType;
  status: VehicleStatus;
  insuranceExpiry?: string;
  permitExpiry?: string;
  ratePerKm: number;
}

// Driver types
export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  experience: number;
  isAvailable: boolean;
  user: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
}

// Trip types
export interface Trip {
  id: string;
  tripCode: string;
  driverId: string;
  vehicleId: string;
  clientName?: string;
  clientPhone?: string;
  startLocation: string;
  endLocation: string;
  distance?: number;
  status: TripStatus;
  startTime?: string;
  endTime?: string;
  scheduledAt?: string;
}

// Location tracking
export interface LocationUpdate {
  tripId: string;
  driverId?: string;
  driverName?: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading?: number;
  timestamp: string;
}

// Expense types
export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  amount: number;
  note?: string;
  isVerified: boolean;
  createdAt: string;
}

// Invoice types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  tripId: string;
  totalDistance: number;
  ratePerKm: number;
  baseFare: number;
  tollCharges: number;
  totalFare: number;
  status: InvoiceStatus;
  createdAt: string;
}

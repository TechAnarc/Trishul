import { Application } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
// import driverRoutes from '../modules/driver/driver.routes';
// import vehicleRoutes from '../modules/vehicle/vehicle.routes';
import tripRoutes from '../modules/trip/trip.routes';

const API_VERSION = '/api/v1';

export function setupRoutes(app: Application): void {
  app.use(`${API_VERSION}/auth`, authRoutes);
  app.use(`${API_VERSION}/admin`, adminRoutes);
  app.use(`${API_VERSION}/trip`, tripRoutes);
  // app.use(`${API_VERSION}/invoice`, invoiceRoutes);
  // app.use(`${API_VERSION}/expense`, expenseRoutes);
  // app.use(`${API_VERSION}/tracking`, trackingRoutes);
  // app.use(`${API_VERSION}/analytics`, analyticsRoutes);
}

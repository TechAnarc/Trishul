import { Application } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import driverRoutes from '../modules/driver/driver.routes';
import tripRoutes from '../modules/trip/trip.routes';
import expenseRoutes from '../modules/expense/expense.routes';
import trackingRoutes from '../modules/tracking/tracking.routes';

const API_VERSION = '/api/v1';

export function setupRoutes(app: Application): void {
  app.use(`${API_VERSION}/auth`, authRoutes);
  app.use(`${API_VERSION}/admin`, adminRoutes);
  app.use(`${API_VERSION}/driver`, driverRoutes);
  app.use(`${API_VERSION}/trip`, tripRoutes);
  app.use(`${API_VERSION}/expenses`, expenseRoutes);
  app.use(`${API_VERSION}/tracking`, trackingRoutes);
}

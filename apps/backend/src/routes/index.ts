import { Application } from 'express';
import authRoutes from '../modules/auth/auth.routes';
// Future modules – uncomment as implemented:
// import adminRoutes from '../modules/admin/admin.routes';
// import driverRoutes from '../modules/drivers/driver.routes';
// import vehicleRoutes from '../modules/vehicles/vehicle.routes';
// import tripRoutes from '../modules/trips/trip.routes';
// import invoiceRoutes from '../modules/invoices/invoice.routes';
// import expenseRoutes from '../modules/expenses/expense.routes';
// import trackingRoutes from '../modules/tracking/tracking.routes';
// import analyticsRoutes from '../modules/analytics/analytics.routes';

const API_VERSION = '/api/v1';

export function setupRoutes(app: Application): void {
  app.use(`${API_VERSION}/auth`, authRoutes);
  // app.use(`${API_VERSION}/admin`, adminRoutes);
  // app.use(`${API_VERSION}/drivers`, driverRoutes);
  // app.use(`${API_VERSION}/vehicles`, vehicleRoutes);
  // app.use(`${API_VERSION}/trips`, tripRoutes);
  // app.use(`${API_VERSION}/invoices`, invoiceRoutes);
  // app.use(`${API_VERSION}/expenses`, expenseRoutes);
  // app.use(`${API_VERSION}/tracking`, trackingRoutes);
  // app.use(`${API_VERSION}/analytics`, analyticsRoutes);
}

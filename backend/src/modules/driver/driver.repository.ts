import { prisma } from '../../config/database';
import { UpdateDriverProfileInput, PushLocationInput } from './driver.schema';

export const driverRepository = {
  // ── Profile ────────────────────────────────────────────────────────────────

  async findByUserId(userId: string) {
    return prisma.driver.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, createdAt: true },
        },
        assignedVehicle: {
          where: { isActive: true },
          include: { vehicle: true },
          take: 1,
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.driver.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        assignedVehicle: {
          where: { isActive: true },
          include: { vehicle: true },
          take: 1,
        },
      },
    });
  },

  async updateProfile(driverId: string, data: Partial<UpdateDriverProfileInput>) {
    return prisma.driver.update({
      where: { id: driverId },
      data,
    });
  },

  // ── Trips ──────────────────────────────────────────────────────────────────

  async getDriverTrips(driverId: string, status?: string) {
    return prisma.trip.findMany({
      where: {
        driverId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        vehicle: { select: { vehicleNumber: true, model: true } },
        expenses: { select: { amount: true, category: true, isVerified: true } },
        invoice: { select: { totalFare: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getActiveTrip(driverId: string) {
    return prisma.trip.findFirst({
      where: {
        driverId,
        status: 'IN_PROGRESS',
      },
      include: {
        vehicle: true,
        expenses: true,
        locationLogs: {
          orderBy: { timestamp: 'desc' },
          take: 1, // latest GPS point
        },
      },
    });
  },

  async getTripByIdForDriver(tripId: string, driverId: string) {
    return prisma.trip.findFirst({
      where: { id: tripId, driverId },
      include: {
        vehicle: true,
        expenses: true,
        locationLogs: { orderBy: { timestamp: 'asc' } },
        invoice: true,
      },
    });
  },

  // ── GPS Location Logging ───────────────────────────────────────────────────

  async pushLocation(data: PushLocationInput & { driverId: string }) {
    // Verify trip belongs to driver
    const trip = await prisma.trip.findFirst({
      where: { id: data.tripId, driverId: data.driverId, status: 'IN_PROGRESS' },
    });
    if (!trip) return null;

    return prisma.locationLog.create({
      data: {
        tripId: data.tripId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed ?? 0,
        heading: data.heading ?? null,
        altitude: data.altitude ?? null,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      },
    });
  },

  async getLocationHistory(tripId: string, driverId: string) {
    const trip = await prisma.trip.findFirst({ where: { id: tripId, driverId } });
    if (!trip) return null;
    return prisma.locationLog.findMany({
      where: { tripId },
      orderBy: { timestamp: 'asc' },
    });
  },

  // ── Expenses ───────────────────────────────────────────────────────────────

  async submitExpense(data: {
    tripId: string;
    driverId: string;
    adminId: string;
    category: any;
    amount: number;
    note?: string;
    receiptUrl?: string;
  }) {
    return prisma.expense.create({ data });
  },

  async getDriverExpenses(driverId: string, tripId?: string) {
    return prisma.expense.findMany({
      where: { driverId, ...(tripId ? { tripId } : {}) },
      include: { trip: { select: { startLocation: true, endLocation: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ── Analytics / Ledger ────────────────────────────────────────────────────

  async getDriverAnalytics(driverId: string) {
    const [totalTrips, completedTrips, expenses, recentTrips] = await Promise.all([
      // Total trips
      prisma.trip.count({ where: { driverId } }),
      // Completed trips
      prisma.trip.findMany({
        where: { driverId, status: 'COMPLETED' },
        include: {
          invoice: { select: { totalFare: true } },
          locationLogs: { select: { timestamp: true }, orderBy: { timestamp: 'asc' } },
        },
      }),
      // All expenses
      prisma.expense.findMany({
        where: { driverId },
        select: { amount: true, category: true, createdAt: true },
      }),
      // Last 7 days trips
      prisma.trip.findMany({
        where: {
          driverId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: 'COMPLETED',
        },
        include: { invoice: { select: { totalFare: true } } },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const totalEarnings = completedTrips.reduce(
      (sum, t) => sum + (t.invoice?.totalFare || 0),
      0
    );
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Compute daily breakdown for last 7 days
    const dailyBreakdown: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyBreakdown[key] = 0;
    }
    recentTrips.forEach((t) => {
      const key = t.createdAt.toISOString().split('T')[0];
      if (key in dailyBreakdown) {
        dailyBreakdown[key] += t.invoice?.totalFare || 0;
      }
    });

    return {
      totalTrips,
      completedTrips: completedTrips.length,
      totalEarnings,
      totalExpenses,
      netEarnings: totalEarnings - totalExpenses,
      dailyBreakdown: Object.entries(dailyBreakdown).map(([date, amount]) => ({ date, amount })),
      expenseByCategory: expenses.reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {}),
    };
  },
};

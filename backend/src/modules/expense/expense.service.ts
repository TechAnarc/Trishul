import { prisma } from '../../config/database';
import { NotFoundError } from '../../middleware/errorHandler';


export class ExpenseService {
  // Admin: list all expenses for agency
  async listExpenses(adminId: string, filters: { tripId?: string; driverId?: string; verified?: boolean }) {
    return prisma.expense.findMany({
      where: {
        adminId,
        ...(filters.tripId ? { tripId: filters.tripId } : {}),
        ...(filters.driverId ? { driverId: filters.driverId } : {}),
        ...(filters.verified !== undefined ? { isVerified: filters.verified } : {}),
      },
      include: {
        driver: { include: { user: { select: { name: true } } } },
        trip: { select: { startLocation: true, endLocation: true, tripCode: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin: verify or reject expense
  async verifyExpense(expenseId: string, adminId: string, isVerified: boolean) {
    const expense = await prisma.expense.findFirst({ where: { id: expenseId, adminId } });
    if (!expense) throw new NotFoundError('Expense');
    return prisma.expense.update({
      where: { id: expenseId },
      data: { isVerified },
    });
  }

  // Aggregate expense summary for a trip
  async getExpenseSummaryForTrip(tripId: string, adminId: string) {
    const expenses = await prisma.expense.findMany({
      where: { tripId, adminId },
      select: { amount: true, category: true, isVerified: true },
    });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const verified = expenses.filter((e) => e.isVerified).reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    return { total, verified, pending: total - verified, byCategory, count: expenses.length };
  }
}

export const expenseService = new ExpenseService();

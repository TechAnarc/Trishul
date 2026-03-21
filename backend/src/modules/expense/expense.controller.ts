import { Request, Response } from 'express';
import { expenseService } from './expense.service';

export const expenseController = {
  listExpenses: async (req: Request, res: Response) => {
    const { tripId, driverId, verified } = req.query;
    const expenses = await expenseService.listExpenses((req as any).adminId, {
      tripId: tripId as string,
      driverId: driverId as string,
      verified: verified !== undefined ? verified === 'true' : undefined,
    });
    res.json({ success: true, data: expenses });
  },

  verifyExpense: async (req: Request, res: Response) => {
    const expense = await expenseService.verifyExpense(
      req.params.id,
      (req as any).adminId,
      req.body.isVerified
    );
    res.json({ success: true, data: expense });
  },

  getExpenseSummary: async (req: Request, res: Response) => {
    const summary = await expenseService.getExpenseSummaryForTrip(req.params.tripId, (req as any).adminId);
    res.json({ success: true, data: summary });
  },
};

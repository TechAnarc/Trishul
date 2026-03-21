import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    category: z.enum(['FUEL', 'TOLL', 'FOOD', 'MAINTENANCE', 'ACCOMMODATION', 'PARKING', 'PERMIT', 'POLICE', 'OTHER']),
    amount: z.number().positive(),
    note: z.string().max(500).optional(),
    receiptUrl: z.string().url().optional(),
  }),
});

export const verifyExpenseSchema = z.object({
  body: z.object({
    isVerified: z.boolean(),
  }),
});

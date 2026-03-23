import { z } from 'zod';

// Driver profile update
export const updateDriverProfileSchema = z.object({
  body: z.object({
    emergencyPhone: z.string().optional(),
    address: z.string().optional(),
    isAvailable: z.boolean().optional(),
  }),
});

// Driver GPS location push (REST fallback when socket unavailable)
export const pushLocationSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    speed: z.number().min(0).default(0),
    heading: z.number().min(0).max(360).optional(),
    altitude: z.number().optional(),
    timestamp: z.string().datetime().optional(),
  }),
});

// Update driver availability (go online/offline)
export const updateAvailabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean(),
  }),
});

// Expense submission by driver
export const submitExpenseSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    category: z.enum(['FUEL', 'TOLL', 'FOOD', 'MAINTENANCE', 'ACCOMMODATION', 'PARKING', 'PERMIT', 'POLICE', 'OTHER']),
    amount: z.number().positive(),
    note: z.string().max(500).optional(),
    receiptUrl: z.string().url().optional(),
  }),
});

export type UpdateDriverProfileInput = z.infer<typeof updateDriverProfileSchema>['body'];
export type PushLocationInput = z.infer<typeof pushLocationSchema>['body'];
export type SubmitExpenseInput = z.infer<typeof submitExpenseSchema>['body'];

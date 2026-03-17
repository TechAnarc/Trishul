import { z } from 'zod';

export const createAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required').max(100, 'Name must be below 100 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    agencyName: z.string().min(2, 'Agency name is required').max(150, 'Agency name must be below 150 characters'),
    phone: z.string().optional(),
  }),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>['body'];

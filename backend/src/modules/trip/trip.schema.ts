import { z } from 'zod';
import { TripStatus } from '@prisma/client';

export const createTripSchema = z.object({
  body: z.object({
    driverId: z.string().uuid('Invalid driver ID'),
    vehicleId: z.string().uuid('Invalid vehicle ID'),
    clientName: z.string().min(2, 'Client name too short').optional(),
    clientPhone: z.string().optional(),
    startLocation: z.string().min(2, 'Start location required'),
    endLocation: z.string().min(2, 'End location required'),
    waypoints: z.array(z.string()).optional(),
    scheduledAt: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
});

export const updateTripStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TripStatus),
    notes: z.string().optional(),
    distance: z.number().optional(),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
  }),
});

export const assignDriverSchema = z.object({
  body: z.object({
    driverId: z.string().uuid('Invalid driver ID'),
  }),
});

export type CreateTripInput = z.infer<typeof createTripSchema>['body'];
export type UpdateTripStatusInput = z.infer<typeof updateTripStatusSchema>['body'];

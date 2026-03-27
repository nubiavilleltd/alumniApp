// features/events/schemas/event.schema.ts

import { z } from 'zod';

// Base schema for both create and update
export const eventBaseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(3, 'Location is required'),
  event_date: z.string().min(1, 'Event date is required'),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  color: z.string().default('#4f46e5'),
  visibility: z.enum(['public', 'members', 'premium']).default('public'),
  status: z.enum(['upcoming', 'active', 'cancelled', 'completed']).default('upcoming'),
  max_attendees: z.number().min(0).default(0),
});

// For create event (includes optional banner)
export const createEventSchema = eventBaseSchema.extend({
  event_banner: z.any().optional(),
});

// For update event (no banner needed)
export const updateEventSchema = eventBaseSchema;

export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventSchema>;

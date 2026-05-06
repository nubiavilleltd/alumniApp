// features/events/schemas/event.schema.ts

import { z } from 'zod';

// Base schema for both create and update
// export const eventBaseSchema = z.object({
//   title: z.string().min(3, 'Title must be at least 3 characters'),
//   description: z.string().min(10, 'Description must be at least 10 characters'),
//   location: z.string().min(3, 'Location is required'),
//   event_date: z.string().min(1, 'Event date is required'),
//   start_time: z.string().optional(),
//   end_time: z.string().optional(),
//   color: z.string().default('#4f46e5'),
//   visibility: z.enum(['public', 'members', 'premium']).default('public'),
//   status: z.enum(['upcoming', 'active', 'cancelled', 'completed']).default('upcoming'),
//   max_attendees: z.number().min(0).default(0),
// });

// export const eventBaseSchema = z
//   .object({
//     title: z.string().min(3, 'Event Title must be at least 3 characters'),
//     description: z.string().min(10, 'Event Details must be at least 10 characters'),
//     location: z.string().min(1, 'Location is required'),
//     start_date: z.string().min(1, 'Start date is required'),
//     end_date: z.string().optional(),
//     start_time: z.string().min(1, 'Start Time is required'),
//     end_time: z.string().optional(),
//     visibility: z.enum(['public', 'members', 'premium']),
//     status: z.enum(['upcoming', 'active', 'completed']),
//     // max_attendees: z.number({ error: 'Please enter a valid number' }).min(0).default(0),
//   })
//   .refine(
//     (data) => {
//       if (!data.start_date) return true;
//       const selectedDate = new Date(data.start_date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return selectedDate >= today;
//     },
//     { message: 'Start Date cannot be in the past', path: ['start_date'] },
//   )
//   .refine(
//     (data) => {
//       if (!data.end_date) return true;
//       const selectedDate = new Date(data.end_date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return selectedDate >= today;
//     },
//     { message: 'End Date cannot be in the past', path: ['end_date'] },
//   )
//   .refine(
//     (d) => {
//       if (!d.start_time || !d.end_time) return true;
//       return d.end_time > d.start_time;
//     },
//     { message: 'End time must be after start time', path: ['end_time'] },
//   );

// export const eventBaseSchema = z
//   .object({
//     title: z.string().min(3, 'Event Title must be at least 3 characters'),
//     description: z.string().min(10, 'Event Details must be at least 10 characters'),
//     location: z.string().min(1, 'Location is required'),

//     start_date: z.string().min(1, 'Start date is required'),
//     end_date: z.string().optional(),

//     start_time: z.string().min(1, 'Start Time is required'),
//     end_time: z.string().optional(),

//     visibility: z.enum(['public', 'members', 'premium']),
//     status: z.enum(['upcoming', 'active', 'completed']),
//   })
//   .superRefine((data, ctx) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startDate = new Date(data.start_date);

//     const endDate = data.end_date
//       ? new Date(data.end_date)
//       : startDate;

//     // 1. Start date cannot be past
//     if (startDate < today) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ['start_date'],
//         message: 'Start date cannot be in the past',
//       });
//     }

//     // 2. End date cannot be before start date
//     if (endDate < startDate) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ['end_date'],
//         message: 'End date cannot be before start date',
//       });
//     }

//     if (data.start_time && data.end_time) {
//       const [startH, startM] = data.start_time.split(':').map(Number);
//       const [endH, endM] = data.end_time.split(':').map(Number);

//       const startMinutes = startH * 60 + startM;
//       const endMinutes = endH * 60 + endM;

//       const sameDay =
//         startDate.toDateString() === endDate.toDateString();

//       // 3. Same-day: end must be after start
//       if (sameDay && endMinutes <= startMinutes) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           path: ['end_time'],
//           message: 'End time must be after start time',
//         });
//       }

//       // 4. If event starts today, start time must not already be past
//       const isToday =
//         startDate.toDateString() === new Date().toDateString();

//       if (isToday) {
//         const now = new Date();
//         const currentMinutes =
//           now.getHours() * 60 + now.getMinutes();

//         if (startMinutes <= currentMinutes) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             path: ['start_time'],
//             message: 'Start time must be later than current time',
//           });
//         }
//       }
//     }
//   });

// export const eventBaseSchema = z
//   .object({
//     title: z.string().min(3, 'Event Title must be at least 3 characters'),
//     description: z.string().min(10, 'Event Details must be at least 10 characters'),
//     location: z.string().min(1, 'Location is required'),

//     start_date: z.string().min(1, 'Start date is required'),
//     end_date: z.string().optional(),

//     start_time: z.string().min(1, 'Start Time is required'),
//     end_time: z.string().optional(),

//     visibility: z.enum(['public', 'members', 'premium']),
//     status: z.enum(['upcoming', 'active', 'completed']),
//   })
//   .superRefine((data, ctx) => {
//     const now = new Date();

//     // Normalize "today"
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startDate = new Date(data.start_date);
//     const endDate = data.end_date ? new Date(data.end_date) : startDate;

//     // 🟡 1. Start date cannot be in the past
//     if (startDate < today) {
//       ctx.addIssue({
//         code: 'custom',
//         path: ['start_date'],
//         message: 'Start date cannot be in the past',
//       });
//     }

//     // 🟡 2. End date must not be before start date
//     if (endDate < startDate) {
//       ctx.addIssue({
//         code: 'custom',
//         path: ['end_date'],
//         message: 'End date cannot be before start date',
//       });
//     }

//     // 🟡 3. Time validation
//     if (data.start_time && data.end_time) {
//       const [sh, sm] = data.start_time.split(':').map(Number);
//       const [eh, em] = data.end_time.split(':').map(Number);

//       const startMinutes = sh * 60 + sm;
//       const endMinutes = eh * 60 + em;

//       const sameDay =
//         !data.end_date || data.end_date === data.start_date;

//       if (sameDay && endMinutes <= startMinutes) {
//         ctx.addIssue({
//           code: 'custom',
//           path: ['end_time'],
//           message: 'End time must be after start time',
//         });
//       }
//     }

//     // 🟡 4. If event is today → start time must be in the future
//     if (data.start_time) {
//       const [sh, sm] = data.start_time.split(':').map(Number);

//       const startOfToday = new Date();
//       startOfToday.setHours(0, 0, 0, 0);

//       const isToday = startDate.getTime() === startOfToday.getTime();

//       if (isToday) {
//         const currentMinutes = now.getHours() * 60 + now.getMinutes();
//         const startMinutes = sh * 60 + sm;

//         if (startMinutes <= currentMinutes) {
//           ctx.addIssue({
//             code: 'custom',
//             path: ['start_time'],
//             message: 'Start time must be later than current time',
//           });
//         }
//       }
//     }
//   });

// ─── Helpers ──────────────────────────────────────────────────────────────────

// function parseTimeToMinutes(time: string): number {
//   const [h, m] = time.split(':').map(Number);
//   return h * 60 + m;
// }

// function toLocalMidnight(dateStr: string): Date {
//   // "YYYY-MM-DD" → local midnight, avoiding UTC offset gotchas
//   const [y, mo, d] = dateStr.split('-').map(Number);
//   return new Date(y, mo - 1, d);
// }

// // ─── Schema ───────────────────────────────────────────────────────────────────

// export const eventBaseSchema = z
//   .object({
//     title:       z.string().min(3, 'Title must be at least 3 characters'),
//     description: z.string().min(10, 'Details must be at least 10 characters'),
//     location:    z.string().min(1, 'Location is required'),
//     visibility:  z.enum(['public', 'members', 'premium']),
//     status:      z.enum(['upcoming', 'active', 'completed']),

//     start_date: z.string().min(1, 'Start date is required'),
//     end_date:   z.string().optional(),

//     start_time: z.string().min(1, 'Start time is required'),
//     end_time:   z.string().optional(),
//   })
//   .superRefine((data, ctx) => {
//     const now        = new Date();
//     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const startDate  = toLocalMidnight(data.start_date);
//     const endDate    = data.end_date ? toLocalMidnight(data.end_date) : null;

//     // 1. Start date not in the past
//     if (startDate < todayStart) {
//       ctx.addIssue({
//         code: 'custom',
//         path: ['start_date'],
//         message: 'Start date cannot be in the past',
//       });
//     }

//     // 2. End date not before start date
//     if (endDate && endDate < startDate) {
//       ctx.addIssue({
//         code: 'custom',
//         path: ['end_date'],
//         message: 'End date cannot be before start date',
//       });
//     }

//     // 3. If today → start time must be in the future
//     const isStartToday = startDate.getTime() === todayStart.getTime();
//     if (data.start_time && isStartToday) {
//       const currentMinutes = now.getHours() * 60 + now.getMinutes();
//       if (parseTimeToMinutes(data.start_time) <= currentMinutes) {
//         ctx.addIssue({
//           code: 'custom',
//           path: ['start_time'],
//           message: 'Start time must be later than the current time',
//         });
//       }
//     }

//     // 4. End time must be after start time (only when same day)
//     const isSameDay = !data.end_date || data.end_date === data.start_date;
//     if (data.start_time && data.end_time && isSameDay) {
//       if (parseTimeToMinutes(data.end_time) <= parseTimeToMinutes(data.start_time)) {
//         ctx.addIssue({
//           code: 'custom',
//           path: ['end_time'],
//           message: 'End time must be after start time',
//         });
//       }
//     }
//   });

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toLocalMidnight(dateStr: string): Date {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d);
}

export const eventBaseSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Details must be at least 10 characters'),
    location: z.string().min(1, 'Location is required'),
    visibility: z.enum(['public', 'members', 'premium']),
    status: z.enum(['upcoming', 'active', 'completed']),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional(),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().optional(),
    event_banner: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Guard: don't run any cross-field rule if start_date isn't filled yet
    if (!data.start_date) return;

    const startDate = toLocalMidnight(data.start_date);

    // 1. Start date not in the past
    if (startDate < todayStart) {
      ctx.addIssue({
        code: 'custom',
        path: ['start_date'],
        message: 'Start date cannot be in the past',
      });
    }

    // 2. End date not before start date (only if end_date has a value)
    if (data.end_date) {
      const endDate = toLocalMidnight(data.end_date);
      if (endDate < startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['end_date'],
          message: 'End date cannot be before start date',
        });
      }
    }

    // 3. Start time must be in the future if event is today
    const isStartToday = startDate.getTime() === todayStart.getTime();
    if (data.start_time && isStartToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      if (parseTimeToMinutes(data.start_time) <= currentMinutes) {
        ctx.addIssue({
          code: 'custom',
          path: ['start_time'],
          message: 'Start time must be later than the current time',
        });
      }
    }

    // // 4. End time must be after start time on the same day
    // const isSameDay = !data.end_date || data.end_date === data.start_date;
    // if (data.start_time && data.end_time && isSameDay) {
    //   if (parseTimeToMinutes(data.end_time) <= parseTimeToMinutes(data.start_time)) {
    //     ctx.addIssue({
    //       code: 'custom',
    //       path: ['end_time'],
    //       message: 'End time must be after start time',
    //     });
    //   }
    // }

    // In superRefine — be explicit about same-day detection
    const isSameDay = !data.end_date || data.end_date === data.start_date;

    // Without an end_date, it's implicitly the same day as start,
    // so end_time must always be after start_time in that case
    if (data.start_time && data.end_time && isSameDay) {
      if (parseTimeToMinutes(data.end_time) <= parseTimeToMinutes(data.start_time)) {
        ctx.addIssue({
          code: 'custom',
          path: ['end_time'],
          message: 'End time must be after start time',
        });
      }
    }
  });

// For create event (includes optional banner)
// export const createEventSchema = eventBaseSchema.extend({
//   event_banner: z.any().optional(),
// });

// For update event (no banner needed)
export const createEventSchema = eventBaseSchema;
export const updateEventSchema = eventBaseSchema;

export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventSchema>;

// // ─── Schema ───────────────────────────────────────────────────────────────────

// const editEventSchema = z
//   .object({
//     title: z.string().min(3, 'Event Title must be at least 3 characters'),
//     description: z.string().min(10, 'Description must be at least 10 characters'),
//     location: z.string().min(2, 'Location is required'),
//     event_date: z.string().min(1, 'Event date is required'),
//     start_time: z.string().optional(),
//     end_time: z.string().optional(),
//     visibility: z.enum(['public', 'members', 'premium']),
//     // Edit allows all statuses including cancelled — admin may need to cancel an event
//     status: z.enum(['upcoming', 'active', 'cancelled', 'completed']),
//     // max_attendees: z.number({ error: 'Please enter a valid number' }).min(0).default(0),
//   })
//   .refine(
//     (data) => {
//       if (!data.event_date) return true;
//       const selectedDate = new Date(data.event_date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return selectedDate >= today;
//     },
//     { message: 'Event date cannot be in the past', path: ['event_date'] },
//   )
//   .refine(
//     (d) => {
//       if (!d.start_time || !d.end_time) return true;
//       return d.end_time > d.start_time;
//     },
//     { message: 'End time must be after start time', path: ['end_time'] },
//   );

// type EditEventFormData = z.infer<typeof editEventSchema>;

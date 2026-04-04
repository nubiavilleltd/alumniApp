// // features/events/pages/CreateEventPage.tsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Icon } from '@iconify/react';
// import { SEO } from '@/shared/common/SEO';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
// import { SelectInput } from '@/shared/components/ui/SelectInput';
// import { ImageUpload } from '@/shared/components/ui/ImageUpload';
// import Button from '@/shared/components/ui/Button';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { useCreateEvent } from '../hooks/useEvents';
// import { mapEventToCreatePayload } from '../api/adapters/event.adapter';
// import { EVENT_ROUTES } from '../routes';
// import { ROUTES } from '@/shared/constants/routes';

// // Simple schema directly in the file
// const createEventSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   location: z.string().min(1, 'Location is required'),
//   event_date: z.string().min(1, 'Event date is required'),
//   start_time: z.string().optional(),
//   end_time: z.string().optional(),
//   visibility: z.enum(['public', 'members', 'premium']),
//   max_attendees: z.number().optional(),
// });

// type CreateEventFormData = z.infer<typeof createEventSchema>;

// const visibilityOptions = [
//   { label: 'Public (Everyone can see)', value: 'public' },
//   { label: 'Members Only', value: 'members' },
//   { label: 'Premium Members Only', value: 'premium' },
// ];

// export default function CreateEventPage() {
//   const navigate = useNavigate();
//   const currentUser = useAuthStore((state) => state.user);
//   const createEvent = useCreateEvent();
//   const [bannerFile, setBannerFile] = useState<File | null>(null);
//   const [bannerPreview, setBannerPreview] = useState<string>('');

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<CreateEventFormData>({
//     resolver: zodResolver(createEventSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       location: '',
//       event_date: '',
//       start_time: '',
//       end_time: '',
//       visibility: 'public',
//       max_attendees: 0,
//     },
//     mode: 'onChange',
//   });

//   const visibility = watch('visibility');

//   const handleImageChange = (files: File[], previews: string[]) => {
//     if (files.length > 0) {
//       setBannerFile(files[0]);
//       setBannerPreview(previews[0]);
//     } else {
//       setBannerFile(null);
//       setBannerPreview('');
//     }
//   };

//   const onSubmit = (data: CreateEventFormData) => {
//     if (!currentUser?.memberId) {
//       console.error('User must be logged in');
//       return;
//     }

//     const payload = mapEventToCreatePayload(
//       {
//         title: data.title,
//         description: data.description,
//         location: data.location,
//         event_date: data.event_date,
//         start_time: data.start_time,
//         end_time: data.end_time,
//         visibility: data.visibility,
//         max_attendees: data.max_attendees,
//         event_banner: bannerFile,
//       },
//       currentUser.memberId,
//       currentUser.chapterId,
//     );

//     createEvent.mutate(payload, {
//       onSuccess: () => {
//         navigate(EVENT_ROUTES.ROOT);
//       },
//       onError: (error: any) => {
//         console.error('Failed to create event:', error);
//       },
//     });
//   };

//   const breadcrumbItems = [
//     { label: 'Home', href: ROUTES.HOME },
//     { label: 'Events', href: EVENT_ROUTES.ROOT },
//     { label: 'Create Event' },
//   ];

//   // Check if user is admin
//   const isAdmin = currentUser?.role === 'admin';

//   if (!isAdmin) {
//     return (
//       <>
//         <SEO title="Access Denied" />
//         <Breadcrumbs items={breadcrumbItems} />
//         <section className="section">
//           <div className="container-custom text-center">
//             <Icon icon="mdi:lock-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
//             <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
//             <p className="text-gray-600 mb-6">You don't have permission to create events.</p>
//             <Button onClick={() => navigate(EVENT_ROUTES.ROOT)}>Back to Events</Button>
//           </div>
//         </section>
//       </>
//     );
//   }

//   return (
//     <>
//       <SEO title="Create Event" description="Create a new event" />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section">
//         <div className="container-custom max-w-3xl">
//           <div className="mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Create Event</h1>
//             <p className="text-gray-500 text-sm">Add a new event to the alumni calendar</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
//             <FormInput
//               label="Event Title"
//               id="title"
//               required
//               placeholder="e.g., Annual Alumni Reunion 2026"
//               error={errors.title?.message}
//               {...register('title')}
//             />

//             <TextareaInput
//               label="Description"
//               id="description"
//               required
//               rows={4}
//               placeholder="Describe the event..."
//               error={errors.description?.message}
//               {...register('description')}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormInput
//                 label="Location"
//                 id="location"
//                 required
//                 placeholder="Venue name, city"
//                 icon="mdi:map-marker-outline"
//                 error={errors.location?.message}
//                 {...register('location')}
//               />

//               <FormInput
//                 label="Event Date"
//                 id="event_date"
//                 type="date"
//                 required
//                 error={errors.event_date?.message}
//                 {...register('event_date')}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormInput
//                 label="Start Time"
//                 id="start_time"
//                 type="time"
//                 {...register('start_time')}
//               />

//               <FormInput label="End Time" id="end_time" type="time" {...register('end_time')} />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <SelectInput
//                 label="Visibility"
//                 name="visibility"
//                 options={visibilityOptions}
//                 value={visibility}
//                 onChange={(e) => setValue('visibility', e.target.value as any)}
//                 error={errors.visibility?.message}
//               />

//               <FormInput
//                 label="Max Attendees"
//                 id="max_attendees"
//                 type="number"
//                 placeholder="0 = unlimited"
//                 hint="Set to 0 for unlimited capacity"
//                 error={errors.max_attendees?.message}
//                 {...register('max_attendees', { valueAsNumber: true })}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Event Banner Image
//               </label>
//               <ImageUpload
//                 previews={bannerPreview ? [bannerPreview] : []}
//                 onChange={handleImageChange}
//                 hint="PNG or JPG (max 2MB). Recommended size: 1200×600px"
//               />
//             </div>

//             <div className="flex gap-3 pt-4">
//               <Button type="submit" loading={isSubmitting}>
//                 Create Event
//               </Button>
//               <Button type="button" variant="outline" onClick={() => navigate(EVENT_ROUTES.ROOT)}>
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </div>
//       </section>
//     </>
//   );
// }

// features/events/pages/CreateEventPage.tsx
// MODIFIED: Added status field, improved validation, uses EVENT_ROUTES,
// uses currentUser.id (not memberId) for backend payload.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import Button from '@/shared/components/ui/Button';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { useCreateEvent } from '../hooks/useEvents';
import { mapEventToCreatePayload } from '../api/adapters/event.adapter';
import { toast } from '@/shared/components/ui/Toast';
import { EVENT_ROUTES } from '../routes';

// ─── Schema ───────────────────────────────────────────────────────────────────
// Required: title, description, location, event_date, visibility, status
// Optional: start_time, end_time, max_attendees, banner

const createEventSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string().min(2, 'Location is required'),
    event_date: z.string().min(1, 'Event date is required'),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    visibility: z.enum(['public', 'members', 'premium']),
    status: z.enum(['upcoming', 'active', 'completed']),
    max_attendees: z.number({ error: 'Please enter a valid number' }).min(0).default(0),
  })
  .refine(
    (d) => {
      if (!d.start_time || !d.end_time) return true;
      return d.end_time > d.start_time;
    },
    { message: 'End time must be after start time', path: ['end_time'] },
  );

type CreateEventFormData = z.infer<typeof createEventSchema>;

// ─── Options ──────────────────────────────────────────────────────────────────

const visibilityOptions = [
  { label: 'Public — everyone can see', value: 'public' },
  { label: 'Members only', value: 'members' },
  { label: 'Premium members only', value: 'premium' },
];

// Status on create: admin may want to log a completed past event retroactively.
const statusOptions = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateEventPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const createEvent = useCreateEvent();

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [bannerError, setBannerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      location: '',
      event_date: '',
      start_time: '',
      end_time: '',
      visibility: 'public',
      status: 'upcoming',
      max_attendees: 0,
    },
  });

  const visibility = watch('visibility');
  const status = watch('status');

  const handleImageChange = (files: File[], previews: string[]) => {
    setBannerError('');
    if (files.length > 0) {
      const file = files[0];
      // Validate: max 2 MB
      if (file.size > 2 * 1024 * 1024) {
        setBannerError('Image must be under 2 MB');
        return;
      }
      setBannerFile(file);
      setBannerPreview(previews[0]);
    } else {
      setBannerFile(null);
      setBannerPreview(previews[0] ?? '');
    }
  };

  const onSubmit = (data: CreateEventFormData) => {
    if (!currentUser?.id) {
      toast.error('You must be logged in to create events.');
      return;
    }

    const payload = mapEventToCreatePayload(
      {
        title: data.title,
        description: data.description,
        location: data.location,
        event_date: data.event_date,
        start_time: data.start_time,
        end_time: data.end_time,
        visibility: data.visibility,
        status: data.status,
        max_attendees: data.max_attendees,
        event_banner: bannerFile,
      },
      currentUser.id, // ← backend numeric ID, not memberId
      currentUser.chapterId,
    );

    createEvent.mutate(payload, {
      onSuccess: () => navigate(EVENT_ROUTES.ROOT),
      onError: (error: any) => toast.fromError(error),
    });
  };

  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <>
        <SEO title="Access Denied" />
        <section className="section">
          <div className="container-custom text-center">
            <Icon icon="mdi:lock-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to create events.</p>
            <Button onClick={() => navigate(EVENT_ROUTES.ROOT)}>Back to Events</Button>
          </div>
        </section>
      </>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: EVENT_ROUTES.ROOT },
    { label: 'Create Event' },
  ];

  return (
    <>
      <SEO title="Create Event" description="Create a new event" />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Create Event</h1>
            <p className="text-gray-500 text-sm">Add a new event to the alumni calendar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
            {/* ── Core fields ─────────────────────────────────────────── */}
            <FormInput
              label="Event Title"
              id="title"
              required
              placeholder="e.g. Annual Alumni Reunion 2026"
              error={errors.title?.message}
              {...register('title')}
            />

            <TextareaInput
              label="Description"
              id="description"
              required
              rows={4}
              placeholder="Describe the event..."
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Location"
                id="location"
                required
                placeholder="Venue name, city"
                icon="mdi:map-marker-outline"
                error={errors.location?.message}
                {...register('location')}
              />
              <FormInput
                label="Event Date"
                id="event_date"
                type="date"
                required
                error={errors.event_date?.message}
                {...register('event_date')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Start Time"
                id="start_time"
                type="time"
                error={errors.start_time?.message}
                {...register('start_time')}
              />
              <FormInput
                label="End Time"
                id="end_time"
                type="time"
                error={errors.end_time?.message}
                {...register('end_time')}
              />
            </div>

            {/* ── Classification ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                label="Visibility"
                name="visibility"
                required
                options={visibilityOptions}
                value={visibility}
                onChange={(e) => setValue('visibility', e.target.value as any)}
                error={errors.visibility?.message}
              />
              <SelectInput
                label="Status"
                name="status"
                required
                options={statusOptions}
                value={status}
                onChange={(e) => setValue('status', e.target.value as any)}
                error={errors.status?.message}
              />
              <FormInput
                label="Max Attendees"
                id="max_attendees"
                type="number"
                placeholder="0 = unlimited"
                hint="0 = no limit"
                error={errors.max_attendees?.message}
                {...register('max_attendees', { valueAsNumber: true })}
              />
            </div>

            {/* ── Banner image ────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner Image
                <span className="text-xs text-gray-400 font-normal ml-2">Optional</span>
              </label>
              <ImageUpload
                previews={bannerPreview ? [bannerPreview] : []}
                onChange={handleImageChange}
                hint="PNG or JPG — max 2 MB. Recommended: 1200×600 px"
                multiple={false}
                error={bannerError}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={createEvent.isPending}>
                Create Event
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(EVENT_ROUTES.ROOT)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

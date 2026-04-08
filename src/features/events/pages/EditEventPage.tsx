// // features/events/pages/EditEventPage.tsx

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Icon } from '@iconify/react';
// import { SEO } from '@/shared/common/SEO';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
// import { SelectInput } from '@/shared/components/ui/SelectInput';
// import Button from '@/shared/components/ui/Button';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { useEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEvents';
// import { mapEventToUpdatePayload } from '../api/adapters/event.adapter';
// import { EVENT_ROUTES } from '../routes';
// import { ROUTES } from '@/shared/constants/routes';

// // Simple schema directly in the file
// const editEventSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   location: z.string().min(1, 'Location is required'),
//   event_date: z.string().min(1, 'Event date is required'),
//   start_time: z.string().optional(),
//   end_time: z.string().optional(),
//   visibility: z.enum(['public', 'members', 'premium']),
//   status: z.enum(['upcoming', 'active', 'cancelled', 'completed']),
//   max_attendees: z.number().optional(),
// });

// type EditEventFormData = z.infer<typeof editEventSchema>;

// const visibilityOptions = [
//   { label: 'Public (Everyone can see)', value: 'public' },
//   { label: 'Members Only', value: 'members' },
//   { label: 'Premium Members Only', value: 'premium' },
// ];

// const statusOptions = [
//   { label: 'Upcoming', value: 'upcoming' },
//   { label: 'Active', value: 'active' },
//   { label: 'Cancelled', value: 'cancelled' },
//   { label: 'Completed', value: 'completed' },
// ];

// export default function EditEventPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const currentUser = useAuthStore((state) => state.user);
//   const { data: event, isLoading } = useEvent(id || '');
//   const updateEvent = useUpdateEvent();
//   const deleteEvent = useDeleteEvent();
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<EditEventFormData>({
//     resolver: zodResolver(editEventSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       location: '',
//       event_date: '',
//       start_time: '',
//       end_time: '',
//       visibility: 'public',
//       status: 'upcoming',
//       max_attendees: 0,
//     },
//   });

//   const visibility = watch('visibility');
//   const status = watch('status');

//   useEffect(() => {
//     if (event) {
//       reset({
//         title: event.title,
//         description: event.description,
//         location: event.location,
//         event_date: event.date.split('T')[0],
//         start_time: event.startTime || '',
//         end_time: event.endTime || '',
//         visibility: (event as any).visibility || 'public',
//         status: (event as any).status || 'upcoming',
//         max_attendees: event.capacity || 0,
//       });
//     }
//   }, [event, reset]);

//   const onSubmit = (data: EditEventFormData) => {
//     if (!id) return;

//     const payload = mapEventToUpdatePayload(id, {
//       title: data.title,
//       description: data.description,
//       location: data.location,
//       event_date: data.event_date,
//       start_time: data.start_time,
//       end_time: data.end_time,
//       visibility: data.visibility,
//       status: data.status,
//       max_attendees: data.max_attendees,
//     });

//     updateEvent.mutate(
//       { id, payload },
//       {
//         onSuccess: () => {
//           navigate('/events');
//         },
//         onError: (error: any) => {
//           console.error('Failed to update event:', error);
//         },
//       },
//     );
//   };

//   const handleDelete = () => {
//     if (!id) return;
//     deleteEvent.mutate(id, {
//       onSuccess: () => {
//         navigate('/events');
//       },
//     });
//   };

//   const breadcrumbItems = [
//     { label: 'Home', href: ROUTES.HOME },
//     { label: 'Events', href: EVENT_ROUTES.ROOT },
//     { label: event?.title || 'Edit Event' },
//   ];

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
//             <p className="text-gray-600 mb-6">You don't have permission to edit events.</p>
//             <Button onClick={() => navigate(EVENT_ROUTES.ROOT)}>Back to Events</Button>
//           </div>
//         </section>
//       </>
//     );
//   }

//   if (isLoading) {
//     return (
//       <>
//         <SEO title="Loading..." />
//         <Breadcrumbs items={breadcrumbItems} />
//         <section className="section">
//           <div className="container-custom max-w-3xl">
//             <div className="card p-6 animate-pulse">
//               <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
//               <div className="space-y-4">
//                 <div className="h-12 bg-gray-200 rounded" />
//                 <div className="h-24 bg-gray-200 rounded" />
//                 <div className="h-12 bg-gray-200 rounded" />
//               </div>
//             </div>
//           </div>
//         </section>
//       </>
//     );
//   }

//   if (!event) {
//     return (
//       <>
//         <SEO title="Event Not Found" />
//         <Breadcrumbs items={breadcrumbItems} />
//         <section className="section">
//           <div className="container-custom text-center">
//             <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
//             <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
//             <Button onClick={() => navigate(EVENT_ROUTES.ROOT)}>Back to Events</Button>
//           </div>
//         </section>
//       </>
//     );
//   }

//   return (
//     <>
//       <SEO title={`Edit ${event.title}`} description="Edit event details" />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section">
//         <div className="container-custom max-w-3xl">
//           <div className="mb-8 flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Edit Event</h1>
//               <p className="text-gray-500 text-sm">Update event details</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => setShowDeleteConfirm(true)}
//               className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//             >
//               <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
//               Delete Event
//             </button>
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

//               <SelectInput
//                 label="Status"
//                 name="status"
//                 options={statusOptions}
//                 value={status}
//                 onChange={(e) => setValue('status', e.target.value as any)}
//               />
//             </div>

//             <FormInput
//               label="Max Attendees"
//               id="max_attendees"
//               type="number"
//               placeholder="0 = unlimited"
//               hint="Set to 0 for unlimited capacity"
//               error={errors.max_attendees?.message}
//               {...register('max_attendees', { valueAsNumber: true })}
//             />

//             <div className="flex gap-3 pt-4">
//               <Button type="submit" loading={isSubmitting}>
//                 Save Changes
//               </Button>
//               <Button type="button" variant="outline" onClick={() => navigate('/events')}>
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </div>
//       </section>

//       {showDeleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
//             <div className="flex items-start gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
//                 <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-600" />
//               </div>
//               <div>
//                 <h3 className="text-gray-900 font-bold text-lg mb-1">Delete Event?</h3>
//                 <p className="text-gray-600 text-sm">
//                   Are you sure you want to delete{' '}
//                   <span className="font-semibold">{event.title}</span>? This action cannot be
//                   undone.
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 justify-end mt-6">
//               <button
//                 type="button"
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 disabled={deleteEvent.isPending}
//                 className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
//               >
//                 {deleteEvent.isPending ? 'Deleting...' : 'Yes, Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// features/events/pages/EditEventPage.tsx
// MODIFIED: Added banner image upload, uses shared DeleteConfirmModal,
// uses EVENT_ROUTES, uses toast for errors.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEvents';
import { mapEventToUpdatePayload } from '../api/adapters/event.adapter';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { toast } from '@/shared/components/ui/Toast';
import { EVENT_ROUTES } from '../routes';

// ─── Schema ───────────────────────────────────────────────────────────────────

const editEventSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string().min(2, 'Location is required'),
    event_date: z.string().min(1, 'Event date is required'),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    visibility: z.enum(['public', 'members', 'premium']),
    // Edit allows all statuses including cancelled — admin may need to cancel an event
    status: z.enum(['upcoming', 'active', 'cancelled', 'completed']),
    max_attendees: z.number({ error: 'Please enter a valid number' }).min(0).default(0),
  })
  .refine(
    (d) => {
      if (!d.start_time || !d.end_time) return true;
      return d.end_time > d.start_time;
    },
    { message: 'End time must be after start time', path: ['end_time'] },
  );

type EditEventFormData = z.infer<typeof editEventSchema>;

// ─── Options ──────────────────────────────────────────────────────────────────

const visibilityOptions = [
  { label: 'Public — everyone can see', value: 'public' },
  { label: 'Members only', value: 'members' },
  { label: 'Premium members only', value: 'premium' },
];

const statusOptions = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Active', value: 'active' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const { data: event, isLoading } = useEvent(id || '');
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [bannerError, setBannerError] = useState<string>('');
  const [isStatusManuallyChanged, setIsStatusManuallyChanged] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema) as any,
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
  const eventDate = watch('event_date');

  // Populate form when event loads
  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        location: event.location,
        event_date: event.date.split('T')[0],
        start_time: event.startTime || '',
        end_time: event.endTime || '',
        visibility: (event as any).visibility || 'public',
        status: (event as any).status || 'upcoming',
        max_attendees: event.capacity || 0,
      });
      // Pre-fill banner preview with current image if one exists
      if (event.image) setBannerPreview(event.image);
      setIsStatusManuallyChanged(false);
    }
  }, [event, reset]);

  useEffect(() => {
    if (!eventDate || isStatusManuallyChanged) return;

    const selectedDate = new Date(eventDate);
    const today = new Date();

    // Normalize today
    today.setHours(0, 0, 0, 0);

    let computedStatus: 'upcoming' | 'active' | 'completed';

    if (selectedDate > today) {
      computedStatus = 'upcoming';
    } else if (selectedDate.getTime() === today.getTime()) {
      computedStatus = 'active';
    } else {
      computedStatus = 'completed';
    }

    setValue('status', computedStatus);
  }, [eventDate, isStatusManuallyChanged, setValue]);

  const handleImageChange = (files: File[], previews: string[]) => {
    setBannerError('');
    if (files.length > 0) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setBannerError('Image must be under 2 MB');
        return;
      }
      setBannerFile(file);
      setBannerPreview(previews[0]);
    } else {
      // User cleared the image
      setBannerFile(null);
      setBannerPreview(previews[0] ?? '');
    }
  };

  const onSubmit = (data: EditEventFormData) => {
    if (!id) return;

    const payload = mapEventToUpdatePayload(id, {
      title: data.title,
      description: data.description,
      location: data.location,
      event_date: data.event_date,
      start_time: data.start_time,
      end_time: data.end_time,
      visibility: data.visibility,
      status: data.status,
      max_attendees: data.max_attendees,
      // Only include banner if a new file was selected
      ...(bannerFile ? { event_banner: bannerFile } : {}),
    });

    updateEvent.mutate(
      { id, payload },
      {
        onSuccess: () => navigate(EVENT_ROUTES.DETAIL(id)),
        onError: (error: any) => toast.fromError(error),
      },
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deleteEvent.mutate(id, {
      onSuccess: () => navigate(EVENT_ROUTES.ROOT),
      onError: (error: any) => {
        setShowDeleteModal(false);
        toast.fromError(error);
      },
    });
  };

  const isAdmin = currentUser?.role === 'admin';

  // ── Access guard ──────────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <>
        <SEO title="Access Denied" />
        <section className="section">
          <div className="container-custom text-center">
            <Icon icon="mdi:lock-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to edit events.</p>
            <Button onClick={() => navigate(EVENT_ROUTES.ROOT)}>Back to Events</Button>
          </div>
        </section>
      </>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Events', href: EVENT_ROUTES.ROOT },
      { label: 'Edit Event' },
    ];
    return (
      <>
        <SEO title="Loading..." />
        <Breadcrumbs items={breadcrumbItems} />
        <section className="section">
          <div className="container-custom max-w-3xl">
            <div className="card p-6 animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────

  if (!event) {
    return (
      <section className="section">
        <div className="container-custom text-center">
          <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <Button onClick={() => navigate(EVENT_ROUTES.ROOT)}>Back to Events</Button>
        </div>
      </section>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: EVENT_ROUTES.ROOT },
    { label: event.title },
    { label: 'Edit' },
  ];

  return (
    <>
      <SEO title={`Edit — ${event.title}`} description="Edit event details" />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Edit Event</h1>
              <p className="text-gray-500 text-sm">Update event details</p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
            >
              <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
              Delete Event
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
            {/* ── Core ────────────────────────────────────────────────── */}
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
                // onChange={(e) => setValue('status', e.target.value as any)}
                onChange={(e) => {
                  setIsStatusManuallyChanged(true);
                  setValue('status', e.target.value as any);
                }}
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
                <span className="text-xs text-gray-400 font-normal ml-2">
                  {bannerPreview ? 'Current image shown — upload to replace' : 'Optional'}
                </span>
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
              <Button type="submit" loading={updateEvent.isPending}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(EVENT_ROUTES.DETAIL(id!))}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </section>

      {showDeleteModal && (
        <DeleteConfirmModal
          title={event.title}
          isDeleting={deleteEvent.isPending}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

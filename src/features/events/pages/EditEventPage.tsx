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
import { useEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEvents';
import { mapEventToUpdatePayload } from '../api/adapters/event.adapter';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { toast } from '@/shared/components/ui/Toast';
import { EVENT_ROUTES } from '../routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { TimePicker } from '@/shared/components/ui/input/TimePicker';
import { DatePicker } from '@/shared/components/ui/input/DatePicker';
import { ROUTES } from '@/shared/constants/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { UpdateEventFormData, updateEventSchema } from '../schemas/event.schema';

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
  const currentUser = useIdentityStore((state) => state.user);

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
  } = useForm<UpdateEventFormData>({
    resolver: zodResolver(updateEventSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      visibility: 'public',
      status: 'upcoming',
    },
  });

  const visibility = watch('visibility');
  const status = watch('status');
  const startDate = watch('start_date');

  // Populate form when event loads
  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        location: event.location,
        start_date: event.startDate.split('T')[0],
        end_date: event?.endDate?.split('T')[0],
        start_time: event.startTime || '',
        end_time: event.endTime || '',
        visibility: (event as any).visibility || 'public',
        status: (event as any).status || 'upcoming',
      });
      // Pre-fill banner preview with current image if one exists
      if (event.image) setBannerPreview(event.image);
      setIsStatusManuallyChanged(false);
    }
  }, [event, reset]);

  useEffect(() => {
    if (!startDate || isStatusManuallyChanged) return;

    const selectedDate = new Date(startDate);
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
  }, [startDate, isStatusManuallyChanged, setValue]);

  const handleImageChange = (files: File[], previews: string[]) => {
    setBannerError('');

    console.log('files  ==', files);
    if (files.length > 0) {
      console.log('files 1  ==', files);
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setBannerError('Image must be under 2 MB');
        return;
      }
      setBannerFile(file);
      setBannerPreview(previews[0]);
    } else {
      // User cleared the image
      console.log('files 2  ==', files);
      setBannerFile(null);
      setBannerPreview(previews[0] ?? '');
    }
  };

  const onSubmit = (data: UpdateEventFormData) => {
    if (!id) return;

    const payload = mapEventToUpdatePayload(id, {
      title: data.title,
      description: data.description,
      location: data.location,
      start_date: data.start_date,
      end_date: data.end_date,
      start_time: data.start_time,
      end_time: data.end_time,
      visibility: data.visibility,
      status: data.status,
      event_banner: bannerFile,
      // Only include banner if a new file was selected
      // ...(bannerFile ? { event_banner: bannerFile } : {}),
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
      { label: 'Home', href: ROUTES.HOME },
      { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
      { label: 'Events', href: ADMIN_ROUTES.EVENTS },
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
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
    { label: 'Events', href: ADMIN_ROUTES.EVENTS },
    { label: event.title, href: EVENT_ROUTES.DETAIL(event.id) },
    { label: 'Edit' },
  ];

  return (
    <>
      <SEO title={`Edit — ${event.title}`} description="Edit event details" />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom ">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Event Title"
                id="title"
                required
                placeholder="e.g. Annual Alumni Reunion 2026"
                error={errors.title?.message}
                {...register('title')}
              />

              <FormInput
                label="Location"
                id="location"
                required
                placeholder="Venue name, city"
                icon="mdi:map-marker-outline"
                error={errors.location?.message}
                {...register('location')}
              />
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                label="Start Date"
                id="event_date"
                required
                min={new Date().toISOString().split('T')[0]} // same as before
                error={errors.start_date?.message}
                value={watch('start_date')} // controlled
                onValueChange={(val) =>
                  setValue('start_date', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              <DatePicker
                label="End Date"
                id="end_date"
                min={watch('start_date') || undefined} // same as before
                error={errors.end_date?.message}
                value={watch('end_date')} // controlled
                onValueChange={(val) =>
                  setValue('end_date', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimePicker
                label="Start Time"
                id="start_time"
                error={errors.start_time?.message}
                value={watch('start_time')}
                onValueChange={(val) =>
                  setValue('start_time', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />

              <TimePicker
                label="End Time"
                id="end_time"
                error={errors.end_time?.message}
                value={watch('end_time')}
                onValueChange={(val) =>
                  setValue('end_time', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
            </div>

            <TextareaInput
              label="Description"
              id="description"
              required
              rows={4}
              placeholder="Describe the event..."
              error={errors.description?.message}
              {...register('description')}
            />

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
              {/* <FormInput
                label="Max Attendees"
                id="max_attendees"
                type="number"
                placeholder="0 = unlimited"
                hint="0 = no limit"
                error={errors.max_attendees?.message}
                {...register('max_attendees', { valueAsNumber: true })}
              /> */}
            </div>

            {/* ── Banner image ────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner
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

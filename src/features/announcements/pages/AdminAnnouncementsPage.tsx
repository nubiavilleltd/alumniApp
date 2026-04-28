import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ButtonLink } from '@/shared/components/ui/Button';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { Modal } from '@/shared/components/ui/Modal';
import { ROUTES } from '@/shared/constants/routes';
import { DeleteConfirmModal } from '@/features/events/components/DeleteConfirmModal';
import {
  useAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useUpdateAnnouncement,
} from '@/features/announcements/hooks/useAnnouncements';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import type {
  AnnouncementMutationInput,
  AnnouncementType,
  NewsItem,
} from '@/features/announcements/types/announcement.types';

type EditorState = {
  title: string;
  content: string;
  type: AnnouncementType;
  chapterId: string;
  year: string;
  startsAt: string;
  endsAt: string;
};

const announcementTypeOptions = [
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Success', value: 'success' },
  { label: 'Event', value: 'event' },
] as const;

const filterOptions = [{ label: 'All types', value: 'all' }, ...announcementTypeOptions] as const;

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
  { label: 'Announcements' },
];

function formatAnnouncementDate(date?: string) {
  if (!date) return 'Not scheduled';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function buildSummary(item: NewsItem) {
  return item.excerpt?.trim() || item.content?.trim() || 'No summary provided yet.';
}

function toInputDateTime(value?: string) {
  if (!value) return '';
  if (value.includes('T')) return value.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return value.replace(' ', 'T').slice(0, 16);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  const offset = parsed.getTimezoneOffset() * 60_000;
  return new Date(parsed.getTime() - offset).toISOString().slice(0, 16);
}

function toBackendDateTime(value: string) {
  if (!value.trim()) return undefined;
  return `${value.replace('T', ' ')}:00`;
}

function getInitialEditorState(item?: NewsItem): EditorState {
  return {
    title: item?.title ?? '',
    content: item?.content ?? item?.excerpt ?? '',
    type: item?.type ?? 'info',
    chapterId: item?.chapterId ?? '',
    year: item?.year ? String(item.year) : '',
    startsAt: toInputDateTime(item?.startsAt),
    endsAt: toInputDateTime(item?.endsAt),
  };
}

function typeBadgeClass(type: AnnouncementType) {
  switch (type) {
    case 'warning':
      return 'bg-amber-100 text-amber-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'event':
      return 'bg-blue-100 text-blue-800';
    case 'info':
    default:
      return 'bg-accent-100 text-accent-800';
  }
}

function AnnouncementEditorModal({
  announcement,
  isOpen,
  onClose,
}: {
  announcement?: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();

  const [form, setForm] = useState<EditorState>(getInitialEditorState(announcement ?? undefined));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const isEditMode = Boolean(announcement);
  const isSubmitting = createAnnouncement.isPending || updateAnnouncement.isPending;

  useEffect(() => {
    if (!isOpen) return;

    setForm(getInitialEditorState(announcement ?? undefined));
    setImageFile(null);
    setImagePreviews(announcement?.image ? [announcement.image] : []);
    setFormError('');
  }, [announcement, isOpen]);

  const handleFieldChange = <K extends keyof EditorState>(field: K, value: EditorState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (files: File[], previews: string[]) => {
    setImageFile(files[0] ?? null);
    setImagePreviews(previews);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    if (!form.content.trim()) {
      setFormError('Content is required.');
      return;
    }

    if (form.startsAt && form.endsAt && new Date(form.endsAt) < new Date(form.startsAt)) {
      setFormError('The end time must be after the start time.');
      return;
    }

    const payload: AnnouncementMutationInput = {
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type,
      chapterId: form.chapterId.trim() || undefined,
      year: form.year.trim() || undefined,
      startsAt: toBackendDateTime(form.startsAt),
      endsAt: toBackendDateTime(form.endsAt),
      image: imageFile,
    };

    try {
      if (isEditMode && announcement) {
        await updateAnnouncement.mutateAsync({
          id: String(announcement.id),
          input: payload,
        });
      } else {
        await createAnnouncement.mutateAsync(payload);
      }

      onClose();
    } catch (error: any) {
      setFormError(error.message ?? 'Unable to save this announcement.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title={isEditMode ? 'Edit Announcement' : 'Create Announcement'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Title"
          value={form.title}
          onChange={(event) => handleFieldChange('title', event.target.value)}
          placeholder="Welcome to Alumni 2026"
          required
        />

        <TextareaInput
          label="Content"
          value={form.content}
          onChange={(event) => handleFieldChange('content', event.target.value)}
          placeholder="Write the full announcement here..."
          rows={6}
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectInput
            label="Type"
            options={announcementTypeOptions}
            value={form.type}
            onChange={(event) => handleFieldChange('type', event.target.value as AnnouncementType)}
          />

          <FormInput
            label="Year"
            value={form.year}
            onChange={(event) => handleFieldChange('year', event.target.value)}
            placeholder="2026"
            type="number"
            min="1900"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Chapter ID"
            value={form.chapterId}
            onChange={(event) => handleFieldChange('chapterId', event.target.value)}
            placeholder="Leave blank for global"
          />

          <div className="rounded-2xl bg-accent-50 px-4 py-3 text-sm text-accent-600">
            Leave chapter and year blank if the announcement should be visible to everyone.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Starts At"
            value={form.startsAt}
            onChange={(event) => handleFieldChange('startsAt', event.target.value)}
            type="datetime-local"
          />

          <FormInput
            label="Ends At"
            value={form.endsAt}
            onChange={(event) => handleFieldChange('endsAt', event.target.value)}
            type="datetime-local"
          />
        </div>

        <ImageUpload
          label="Cover Image"
          previews={imagePreviews}
          onChange={handleImageChange}
          multiple={false}
          hint="PNG, JPG, WEBP or GIF up to 2MB"
        />

        {formError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-accent-700 hover:text-accent-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {isSubmitting && <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />}
            {isEditMode ? 'Save changes' : 'Publish announcement'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function AdminAnnouncementsPage() {
  const { data: announcements = [], isLoading } = useAnnouncements();
  const deleteAnnouncement = useDeleteAnnouncement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | AnnouncementType>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<NewsItem | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<NewsItem | null>(null);

  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort(
        (a, b) =>
          new Date(b.startsAt || b.date).getTime() - new Date(a.startsAt || a.date).getTime(),
      ),
    [announcements],
  );

  const filteredAnnouncements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedAnnouncements.filter((item) => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      if (!matchesType) return false;

      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        (item.content ?? '').toLowerCase().includes(query) ||
        (item.excerpt ?? '').toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedType, sortedAnnouncements]);

  const eventCount = sortedAnnouncements.filter((item) => item.type === 'event').length;
  const scheduledCount = sortedAnnouncements.filter((item) => item.startsAt || item.endsAt).length;

  const handleDelete = async () => {
    if (!announcementToDelete) return;
    await deleteAnnouncement.mutateAsync(String(announcementToDelete.id));
    setAnnouncementToDelete(null);
  };

  return (
    <>
      <SEO title="Manage Announcements" description="Create and manage community announcements." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-8">
        <div className="container-custom max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-accent-950">Manage Announcements</h1>
              <p className="mt-2 text-sm text-accent-500">
                Publish updates for members, chapters, year sets, and time-sensitive notices.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href={ANNOUNCEMENT_ROUTES.ROOT} variant="outline">
                View public page
              </ButtonLink>
              <button
                type="button"
                onClick={() => {
                  setEditingAnnouncement(null);
                  setEditorOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600"
              >
                <Icon icon="mdi:plus" className="h-4 w-4" />
                Create announcement
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-accent-100">
              <p className="text-sm font-medium text-accent-500">Total announcements</p>
              <p className="mt-3 text-3xl font-bold text-accent-950">
                {sortedAnnouncements.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-accent-100">
              <p className="text-sm font-medium text-accent-500">Event updates</p>
              <p className="mt-3 text-3xl font-bold text-accent-950">{eventCount}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-accent-100">
              <p className="text-sm font-medium text-accent-500">Scheduled announcements</p>
              <p className="mt-3 text-3xl font-bold text-accent-950">{scheduledCount}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-accent-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-300"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title or content..."
                  className="w-full rounded-xl border border-accent-100 py-3 pl-10 pr-4 text-sm text-accent-800 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedType(filter.value as 'all' | AnnouncementType)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedType === filter.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-accent-50 text-accent-700 hover:bg-primary-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-accent-100"
                />
              ))}
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-accent-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
                <Icon icon="mdi:bullhorn-off-outline" className="h-7 w-7 text-accent-700" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-accent-950">No matching announcements</h2>
              <p className="mt-2 text-sm text-accent-500">
                Try a different filter, or create a new announcement to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAnnouncements.map((item) => (
                <article
                  key={item.slug}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-accent-100"
                >
                  <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
                    <div className="h-52 bg-accent-100 lg:h-full">
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    </div>

                    <div className="flex flex-col justify-between gap-5 p-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${typeBadgeClass(item.type)}`}
                          >
                            {item.type}
                          </span>
                          <span className="text-sm text-accent-500">
                            {formatAnnouncementDate(item.startsAt || item.date)}
                          </span>
                          {item.chapterId && (
                            <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
                              Chapter {item.chapterId}
                            </span>
                          )}
                          {item.year && (
                            <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
                              Year {item.year}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-accent-950">{item.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-accent-600">
                          {buildSummary(item)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <ButtonLink
                          href={ANNOUNCEMENT_ROUTES.DETAIL(item.slug)}
                          variant="outline"
                          size="sm"
                        >
                          View public page
                        </ButtonLink>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAnnouncement(item);
                              setEditorOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
                          >
                            <Icon icon="mdi:pencil-outline" className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setAnnouncementToDelete(item)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnnouncementEditorModal
        announcement={editingAnnouncement}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingAnnouncement(null);
        }}
      />

      {announcementToDelete && (
        <DeleteConfirmModal
          title={announcementToDelete.title}
          heading="Delete Announcement?"
          isDeleting={deleteAnnouncement.isPending}
          onConfirm={() => void handleDelete()}
          onCancel={() => setAnnouncementToDelete(null)}
          description={`Delete "${announcementToDelete.title}"? This announcement will disappear from the homepage and announcements page.`}
        />
      )}
    </>
  );
}

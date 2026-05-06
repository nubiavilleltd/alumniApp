import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Button } from '@/shared/components/ui/Button';
import EmptyState from '@/shared/components/ui/EmptyState';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { BaseInput } from '@/shared/components/ui/input/BaseInput';
import { DatePicker } from '@/shared/components/ui/input/DatePicker';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { toast } from '@/shared/components/ui/Toast';
import { ROUTES } from '@/shared/constants/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { useCreateVacancy } from '../hooks/useCreateVacancy';
import { useJobVacancies } from '../hooks/useJobVacancies';
import { useUpdateVacancy } from '../hooks/useManageVacancy';
import type { JobVacancyViewModel } from '../api/adapters';
import {
  formatJobDate,
  formatMoneyAmount,
  getJobPillLabels,
  getSalaryDisplay,
} from '../utils/jobVacancyDisplay';
import {
  APPLICATION_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  JOB_TYPE_OPTIONS,
  LEVEL_OF_EXPERTISE_OPTIONS,
  WORKPLACE_TYPE_OPTIONS,
  type ApplicationType,
  type CreateVacancyPayload,
  type JobType,
  type LevelOfExpertise,
  type VacancyCurrency,
  type WorkplaceType,
} from '../types/jobVacancies.types';

export type JobCardTone = 'mint' | 'rose' | 'slate' | 'lavender' | 'sky' | 'green';

type JobFormState = {
  title: string;
  companyName: string;
  jobType: JobType | '';
  workplaceType: WorkplaceType | '';
  level: LevelOfExpertise | '';
  location: string;
  salary: string;
  currency: VacancyCurrency;
  deadline: string;
  tags: string[];
  tagDraft: string;
  aboutRole: string;
  responsibilities: string;
  requirements: string;
  applicationMode: ApplicationType;
  applicationDestination: string;
};

type JobFormErrors = Partial<Record<keyof JobFormState, string>>;

const jobCardTones: JobCardTone[] = ['mint', 'rose', 'slate', 'lavender', 'sky', 'green'];
const MAX_KEYWORDS = 10;
const MAX_KEYWORD_LENGTH = 30;

const initialJobFormState: JobFormState = {
  title: '',
  companyName: '',
  jobType: '',
  workplaceType: '',
  level: '',
  location: '',
  salary: '',
  currency: 'NGN',
  deadline: '',
  tags: [],
  tagDraft: '',
  aboutRole: '',
  responsibilities: '',
  requirements: '',
  applicationMode: 'email',
  applicationDestination: '',
};

function getInitialJobFormState(): JobFormState {
  return {
    ...initialJobFormState,
    tags: [],
  };
}

function isVacancyCurrency(value: string): value is VacancyCurrency {
  return CURRENCY_OPTIONS.some((option) => option.value === value);
}

function getDateInputValue(value: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
}

function getSalaryFormValue(value: string) {
  const numericValue = value.replace(/[^\d.]/g, '');

  return numericValue || value;
}

function jobToFormState(job?: JobVacancyViewModel | null): JobFormState {
  if (!job) return getInitialJobFormState();

  return {
    title: job.title,
    companyName: job.companyName,
    jobType: job.jobType,
    workplaceType: job.workplaceType,
    level: job.levelOfExpertise,
    location: job.location,
    salary: getSalaryFormValue(job.salary),
    currency: isVacancyCurrency(job.currency) ? job.currency : 'NGN',
    deadline: getDateInputValue(job.postedAt),
    tags: [...job.tags],
    tagDraft: '',
    aboutRole: job.aboutRole,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    applicationMode: job.applicationMode,
    applicationDestination:
      job.applicationMode === 'email' ? (job.applicationEmail ?? '') : (job.applicationUrl ?? ''),
  };
}

function getTodayDateInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseSalaryAmount(value: string) {
  const normalized = value.replace(/,/g, '').trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  return amount;
}

function normalizeKeyword(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function splitKeywords(value: string) {
  return value.split(/[,\n]/).map(normalizeKeyword).filter(Boolean);
}

function validateJobForm(form: JobFormState): JobFormErrors {
  const errors: JobFormErrors = {};
  const today = getTodayDateInputValue();

  if (!form.title.trim()) errors.title = 'Job title is required.';
  if (!form.companyName.trim()) errors.companyName = 'Company name is required.';
  if (!form.jobType) errors.jobType = 'Select a job type.';
  if (!form.workplaceType) errors.workplaceType = 'Select a workplace type.';
  if (!form.level) errors.level = 'Select a level of expertise.';
  if (!form.location.trim()) errors.location = 'Location is required.';
  if (!form.salary.trim()) errors.salary = 'Salary is required.';
  if (form.salary.trim() && parseSalaryAmount(form.salary) === null) {
    errors.salary = 'Enter a valid salary amount.';
  }
  if (!form.deadline.trim()) errors.deadline = 'Application deadline is required.';
  if (form.deadline.trim() && form.deadline < today) {
    errors.deadline = 'Application deadline cannot be in the past.';
  }
  if (!form.aboutRole.trim()) errors.aboutRole = 'Tell applicants about the role.';
  if (!form.responsibilities.trim()) errors.responsibilities = 'Responsibilities are required.';
  if (!form.requirements.trim()) errors.requirements = 'Requirements are required.';

  if (!form.applicationDestination.trim()) {
    errors.applicationDestination =
      form.applicationMode === 'email'
        ? 'Application email is required.'
        : 'Application link is required.';
  } else if (
    form.applicationMode === 'email' &&
    !isValidEmail(form.applicationDestination.trim())
  ) {
    errors.applicationDestination = 'Enter a valid application email.';
  } else if (form.applicationMode === 'link' && !isValidUrl(form.applicationDestination.trim())) {
    errors.applicationDestination = 'Enter a valid application link.';
  }

  return errors;
}

export function getTone(index: number): JobCardTone {
  return jobCardTones[index % jobCardTones.length];
}

function KeywordInput({
  tags,
  draft,
  error,
  disabled,
  onDraftChange,
  onAddKeyword,
  onRemoveKeyword,
  onRemoveLastKeyword,
}: {
  tags: string[];
  draft: string;
  error?: string;
  disabled?: boolean;
  onDraftChange: (value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
  onRemoveLastKeyword: () => void;
}) {
  return (
    <div className="jobs-post-form__full flex flex-col gap-1">
      <label htmlFor="job-keywords" className="block text-sm font-medium text-gray-700">
        Job Tags / Keywords
      </label>

      <div
        className={`rounded-3xl border bg-white px-3 py-2.5 shadow-sm transition-colors ${
          error ? 'border-red-400' : 'border-gray-200 focus-within:border-primary-400'
        } ${disabled ? 'cursor-not-allowed bg-gray-50 opacity-60' : ''}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span key={tag} className="badge badge-primary gap-2">
              {tag}
              <button
                type="button"
                onClick={() => onRemoveKeyword(tag)}
                disabled={disabled}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-primary-700 transition-colors hover:bg-primary-200 disabled:cursor-not-allowed"
                aria-label={`Remove ${tag}`}
              >
                <Icon icon="mdi:close" className="h-3 w-3" />
              </button>
            </span>
          ))}

          <input
            id="job-keywords"
            type="text"
            value={draft}
            disabled={disabled}
            placeholder={
              tags.length === 0 ? 'Type a keyword and press Enter' : 'Add another keyword'
            }
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                onAddKeyword();
              }

              if (event.key === 'Backspace' && !draft.trim() && tags.length > 0) {
                event.preventDefault();
                onRemoveLastKeyword();
              }
            }}
            onBlur={() => {
              if (draft.trim()) onAddKeyword();
            }}
            className="min-w-[180px] flex-1 border-0 bg-transparent py-1 text-sm text-gray-700 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
          />

          <button
            type="button"
            disabled={disabled || !draft.trim()}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onAddKeyword}
            className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon="mdi:plus" className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-gray-400">
          Press Enter or comma to add a keyword. {tags.length}/{MAX_KEYWORDS} added.
        </p>
      )}
    </div>
  );
}

export function JobCard({
  job,
  tone,
  onDetails,
  actions,
}: {
  job: JobVacancyViewModel;
  tone: JobCardTone;
  onDetails: (job: JobVacancyViewModel) => void;
  actions?: ReactNode;
}) {
  const pillLabels = getJobPillLabels(job);

  return (
    <article className="job-card">
      <div className={`job-card__panel job-card__panel--${tone}`}>
        <time dateTime={job.postedAt} className="job-card__date">
          {formatJobDate(job.postedAt)}
        </time>

        <p className="job-card__company">{job.companyName}</p>
        <h2 className="job-card__title">{job.title}</h2>

        <div className="job-card__tags">
          {pillLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      <div className="job-card__footer">
        <div>
          <p className="job-card__salary">{getSalaryDisplay(job)}</p>
          <p className="job-card__location">{job.location}</p>
        </div>

        <div className="job-card__actions">
          <button type="button" className="job-card__details" onClick={() => onDetails(job)}>
            Details
          </button>
          {actions}
        </div>
      </div>
    </article>
  );
}

export function PostJobModal({
  chapterId,
  editData,
  onClose,
  onSubmitted,
}: {
  chapterId?: string;
  editData?: JobVacancyViewModel | null;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const isEditing = Boolean(editData);
  const createVacancy = useCreateVacancy();
  const updateVacancy = useUpdateVacancy();
  const [form, setForm] = useState<JobFormState>(() => jobToFormState(editData));
  const [fieldErrors, setFieldErrors] = useState<JobFormErrors>({});
  const [formError, setFormError] = useState('');
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreviews, setFlyerPreviews] = useState<string[]>(
    editData?.flyer ? [editData.flyer] : [],
  );
  const minDeadline = getTodayDateInputValue();
  const isSubmitting = createVacancy.isPending || updateVacancy.isPending;

  useEffect(() => {
    setForm(jobToFormState(editData));
    setFieldErrors({});
    setFormError('');
    setFlyerFile(null);
    setFlyerPreviews(editData?.flyer ? [editData.flyer] : []);
  }, [editData]);

  const handleFieldChange = <K extends keyof JobFormState>(field: K, value: JobFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError('');
  };

  const handleImageChange = (files: File[], previews: string[]) => {
    setFlyerFile(files[0] ?? null);
    setFlyerPreviews(previews);
    setFormError('');
  };

  const handleAddKeywords = () => {
    const candidates = splitKeywords(form.tagDraft);

    if (candidates.length === 0) {
      setForm((prev) => ({ ...prev, tagDraft: '' }));
      return;
    }

    const nextKeywords = [...form.tags];
    let nextError = '';

    for (const candidate of candidates) {
      if (candidate.length > MAX_KEYWORD_LENGTH) {
        nextError = `Each keyword must be ${MAX_KEYWORD_LENGTH} characters or fewer.`;
        continue;
      }

      const exists = nextKeywords.some((tag) => tag.toLowerCase() === candidate.toLowerCase());
      if (exists) {
        if (!nextError) nextError = `"${candidate}" has already been added.`;
        continue;
      }

      if (nextKeywords.length >= MAX_KEYWORDS) {
        nextError = `You can add up to ${MAX_KEYWORDS} keywords.`;
        break;
      }

      nextKeywords.push(candidate);
    }

    setForm((prev) => ({
      ...prev,
      tags: nextKeywords,
      tagDraft: '',
    }));

    setFieldErrors((prev) => ({
      ...prev,
      tags: nextError || undefined,
    }));
  };

  const handleRemoveKeyword = (keyword: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== keyword),
    }));
    setFieldErrors((prev) => ({ ...prev, tags: undefined }));
  };

  const handleRemoveLastKeyword = () => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.slice(0, -1),
    }));
    setFieldErrors((prev) => ({ ...prev, tags: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateJobForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!chapterId) {
      setFormError('We could not determine your chapter yet. Please refresh and try again.');
      return;
    }

    const payload: CreateVacancyPayload = {
      job_title: form.title.trim(),
      company_name: form.companyName.trim(),
      job_type: form.jobType as JobType,
      workplace_type: form.workplaceType as WorkplaceType,
      level_of_expertise: form.level as LevelOfExpertise,
      location: form.location.trim(),
      salary: formatMoneyAmount(form.salary, form.currency, form.salary.trim()),
      currency: form.currency,
      application_deadline: form.deadline,
      keywords: form.tags.length > 0 ? form.tags.join(', ') : undefined,
      about_role: form.aboutRole.trim(),
      responsibilities: form.responsibilities.trim(),
      requirements: form.requirements.trim(),
      application_type: form.applicationMode,
      application_email:
        form.applicationMode === 'email' ? form.applicationDestination.trim() : undefined,
      application_link:
        form.applicationMode === 'link' ? form.applicationDestination.trim() : undefined,
      chapter_id: chapterId,
      ...(flyerFile ? { flyer: flyerFile } : {}),
    };

    try {
      if (isEditing && editData) {
        await updateVacancy.mutateAsync({ id: editData.id, ...payload });
        toast.success('Job vacancy updated successfully.');
      } else {
        await createVacancy.mutateAsync(payload);
        toast.success('Job vacancy posted successfully.');
      }
      onSubmitted();
    } catch (error: any) {
      const message =
        error?.message ??
        (isEditing
          ? 'Unable to update this job vacancy right now.'
          : 'Unable to post this job vacancy right now.');
      setFormError(message);
      toast.fromError(error);
    }
  };

  return (
    <div className="jobs-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="jobs-post-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-job-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="jobs-modal-close" onClick={onClose} aria-label="Close">
          <Icon icon="mdi:close" />
        </button>

        <form className="jobs-post-form" onSubmit={handleSubmit}>
          <h2 id="post-job-title" className="sr-only">
            {isEditing ? 'Edit Job' : 'Post a Job'}
          </h2>

          <div className="jobs-post-form__grid">
            <BaseInput
              label="Job Title"
              name="title"
              value={form.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              placeholder="Enter the job title"
              error={fieldErrors.title}
              required
              disabled={isSubmitting}
            />
            <BaseInput
              label="Company Name"
              name="companyName"
              value={form.companyName}
              onChange={(event) => handleFieldChange('companyName', event.target.value)}
              placeholder="Enter the company name"
              error={fieldErrors.companyName}
              required
              disabled={isSubmitting}
            />
            <SelectInput
              label="Job Type"
              name="jobType"
              value={form.jobType}
              onChange={(event) => handleFieldChange('jobType', event.target.value as JobType | '')}
              placeholder="Select a job type"
              options={JOB_TYPE_OPTIONS}
              error={fieldErrors.jobType}
              required
              disabled={isSubmitting}
            />
            <SelectInput
              label="Workplace Type"
              name="workplaceType"
              value={form.workplaceType}
              onChange={(event) =>
                handleFieldChange('workplaceType', event.target.value as WorkplaceType | '')
              }
              placeholder="Select a workplace type"
              options={WORKPLACE_TYPE_OPTIONS}
              error={fieldErrors.workplaceType}
              required
              disabled={isSubmitting}
            />
            <SelectInput
              label="Level of Expertise"
              name="level"
              value={form.level}
              onChange={(event) =>
                handleFieldChange('level', event.target.value as LevelOfExpertise | '')
              }
              placeholder="Select a level of expertise"
              options={LEVEL_OF_EXPERTISE_OPTIONS}
              error={fieldErrors.level}
              required
              disabled={isSubmitting}
            />
            <BaseInput
              label="Location (City)"
              name="location"
              value={form.location}
              onChange={(event) => handleFieldChange('location', event.target.value)}
              placeholder="Enter the location of the job"
              error={fieldErrors.location}
              required
              disabled={isSubmitting}
            />
            <BaseInput
              label="Salary"
              name="salary"
              value={form.salary}
              onChange={(event) => handleFieldChange('salary', event.target.value)}
              placeholder="Enter the job salary amount"
              hint={
                parseSalaryAmount(form.salary) !== null
                  ? `Display preview: ${formatMoneyAmount(form.salary, form.currency, form.salary)}`
                  : undefined
              }
              error={fieldErrors.salary}
              required
              disabled={isSubmitting}
            />
            <SelectInput
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={(event) =>
                handleFieldChange('currency', event.target.value as VacancyCurrency)
              }
              options={CURRENCY_OPTIONS}
              disabled={isSubmitting}
            />
            <DatePicker
              label="Application Deadline"
              name="deadline"
              value={form.deadline}
              onValueChange={(value) => handleFieldChange('deadline', value)}
              min={minDeadline}
              placeholder="Select the application deadline"
              error={fieldErrors.deadline}
              required
              disabled={isSubmitting}
            />
          </div>

          <KeywordInput
            tags={form.tags}
            draft={form.tagDraft}
            error={fieldErrors.tags}
            disabled={isSubmitting}
            onDraftChange={(value) => {
              handleFieldChange('tagDraft', value);
              if (fieldErrors.tags) {
                setFieldErrors((prev) => ({ ...prev, tags: undefined }));
              }
            }}
            onAddKeyword={handleAddKeywords}
            onRemoveKeyword={handleRemoveKeyword}
            onRemoveLastKeyword={handleRemoveLastKeyword}
          />

          <TextareaInput
            className="jobs-post-form__full"
            label="About this Role"
            name="aboutRole"
            value={form.aboutRole}
            onChange={(event) => handleFieldChange('aboutRole', event.target.value)}
            placeholder="Write a short description about the job"
            rows={5}
            error={fieldErrors.aboutRole}
            required
            disabled={isSubmitting}
          />

          <TextareaInput
            className="jobs-post-form__full"
            label="Responsibilities"
            name="responsibilities"
            value={form.responsibilities}
            onChange={(event) => handleFieldChange('responsibilities', event.target.value)}
            placeholder="Enter the responsibilities involved in this job"
            rows={5}
            error={fieldErrors.responsibilities}
            required
            disabled={isSubmitting}
          />

          <TextareaInput
            className="jobs-post-form__full"
            label="Requirements"
            name="requirements"
            value={form.requirements}
            onChange={(event) => handleFieldChange('requirements', event.target.value)}
            placeholder="Enter the job requirements"
            rows={5}
            error={fieldErrors.requirements}
            required
            disabled={isSubmitting}
          />

          <div className="jobs-post-form__application">
            <fieldset>
              <legend>Applications for this job will be done by:</legend>
              {APPLICATION_TYPE_OPTIONS.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name="applicationMode"
                    value={option.value}
                    checked={form.applicationMode === option.value}
                    onChange={() => handleFieldChange('applicationMode', option.value)}
                    disabled={isSubmitting}
                  />
                  <span>{option.label === 'Link' ? 'Job Application Link' : option.label}</span>
                </label>
              ))}
            </fieldset>

            <BaseInput
              label={form.applicationMode === 'email' ? 'Application Email' : 'Application Link'}
              name={form.applicationMode === 'email' ? 'applicationEmail' : 'applicationUrl'}
              type={form.applicationMode === 'email' ? 'email' : 'url'}
              value={form.applicationDestination}
              onChange={(event) => handleFieldChange('applicationDestination', event.target.value)}
              placeholder={
                form.applicationMode === 'email'
                  ? 'Enter the email to send applications to'
                  : 'Enter the link to send applicants to'
              }
              error={fieldErrors.applicationDestination}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="jobs-post-form__full">
            <ImageUpload
              label="Job Flyer (Optional)"
              previews={flyerPreviews}
              onChange={handleImageChange}
              multiple={false}
              hint="PNG, JPG, WEBP or GIF up to 2MB"
            />
          </div>

          {formError ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
          ) : null}

          <Button type="submit" size="lg" className="jobs-post-form__submit" loading={isSubmitting}>
            {isEditing ? 'Update Job' : 'Submit'}
          </Button>
        </form>
      </section>
    </div>
  );
}

export function JobsLoadingState() {
  return (
    <div className="jobs-grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="job-card animate-pulse">
          <div className="job-card__panel bg-gray-100">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-6 h-4 w-28 rounded bg-gray-200" />
            <div className="mt-4 h-7 w-3/4 rounded bg-gray-200" />
            <div className="mt-6 flex gap-2">
              <div className="h-8 w-20 rounded-full bg-gray-200" />
              <div className="h-8 w-24 rounded-full bg-gray-200" />
            </div>
          </div>
          <div className="job-card__footer">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
            </div>
            <div className="h-10 w-20 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JobVacanciesPage() {
  const navigate = useNavigate();
  const user = useIdentityStore((state) => state.user);
  const accessToken = useTokenStore((state) => state.accessToken);
  const { data: vacancies = [], isLoading, isError, error, refetch } = useJobVacancies();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const canPostJob = Boolean(user?.chapterId && accessToken);

  const orderedVacancies = useMemo(
    () =>
      [...vacancies].sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      ),
    [vacancies],
  );

  const handleOpenPostModal = () => {
    if (!canPostJob) {
      toast.info('Please sign in with your alumni account before posting a job vacancy.');
      return;
    }

    setIsPostModalOpen(true);
  };

  const handleOpenJobDetails = (job: JobVacancyViewModel) => {
    navigate(ROUTES.JOB_VACANCY_DETAIL(job.id));
  };

  return (
    <>
      <SEO
        title="Job Vacancies"
        description="Discover exclusive job listings shared with the FGGC Owerri Alumnae Association."
      />

      <main className="jobs-page">
        <section className="jobs-page__shell" aria-labelledby="jobs-page-title">
          <header className="jobs-page__header">
            <div>
              <h1 id="jobs-page-title">Job Vacancies</h1>
              <p>Discover exclusive job listings</p>
            </div>

            <Button
              type="button"
              size="lg"
              className="jobs-page__post-button"
              onClick={handleOpenPostModal}
            >
              Post a Job
              <Icon icon="mdi:plus" />
            </Button>
          </header>

          {isLoading ? <JobsLoadingState /> : null}

          {!isLoading && isError ? (
            <EmptyState
              icon="mdi:briefcase-search-outline"
              title="We couldn't load job vacancies"
              description={error instanceof Error ? error.message : 'Please try again.'}
              actionLabel="Try Again"
              onAction={() => {
                void refetch();
              }}
            />
          ) : null}

          {!isLoading && !isError && orderedVacancies.length === 0 ? (
            <EmptyState
              icon="mdi:briefcase-outline"
              title="No job vacancies yet"
              description="Once a job is posted, it will show up here for the community to explore."
              actionLabel={canPostJob ? 'Post the First Job' : undefined}
              onAction={canPostJob ? () => setIsPostModalOpen(true) : undefined}
            />
          ) : null}

          {!isLoading && !isError && orderedVacancies.length > 0 ? (
            <div className="jobs-grid">
              {orderedVacancies.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  tone={getTone(index)}
                  onDetails={handleOpenJobDetails}
                />
              ))}
            </div>
          ) : null}
        </section>
      </main>

      {isPostModalOpen ? (
        <PostJobModal
          chapterId={user?.chapterId}
          onClose={() => setIsPostModalOpen(false)}
          onSubmitted={() => {
            setIsPostModalOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

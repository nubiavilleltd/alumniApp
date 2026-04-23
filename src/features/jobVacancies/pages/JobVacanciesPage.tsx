import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Button } from '@/shared/components/ui/Button';
import { BaseInput } from '@/shared/components/ui/input/BaseInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

type ApplicationMode = 'email' | 'link';

type JobVacancy = {
  id: string;
  title: string;
  companyName: string;
  postedAt: string;
  salary: string;
  location: string;
  tags: string[];
  requirements: string;
  responsibilities: string;
  aboutRole: string;
  applicationMode: ApplicationMode;
  applicationEmail?: string;
  applicationUrl?: string;
  tone: 'mint' | 'rose' | 'slate' | 'lavender' | 'sky' | 'green';
};

const jobTypeOptions = [
  { label: 'Full time', value: 'full-time' },
  { label: 'Part time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
] as const;

const workplaceOptions = [
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'onsite' },
] as const;

const levelOptions = [
  { label: 'Entry Level', value: 'entry' },
  { label: 'Mid Level', value: 'mid' },
  { label: 'Senior Level', value: 'senior' },
  { label: 'Lead / Manager', value: 'lead' },
] as const;

const vacancies: JobVacancy[] = [
  {
    id: 'job-001',
    title: 'Senior Fashion Designer',
    companyName: 'Tara House',
    postedAt: '2026-03-20',
    salary: '₦650K/month',
    location: 'Ikeja, Lagos',
    tags: ['Part time', 'Senior Level', 'Remote', 'Flexible hours'],
    requirements:
      'Five or more years in garment construction, collection planning, and production supervision.',
    responsibilities:
      'Lead seasonal design concepts, supervise pattern work, review samples, and coordinate production timelines.',
    aboutRole:
      'A creative leadership role for an alumna with strong technical fashion experience and a refined eye for detail.',
    applicationMode: 'email',
    applicationEmail: 'careers@tarahouse.com',
    tone: 'mint',
  },
  {
    id: 'job-002',
    title: 'Senior Fashion Designer',
    companyName: 'Tara House',
    postedAt: '2026-03-20',
    salary: '₦650K/month',
    location: 'Ikeja, Lagos',
    tags: ['Part time', 'Senior Level', 'Remote', 'Flexible hours'],
    requirements:
      'Portfolio of womenswear projects, strong fabric knowledge, and ability to manage junior designers.',
    responsibilities:
      'Prepare moodboards, develop garment specs, liaise with vendors, and support fittings through final approval.',
    aboutRole: 'Ideal for a designer who can balance originality with commercial production needs.',
    applicationMode: 'link',
    applicationUrl: 'https://example.com/jobs/senior-fashion-designer',
    tone: 'rose',
  },
  {
    id: 'job-003',
    title: 'Senior Fashion Designer',
    companyName: 'Tara House',
    postedAt: '2026-03-20',
    salary: '₦650K/month',
    location: 'Ikeja, Lagos',
    tags: ['Part time', 'Senior Level', 'Remote', 'Flexible hours'],
    requirements:
      'Advanced sketching, merchandising awareness, and experience with production calendars.',
    responsibilities:
      'Collaborate with marketing and operations to deliver collections from concept to market.',
    aboutRole:
      'A flexible role for a self-directed designer comfortable working with distributed teams.',
    applicationMode: 'email',
    applicationEmail: 'jobs@tarahouse.com',
    tone: 'slate',
  },
  {
    id: 'job-004',
    title: 'Senior Fashion Designer',
    companyName: 'Tara House',
    postedAt: '2026-03-20',
    salary: '₦650K/month',
    location: 'Ikeja, Lagos',
    tags: ['Part time', 'Senior Level', 'Remote', 'Flexible hours'],
    requirements:
      'Strong fashion illustration, tailoring knowledge, and excellent communication skills.',
    responsibilities:
      'Own design presentation, vendor communication, and final quality checks for each collection.',
    aboutRole:
      'A senior creative position with room to shape the visual direction of a growing fashion house.',
    applicationMode: 'email',
    applicationEmail: 'people@tarahouse.com',
    tone: 'lavender',
  },
  {
    id: 'job-005',
    title: 'Senior Fashion Designer',
    companyName: 'Tara House',
    postedAt: '2026-03-20',
    salary: '₦650K/month',
    location: 'Ikeja, Lagos',
    tags: ['Part time', 'Senior Level', 'Remote', 'Flexible hours'],
    requirements: 'Experience working with production teams, fabric suppliers, and fit models.',
    responsibilities:
      'Turn trend research into commercial pieces and keep each production milestone on track.',
    aboutRole: 'A hands-on role for a designer who enjoys both creative direction and execution.',
    applicationMode: 'link',
    applicationUrl: 'https://example.com/apply/tara-house',
    tone: 'sky',
  },
  {
    id: 'job-006',
    title: 'Senior Fashion Designer',
    companyName: 'Tara House',
    postedAt: '2026-03-20',
    salary: '₦650K/month',
    location: 'Ikeja, Lagos',
    tags: ['Part time', 'Senior Level', 'Remote', 'Flexible hours'],
    requirements:
      'Demonstrated collection ownership, excellent presentation skills, and high attention to finish.',
    responsibilities:
      'Lead concept development, coordinate fittings, and work with the brand team on campaign readiness.',
    aboutRole:
      'A senior role for a design leader who can mentor others and ship polished collections.',
    applicationMode: 'email',
    applicationEmail: 'recruitment@tarahouse.com',
    tone: 'green',
  },
];

function formatJobDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function JobCard({ job, onDetails }: { job: JobVacancy; onDetails: (job: JobVacancy) => void }) {
  return (
    <article className="job-card">
      <div className={`job-card__panel job-card__panel--${job.tone}`}>
        <time dateTime={job.postedAt} className="job-card__date">
          {formatJobDate(job.postedAt)}
        </time>

        <p className="job-card__company">{job.companyName}</p>
        <h2 className="job-card__title">{job.title}</h2>

        <div className="job-card__tags">
          {job.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="job-card__footer">
        <div>
          <p className="job-card__salary">{job.salary}</p>
          <p className="job-card__location">{job.location}</p>
        </div>

        <button type="button" className="job-card__details" onClick={() => onDetails(job)}>
          Details
        </button>
      </div>
    </article>
  );
}

function JobDetailsModal({ job, onClose }: { job: JobVacancy; onClose: () => void }) {
  return (
    <div className="jobs-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="jobs-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="jobs-modal-close" onClick={onClose} aria-label="Close">
          <Icon icon="mdi:close" />
        </button>

        <div className="jobs-detail-modal__header">
          <time dateTime={job.postedAt}>{formatJobDate(job.postedAt)}</time>
          <p>{job.companyName}</p>
          <h2 id="job-details-title">{job.title}</h2>
          <div className="jobs-detail-modal__tags">
            {job.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="jobs-detail-modal__body">
          <section>
            <h3>About this Role</h3>
            <p>{job.aboutRole}</p>
          </section>
          <section>
            <h3>Requirements</h3>
            <p>{job.requirements}</p>
          </section>
          <section>
            <h3>Responsibilities</h3>
            <p>{job.responsibilities}</p>
          </section>
          <section>
            <h3>Applications</h3>
            <p>
              {job.applicationMode === 'email'
                ? `Applications should be sent to ${job.applicationEmail}.`
                : `Applications should be submitted through ${job.applicationUrl}.`}
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}

function PostJobModal({ onClose }: { onClose: () => void }) {
  const [applicationMode, setApplicationMode] = useState<ApplicationMode>('email');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
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
            Post a Job
          </h2>

          <div className="jobs-post-form__grid">
            <BaseInput label="Job Title" name="title" placeholder="Enter the job title" />
            <BaseInput
              label="Company Name"
              name="companyName"
              placeholder="Enter the company name"
              trailingSlot={<Icon icon="mdi:chevron-down" />}
            />
            <SelectInput
              label="Job Type"
              name="jobType"
              placeholder="Select a job type"
              options={jobTypeOptions}
            />
            <SelectInput
              label="Workplace Type"
              name="workplaceType"
              placeholder="Select a workplace type"
              options={workplaceOptions}
            />
            <SelectInput
              label="Level of Expertise"
              name="level"
              placeholder="Select a level of expertise"
              options={levelOptions}
            />
            <BaseInput
              label="Location (City)"
              name="location"
              placeholder="Enter the location of the job"
            />
            <BaseInput
              label="Salary (per month)"
              name="salary"
              placeholder="Enter the job salary"
            />
            <BaseInput
              label="Application Deadline"
              name="deadline"
              placeholder="Select the application deadline"
              trailingSlot={<Icon icon="mdi:calendar-blank-outline" />}
            />
          </div>

          <BaseInput
            className="jobs-post-form__full"
            label="Job Tags / Keywords"
            name="tags"
            placeholder='(e.g., "Flexible hours", "Frontend", "Marketing"). To add, type and press enter'
          />

          <TextareaInput
            className="jobs-post-form__full"
            label="About this Role"
            name="aboutRole"
            placeholder="Write a short description about the job"
            rows={5}
          />

          <TextareaInput
            className="jobs-post-form__full"
            label="Responsibilities"
            name="responsibilities"
            placeholder="Enter the responsibilities involved in this job"
            rows={5}
          />

          <TextareaInput
            className="jobs-post-form__full"
            label="Requirements"
            name="requirements"
            placeholder="Enter the job requirements"
            rows={5}
          />

          <div className="jobs-post-form__application">
            <fieldset>
              <legend>Applications for this job will be done by:</legend>
              <label>
                <input
                  type="radio"
                  name="applicationMode"
                  value="email"
                  checked={applicationMode === 'email'}
                  onChange={() => setApplicationMode('email')}
                />
                <span>Email</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="applicationMode"
                  value="link"
                  checked={applicationMode === 'link'}
                  onChange={() => setApplicationMode('link')}
                />
                <span>Job Application Link</span>
              </label>
            </fieldset>

            <BaseInput
              label={applicationMode === 'email' ? 'Application Email' : 'Application Link'}
              name={applicationMode === 'email' ? 'applicationEmail' : 'applicationUrl'}
              type={applicationMode === 'email' ? 'email' : 'url'}
              placeholder={
                applicationMode === 'email'
                  ? 'Enter the email to send applications to'
                  : 'Enter the link to send applicants to'
              }
            />
          </div>

          <Button type="submit" size="lg" className="jobs-post-form__submit">
            Submit
          </Button>
        </form>
      </section>
    </div>
  );
}

export default function JobVacanciesPage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  const orderedVacancies = useMemo(
    () =>
      [...vacancies].sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      ),
    [],
  );

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
              onClick={() => setIsPostModalOpen(true)}
            >
              Post a Job
              <Icon icon="mdi:plus" />
            </Button>
          </header>

          <div className="jobs-grid">
            {orderedVacancies.map((job) => (
              <JobCard key={job.id} job={job} onDetails={setSelectedJob} />
            ))}
          </div>
        </section>
      </main>

      {isPostModalOpen && <PostJobModal onClose={() => setIsPostModalOpen(false)} />}
      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </>
  );
}

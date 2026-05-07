import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Button } from '@/shared/components/ui/Button';
import EmptyState from '@/shared/components/ui/EmptyState';
import { DeleteConfirmModal } from '@/features/events/components/DeleteConfirmModal';
import { toast } from '@/shared/components/ui/Toast';
import { ROUTES } from '@/shared/constants/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useJobVacancies } from '../hooks/useJobVacancies';
import { useDeleteVacancy } from '../hooks/useManageVacancy';
import type { JobVacancyViewModel } from '../api/adapters';
import {
  getTone,
  JobCard,
  JobsLoadingState,
  jobsGridClassName,
  jobCardMiniActionClassName,
  jobCardMiniActionDangerClassName,
  jobsPageHeaderClassName,
  jobsPagePostButtonClassName,
  jobsPageShellClassName,
  jobsPageSubtitleClassName,
  jobsPageTitleClassName,
  PostJobModal,
} from './JobVacanciesPage';

function useCurrentOwnerIds() {
  const user = useIdentityStore((state) => state.user);

  return useMemo(
    () =>
      new Set(
        [user?.id, user?.memberId].filter((value): value is string => Boolean(value)).map(String),
      ),
    [user?.id, user?.memberId],
  );
}

export default function MyJobPostsPage() {
  const navigate = useNavigate();
  const user = useIdentityStore((state) => state.user);
  const ownerIds = useCurrentOwnerIds();
  const { data: vacancies = [], isLoading, isError, error, refetch } = useJobVacancies();
  const deleteVacancy = useDeleteVacancy();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobVacancyViewModel | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobVacancyViewModel | null>(null);

  const myVacancies = useMemo(
    () =>
      vacancies
        .filter((job) => job.ownerId && ownerIds.has(job.ownerId))
        .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()),
    [ownerIds, vacancies],
  );

  const handleDeleteVacancy = async () => {
    if (!jobToDelete) return;

    try {
      await deleteVacancy.mutateAsync({ id: jobToDelete.id });
      toast.success('Job vacancy deleted successfully.');
      setJobToDelete(null);
    } catch (deleteError: any) {
      toast.fromError(deleteError);
    }
  };

  const handleEditJob = (job: JobVacancyViewModel) => {
    setEditingJob(job);
  };

  const handleOpenJobDetails = (job: JobVacancyViewModel) => {
    navigate(ROUTES.JOB_VACANCY_DETAIL(job.id));
  };

  const hasOwnerIdentity = ownerIds.size > 0;

  return (
    <>
      <SEO
        title="My Job Posts"
        description="Manage the job vacancies you shared with the FGGC Owerri Alumnae Association."
      />

      <main className="min-h-full bg-[#f8f8f7] text-[#071116]">
        <section className={jobsPageShellClassName} aria-labelledby="my-job-posts-title">
          <header className={jobsPageHeaderClassName}>
            <div>
              <h1 id="my-job-posts-title" className={jobsPageTitleClassName}>
                My Job Posts
              </h1>
              <p className={jobsPageSubtitleClassName}>
                Manage the job vacancies you shared with the community.
              </p>
            </div>

            <Button
              type="button"
              size="lg"
              className={jobsPagePostButtonClassName}
              onClick={() => setIsPostModalOpen(true)}
            >
              Post a Job
              <Icon icon="mdi:plus" />
            </Button>
          </header>

          {isLoading ? <JobsLoadingState /> : null}

          {!isLoading && isError ? (
            <EmptyState
              icon="mdi:briefcase-search-outline"
              title="We couldn't load your job posts"
              description={error instanceof Error ? error.message : 'Please try again.'}
              actionLabel="Try Again"
              onAction={() => {
                void refetch();
              }}
            />
          ) : null}

          {!isLoading && !isError && !hasOwnerIdentity ? (
            <EmptyState
              icon="mdi:account-alert-outline"
              title="We couldn't identify your account"
              description="Please sign out and sign back in, then try again."
            />
          ) : null}

          {!isLoading && !isError && hasOwnerIdentity && myVacancies.length === 0 ? (
            <EmptyState
              icon="mdi:briefcase-plus-outline"
              title="No job posts yet"
              description="Jobs you post will appear here so you can edit or delete them."
              actionLabel="Post a Job"
              onAction={() => setIsPostModalOpen(true)}
            />
          ) : null}

          {!isLoading && !isError && myVacancies.length > 0 ? (
            <div className={jobsGridClassName}>
              {myVacancies.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  tone={getTone(index)}
                  onDetails={handleOpenJobDetails}
                  actions={
                    <>
                      <button
                        type="button"
                        className={jobCardMiniActionClassName}
                        onClick={() => handleEditJob(job)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${jobCardMiniActionClassName} ${jobCardMiniActionDangerClassName}`}
                        onClick={() => setJobToDelete(job)}
                      >
                        Delete
                      </button>
                    </>
                  }
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
          onSubmitted={() => setIsPostModalOpen(false)}
        />
      ) : null}

      {editingJob ? (
        <PostJobModal
          chapterId={user?.chapterId}
          editData={editingJob}
          onClose={() => setEditingJob(null)}
          onSubmitted={() => setEditingJob(null)}
        />
      ) : null}

      {jobToDelete ? (
        <DeleteConfirmModal
          title={jobToDelete.title}
          isDeleting={deleteVacancy.isPending}
          onCancel={() => setJobToDelete(null)}
          onConfirm={() => {
            void handleDeleteVacancy();
          }}
          heading="Delete Vacancy?"
          description={`Are you sure you want to delete "${jobToDelete.title}"? This action cannot be undone.`}
        />
      ) : null}
    </>
  );
}

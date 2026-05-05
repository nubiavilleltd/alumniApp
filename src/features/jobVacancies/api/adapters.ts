import {
  CreateVacancyPayload,
  JobVacancy,
  JobType,
  LevelOfExpertise,
  UpdateVacancyPayload,
  WorkplaceType,
} from '../types/jobVacancies.types';

export type JobVacancyViewModel = {
  id: string;
  ownerId?: string;
  title: string;
  companyName: string;
  jobType: JobType;
  workplaceType: WorkplaceType;
  levelOfExpertise: LevelOfExpertise;
  postedAt: string;
  salary: string;
  currency: string;
  location: string;
  tags: string[];
  requirements: string;
  responsibilities: string;
  aboutRole: string;
  applicationMode: 'email' | 'link';
  applicationEmail?: string;
  applicationUrl?: string;
  flyer?: string;
};

export function vacancyToViewModel(vacancy: JobVacancy): JobVacancyViewModel {
  const ownerId =
    vacancy.created_by ??
    vacancy.createdBy ??
    vacancy.user_id ??
    vacancy.userId ??
    vacancy.posted_by ??
    vacancy.postedBy ??
    vacancy.member_id;

  return {
    id: String(vacancy.id),
    ownerId:
      ownerId !== null && ownerId !== undefined && ownerId !== '' ? String(ownerId) : undefined,
    title: vacancy.job_title,
    companyName: vacancy.company_name,
    jobType: vacancy.job_type,
    workplaceType: vacancy.workplace_type,
    levelOfExpertise: vacancy.level_of_expertise,
    postedAt: vacancy.application_deadline,
    salary: vacancy.salary,
    currency: vacancy.currency ? String(vacancy.currency) : 'NGN',
    location: vacancy.location,
    tags: vacancy.keywords
      ? vacancy.keywords
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean)
      : [],
    requirements: vacancy.requirements,
    responsibilities: vacancy.responsibilities,
    aboutRole: vacancy.about_role,
    applicationMode: vacancy.application_type,
    applicationEmail: vacancy.application_email,
    applicationUrl: vacancy.application_link,
    flyer: vacancy.flyer,
  };
}

export function createVacancyFormData(payload: CreateVacancyPayload): FormData {
  const formData = new FormData();

  formData.append('job_title', payload.job_title);
  formData.append('company_name', payload.company_name);
  formData.append('job_type', payload.job_type);
  formData.append('workplace_type', payload.workplace_type);
  formData.append('level_of_expertise', payload.level_of_expertise);
  formData.append('location', payload.location);
  formData.append('salary', payload.salary);
  if (payload.currency) formData.append('currency', String(payload.currency));
  formData.append('application_deadline', payload.application_deadline);
  formData.append('keywords', payload.keywords ?? '');
  formData.append('about_role', payload.about_role);
  formData.append('responsibilities', payload.responsibilities);
  formData.append('requirements', payload.requirements);
  formData.append('application_type', payload.application_type);
  formData.append('chapter_id', String(payload.chapter_id));

  if (payload.application_type === 'email' && payload.application_email) {
    formData.append('application_email', payload.application_email);
  }

  if (payload.application_type === 'link' && payload.application_link) {
    formData.append('application_link', payload.application_link);
  }

  if (payload.flyer) {
    formData.append('flyer', payload.flyer);
  }

  return formData;
}

export function createUpdateVacancyPayload(payload: UpdateVacancyPayload) {
  return {
    function_type: 'update' as const,
    ...payload,
  };
}

export function createDeleteVacancyPayload(id: number | string) {
  return {
    function_type: 'delete' as const,
    id,
  };
}

export type EventQuestionType =
  | 'short_answer'
  | 'long_answer'
  | 'multiple_choice'
  | 'checkbox'
  | 'dropdown';

export type EventRegistrationAnswerValue = string | string[];

export interface FirebaseSurveyQuestion {
  id: string;
  label: string;
  type: EventQuestionType;
  required: boolean;
  placeholder: string;
  options: string[];
  order: number;
}

export interface FirebaseSurveyFormSnapshot {
  name: string;
  questions: FirebaseSurveyQuestion[];
}

export interface FirebaseSurveyFormDocument {
  eventId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  activeVersionId: string;
  activeVersionNumber: number;
  activeSnapshot: FirebaseSurveyFormSnapshot;
  hasSubmissions: boolean;
  createdBy: string;
  createdByName?: string;
  createdAt: unknown;
  updatedAt: unknown;
  updatedBy: string;
}

export interface FirebaseSurveyFormVersionDocument {
  versionNumber: number;
  name: string;
  sortOrder: number;
  questions: FirebaseSurveyQuestion[];
  createdBy: string;
  createdByName?: string;
  createdAt: unknown;
  status: 'draft' | 'published' | 'archived';
}

export interface FirebaseSurveyFormVersionRef {
  formId: string;
  formVersionId: string;
  formVersionNumber: number;
  formName: string;
}

export interface FirebaseSurveyStoredAnswer {
  formId: string;
  formVersionId: string;
  questionId: string;
  questionLabel: string;
  questionType: EventQuestionType;
  order: number;
  required: boolean;
  value: EventRegistrationAnswerValue;
}

export interface EventSurveySubmissionQuestionView extends FirebaseSurveyQuestion {
  value: EventRegistrationAnswerValue | null;
}

export interface EventSurveySubmissionFormView {
  formId: string;
  formName: string;
  formVersionId: string;
  formVersionNumber: number;
  questions: EventSurveySubmissionQuestionView[];
}

export interface FirebaseSurveyRegistrationDocument {
  eventId: string;
  eventTitleSnapshot: string;
  userId: string;
  userName: string;
  userEmail: string;
  rsvpStatus: 'going' | 'maybe' | 'not_going';
  additionalInfo: string;
  formVersions: FirebaseSurveyFormVersionRef[];
  answers: FirebaseSurveyStoredAnswer[];
  submittedAt: unknown;
  updatedAt: unknown;
}

export interface EventSurveyFormView {
  id: string;
  name: string;
  sortOrder: number;
  version: number;
  questions: FirebaseSurveyQuestion[];
}

export interface ActiveSurveyFormView extends EventSurveyFormView {
  activeVersionId: string;
  activeVersionNumber: number;
}

export interface GetEventSurveyFormsRequest {
  eventId: string;
}

export interface GetEventSurveyFormsResponse {
  eventId: string;
  forms: EventSurveyFormView[];
}

export interface UpsertEventSurveyFormRequest {
  eventId: string;
  eventTitleSnapshot?: string;
  formId?: string;
  name: string;
  sortOrder: number;
  questions: FirebaseSurveyQuestion[];
}

export interface UpsertEventSurveyFormResponse {
  form: EventSurveyFormView;
}

export interface ArchiveEventSurveyFormRequest {
  eventId: string;
  formId: string;
}

export interface ArchiveEventSurveyFormResponse {
  success: true;
}

export interface ReorderEventSurveyFormsRequest {
  eventId: string;
  forms: Array<{
    formId: string;
    sortOrder: number;
  }>;
}

export interface ReorderEventSurveyFormsResponse {
  success: true;
}

export interface SubmitEventSurveyAnswerInput {
  formId: string;
  questionId: string;
  value: EventRegistrationAnswerValue;
}

export interface SubmitEventSurveyRegistrationRequest {
  eventId: string;
  eventTitleSnapshot?: string;
  rsvpStatus: 'going' | 'maybe' | 'not_going';
  additionalInfo: string;
  answers: SubmitEventSurveyAnswerInput[];
}

export interface SubmitEventSurveyRegistrationResponse {
  registration: FirebaseSurveyRegistrationDocument;
}

export interface ValidateEventSurveyRegistrationRequest {
  eventId: string;
  answers: SubmitEventSurveyAnswerInput[];
}

export interface ValidateEventSurveyRegistrationResponse {
  success: true;
}

export interface EventSurveySubmissionListItem {
  userId: string;
  userName: string;
  userEmail: string;
  rsvpStatus: 'going' | 'maybe' | 'not_going';
  submittedAt: string;
  updatedAt: string;
  hasSurveyResponse: boolean;
}

export interface GetEventSurveySubmissionsRequest {
  eventId: string;
}

export interface GetEventSurveySubmissionsResponse {
  eventId: string;
  submissions: EventSurveySubmissionListItem[];
}

export interface GetEventSurveySubmissionDetailRequest {
  eventId: string;
  userId: string;
}

export interface GetEventSurveySubmissionDetailResponse {
  registration: FirebaseSurveyRegistrationDocument;
  forms: EventSurveySubmissionFormView[];
}

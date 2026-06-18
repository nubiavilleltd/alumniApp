import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { firebaseApp, firebaseFunctionsRegion } from './index';
import type {
  ArchiveEventSurveyFormRequest,
  ArchiveEventSurveyFormResponse,
  GetEventSurveyFormsRequest,
  GetEventSurveyFormsResponse,
  GetEventSurveySubmissionDetailRequest,
  GetEventSurveySubmissionDetailResponse,
  GetEventSurveySubmissionsRequest,
  GetEventSurveySubmissionsResponse,
  ReorderEventSurveyFormsRequest,
  ReorderEventSurveyFormsResponse,
  SubmitEventSurveyRegistrationRequest,
  SubmitEventSurveyRegistrationResponse,
  UpsertEventSurveyFormRequest,
  UpsertEventSurveyFormResponse,
  ValidateEventSurveyRegistrationRequest,
  ValidateEventSurveyRegistrationResponse,
} from './survey.types';

export const SURVEY_FUNCTION_NAMES = {
  GET_EVENT_SURVEY_FORMS: 'getEventSurveyForms',
  VALIDATE_EVENT_SURVEY_REGISTRATION: 'validateEventSurveyRegistration',
  UPSERT_EVENT_SURVEY_FORM: 'upsertEventSurveyForm',
  ARCHIVE_EVENT_SURVEY_FORM: 'archiveEventSurveyForm',
  REORDER_EVENT_SURVEY_FORMS: 'reorderEventSurveyForms',
  SUBMIT_EVENT_SURVEY_REGISTRATION: 'submitEventSurveyRegistration',
  GET_EVENT_SURVEY_SUBMISSIONS: 'getEventSurveySubmissions',
  GET_EVENT_SURVEY_SUBMISSION_DETAIL: 'getEventSurveySubmissionDetail',
} as const;

async function callSurveyFunction<TRequest, TResponse>(name: string, payload: TRequest) {
  const accessToken = useTokenStore.getState().accessToken;
  const userId = useIdentityStore.getState().user?.id;

  if (!accessToken) {
    throw new Error('You must be logged in to use event survey functions.');
  }

  if (!userId) {
    throw new Error('Missing current user ID for event survey request.');
  }

  const configuredBaseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL?.trim();
  const baseUrl =
    configuredBaseUrl && configuredBaseUrl.length > 0
      ? configuredBaseUrl.replace(/\/+$/, '')
      : `https://${firebaseFunctionsRegion}-${firebaseApp.options.projectId}.cloudfunctions.net`;

  const response = await fetch(`${baseUrl}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-User-Id': userId,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data &&
        typeof data === 'object' &&
        ('error' in data
          ? (data.error as string)
          : 'message' in data
            ? (data.message as string)
            : null)) ||
      'Event survey request failed.';

    throw new Error(message);
  }

  return data as TResponse;
}

export const eventSurveyFunctionsApi = {
  getEventSurveyForms(payload: GetEventSurveyFormsRequest) {
    return callSurveyFunction<GetEventSurveyFormsRequest, GetEventSurveyFormsResponse>(
      SURVEY_FUNCTION_NAMES.GET_EVENT_SURVEY_FORMS,
      payload,
    );
  },

  validateEventSurveyRegistration(payload: ValidateEventSurveyRegistrationRequest) {
    return callSurveyFunction<
      ValidateEventSurveyRegistrationRequest,
      ValidateEventSurveyRegistrationResponse
    >(SURVEY_FUNCTION_NAMES.VALIDATE_EVENT_SURVEY_REGISTRATION, payload);
  },

  upsertEventSurveyForm(payload: UpsertEventSurveyFormRequest) {
    return callSurveyFunction<UpsertEventSurveyFormRequest, UpsertEventSurveyFormResponse>(
      SURVEY_FUNCTION_NAMES.UPSERT_EVENT_SURVEY_FORM,
      payload,
    );
  },

  archiveEventSurveyForm(payload: ArchiveEventSurveyFormRequest) {
    return callSurveyFunction<ArchiveEventSurveyFormRequest, ArchiveEventSurveyFormResponse>(
      SURVEY_FUNCTION_NAMES.ARCHIVE_EVENT_SURVEY_FORM,
      payload,
    );
  },

  reorderEventSurveyForms(payload: ReorderEventSurveyFormsRequest) {
    return callSurveyFunction<ReorderEventSurveyFormsRequest, ReorderEventSurveyFormsResponse>(
      SURVEY_FUNCTION_NAMES.REORDER_EVENT_SURVEY_FORMS,
      payload,
    );
  },

  submitEventSurveyRegistration(payload: SubmitEventSurveyRegistrationRequest) {
    return callSurveyFunction<
      SubmitEventSurveyRegistrationRequest,
      SubmitEventSurveyRegistrationResponse
    >(SURVEY_FUNCTION_NAMES.SUBMIT_EVENT_SURVEY_REGISTRATION, payload);
  },

  getEventSurveySubmissions(payload: GetEventSurveySubmissionsRequest) {
    return callSurveyFunction<GetEventSurveySubmissionsRequest, GetEventSurveySubmissionsResponse>(
      SURVEY_FUNCTION_NAMES.GET_EVENT_SURVEY_SUBMISSIONS,
      payload,
    );
  },

  getEventSurveySubmissionDetail(payload: GetEventSurveySubmissionDetailRequest) {
    return callSurveyFunction<
      GetEventSurveySubmissionDetailRequest,
      GetEventSurveySubmissionDetailResponse
    >(SURVEY_FUNCTION_NAMES.GET_EVENT_SURVEY_SUBMISSION_DETAIL, payload);
  },
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventSurveyFunctionsApi } from '../api/firebase/survey.functions';
import type {
  GetEventSurveyFormsRequest,
  ReorderEventSurveyFormsRequest,
  SubmitEventSurveyRegistrationRequest,
  UpsertEventSurveyFormRequest,
  ArchiveEventSurveyFormRequest,
  EventSurveyFormView,
  EventSurveySubmissionListItem,
  GetEventSurveySubmissionDetailResponse,
  ValidateEventSurveyRegistrationRequest,
} from '../api/firebase/survey.types';

export const eventSurveyKeys = {
  all: ['event-surveys'] as const,
  forms: (eventId: string) => [...eventSurveyKeys.all, 'forms', eventId] as const,
  submissions: (eventId: string) => [...eventSurveyKeys.all, 'submissions', eventId] as const,
  submissionDetail: (eventId: string, userId: string) =>
    [...eventSurveyKeys.all, 'submissions', eventId, userId] as const,
};

export function useEventSurveyForms(eventId: string, enabled = true) {
  return useQuery<EventSurveyFormView[]>({
    queryKey: eventSurveyKeys.forms(eventId),
    queryFn: async () => {
      const response = await eventSurveyFunctionsApi.getEventSurveyForms({
        eventId,
      } satisfies GetEventSurveyFormsRequest);

      return response.forms;
    },
    enabled: enabled && !!eventId,
    staleTime: 1000 * 60,
  });
}

export function useUpsertEventSurveyForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertEventSurveyFormRequest) =>
      eventSurveyFunctionsApi.upsertEventSurveyForm(payload),
    onSuccess: (_result, payload) => {
      queryClient.invalidateQueries({
        queryKey: eventSurveyKeys.forms(payload.eventId),
      });
    },
  });
}

export function useArchiveEventSurveyForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ArchiveEventSurveyFormRequest) =>
      eventSurveyFunctionsApi.archiveEventSurveyForm(payload),
    onSuccess: (_result, payload) => {
      queryClient.invalidateQueries({
        queryKey: eventSurveyKeys.forms(payload.eventId),
      });
    },
  });
}

export function useReorderEventSurveyForms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderEventSurveyFormsRequest) =>
      eventSurveyFunctionsApi.reorderEventSurveyForms(payload),
    onSuccess: (_result, payload) => {
      queryClient.invalidateQueries({
        queryKey: eventSurveyKeys.forms(payload.eventId),
      });
    },
  });
}

export function useSubmitEventSurveyRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitEventSurveyRegistrationRequest) =>
      eventSurveyFunctionsApi.submitEventSurveyRegistration(payload),
    onSuccess: (_result, payload) => {
      queryClient.invalidateQueries({
        queryKey: eventSurveyKeys.submissions(payload.eventId),
      });
    },
  });
}

export function useValidateEventSurveyRegistration() {
  return useMutation({
    mutationFn: (payload: ValidateEventSurveyRegistrationRequest) =>
      eventSurveyFunctionsApi.validateEventSurveyRegistration(payload),
  });
}

export function useEventSurveySubmissions(eventId: string, enabled = true) {
  return useQuery<EventSurveySubmissionListItem[]>({
    queryKey: eventSurveyKeys.submissions(eventId),
    queryFn: async () => {
      const response = await eventSurveyFunctionsApi.getEventSurveySubmissions({
        eventId,
      });

      return response.submissions;
    },
    enabled: enabled && !!eventId,
    staleTime: 1000 * 30,
  });
}

export function useEventSurveySubmissionDetail(eventId: string, userId: string, enabled = true) {
  return useQuery<GetEventSurveySubmissionDetailResponse>({
    queryKey: eventSurveyKeys.submissionDetail(eventId, userId),
    queryFn: async () => {
      return eventSurveyFunctionsApi.getEventSurveySubmissionDetail({
        eventId,
        userId,
      });
    },
    enabled: enabled && !!eventId && !!userId,
    staleTime: 1000 * 30,
  });
}

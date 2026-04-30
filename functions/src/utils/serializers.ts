import { Timestamp } from 'firebase-admin/firestore';
import type {
  EventSurveyFormView,
  FirebaseSurveyFormDocument,
  FirebaseSurveyRegistrationDocument,
} from '../types/survey';

function sortQuestions<T extends { order: number }>(questions: T[]) {
  return [...questions].sort((a, b) => a.order - b.order);
}

export function toIsoString(value: unknown) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const asTimestamp = value as { toDate: () => Date };
    return asTimestamp.toDate().toISOString();
  }

  return '';
}

export function serializeFormView(
  id: string,
  data: FirebaseSurveyFormDocument,
): EventSurveyFormView {
  const questions = Array.isArray(data.activeSnapshot?.questions)
    ? data.activeSnapshot.questions
    : [];

  return {
    id,
    name: String(data.name ?? ''),
    sortOrder: Number(data.sortOrder ?? 0),
    version: Number(data.activeVersionNumber ?? 1),
    questions: sortQuestions(questions),
  };
}

export function serializeRegistration(
  data: FirebaseSurveyRegistrationDocument,
): FirebaseSurveyRegistrationDocument {
  return {
    ...data,
    answers: [...data.answers].sort((a, b) => a.order - b.order),
    submittedAt: toIsoString(data.submittedAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

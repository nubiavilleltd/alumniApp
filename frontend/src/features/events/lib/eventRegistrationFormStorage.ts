import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import type {
  EventRegistrationAnswerValue,
  EventRegistrationFormDraft,
  StoredEventRegistrationAnswer,
  StoredEventRegistrationForm,
  StoredEventRegistrationQuestion,
  StoredEventRegistrationResponse,
} from '../types/eventRegistrationForm.types';

const EVENT_REGISTRATION_FORMS_STORAGE_KEY = 'events.registrationForms.v1';
const EVENT_REGISTRATION_RESPONSES_STORAGE_KEY = 'events.registrationResponses.v1';

type EventRegistrationFormsStore = Record<string, StoredEventRegistrationForm[]>;
type EventRegistrationResponsesStore = Record<string, StoredEventRegistrationResponse>;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readJSONRecord<T extends Record<string, unknown>>(storageKey: string): T {
  if (typeof window === 'undefined') {
    return {} as T;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return {} as T;
    }

    const parsedValue = JSON.parse(rawValue);
    if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
      return {} as T;
    }

    return parsedValue as T;
  } catch {
    return {} as T;
  }
}

function writeJSONRecord(storageKey: string, store: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(store));
  } catch {
    // Ignore storage write failures so the prototype remains best-effort.
  }
}

function readFormsStore() {
  return readJSONRecord<EventRegistrationFormsStore>(EVENT_REGISTRATION_FORMS_STORAGE_KEY);
}

function writeFormsStore(store: EventRegistrationFormsStore) {
  writeJSONRecord(EVENT_REGISTRATION_FORMS_STORAGE_KEY, store);
}

function readResponsesStore() {
  return readJSONRecord<EventRegistrationResponsesStore>(EVENT_REGISTRATION_RESPONSES_STORAGE_KEY);
}

function writeResponsesStore(store: EventRegistrationResponsesStore) {
  writeJSONRecord(EVENT_REGISTRATION_RESPONSES_STORAGE_KEY, store);
}

function getResponseStorageKey(eventId: string, userId: string) {
  return `${eventId}:${userId}`;
}

export function saveEventRegistrationForms(params: {
  eventId: string;
  eventTitle: string;
  drafts: EventRegistrationFormDraft[];
  createdBy: Pick<AuthSessionUser, 'id' | 'fullName'>;
  now?: string;
}) {
  const { eventId, eventTitle, drafts, createdBy, now = new Date().toISOString() } = params;
  const store = readFormsStore();
  const existingForms = store[eventId] ?? [];

  const nextForms: StoredEventRegistrationForm[] = drafts.map((draft, draftIndex) => {
    const existingForm = existingForms[draftIndex];
    const formId = existingForm?.id ?? createId('event-form');

    const questions: StoredEventRegistrationQuestion[] = draft.questions.map((question, index) => ({
      ...question,
      formId,
      label: question.label.trim(),
      placeholder: question.placeholder.trim(),
      options: question.options.map((option) => option.trim()).filter(Boolean),
      order: index + 1,
    }));

    return {
      id: formId,
      eventId,
      eventTitleSnapshot: eventTitle,
      name: draft.name.trim(),
      createdByUserId: createdBy.id,
      createdByName: createdBy.fullName,
      createdAt: existingForm?.createdAt ?? now,
      updatedAt: now,
      version: existingForm ? existingForm.version + 1 : 1,
      isActive: true,
      questions,
    };
  });

  store[eventId] = nextForms;
  writeFormsStore(store);

  return nextForms;
}

export function getEventRegistrationForms(eventId: string) {
  if (!eventId) {
    return [];
  }

  const store = readFormsStore();
  return store[eventId] ?? [];
}

export function listEventRegistrationForms() {
  return Object.values(readFormsStore())
    .flat()
    .sort((a, b) => a.eventTitleSnapshot.localeCompare(b.eventTitleSnapshot));
}

export function deleteEventRegistrationForms(eventId: string) {
  if (!eventId) {
    return;
  }

  const store = readFormsStore();
  if (!store[eventId]) {
    return;
  }

  delete store[eventId];
  writeFormsStore(store);
}

export function saveEventRegistrationResponse(params: {
  eventId: string;
  eventTitle: string;
  forms: StoredEventRegistrationForm[];
  user: Pick<AuthSessionUser, 'id' | 'fullName' | 'email'>;
  rsvpStatus: 'going' | 'maybe' | 'not_going';
  additionalInfo: string;
  answers: StoredEventRegistrationAnswer[];
  now?: string;
}) {
  const {
    eventId,
    eventTitle,
    forms,
    user,
    rsvpStatus,
    additionalInfo,
    answers,
    now = new Date().toISOString(),
  } = params;
  const store = readResponsesStore();
  const storageKey = getResponseStorageKey(eventId, user.id);
  const existingResponse = store[storageKey];

  const nextResponse: StoredEventRegistrationResponse = {
    id: existingResponse?.id ?? createId('event-registration-response'),
    eventId,
    eventTitleSnapshot: eventTitle,
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    rsvpStatus,
    additionalInfo: additionalInfo.trim(),
    answers,
    submittedAt: existingResponse?.submittedAt ?? now,
    updatedAt: now,
  };

  store[storageKey] = nextResponse;
  writeResponsesStore(store);

  return nextResponse;
}

export function getEventRegistrationResponse(eventId: string, userId: string) {
  if (!eventId || !userId) {
    return null;
  }

  const store = readResponsesStore();
  return store[getResponseStorageKey(eventId, userId)] ?? null;
}

export function listEventRegistrationResponses(eventId?: string) {
  const responses = Object.values(readResponsesStore());
  const filteredResponses = eventId
    ? responses.filter((response) => response.eventId === eventId)
    : responses;

  return filteredResponses.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function formatAnswerValueForText(value: EventRegistrationAnswerValue) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value.trim();
}

export function serializeRegistrationAnswersForAdditionalInfo(params: {
  forms: StoredEventRegistrationForm[];
  answers: StoredEventRegistrationAnswer[];
  additionalInfo: string;
}) {
  const { forms, answers, additionalInfo } = params;
  const lines: string[] = [];

  forms.forEach((form) => {
    lines.push(`Registration form: ${form.name}`);

    form.questions
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((question, index) => {
        const answer = answers.find((item) => item.questionId === question.id);
        const formattedValue = answer ? formatAnswerValueForText(answer.value) : '';

        lines.push(`${index + 1}. ${question.label}: ${formattedValue || '(no response)'}`);
      });

    lines.push('');
  });

  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  if (additionalInfo.trim()) {
    lines.push('', `Extra note: ${additionalInfo.trim()}`);
  }

  return lines.join('\n');
}

export type EventQuestionType =
  | 'short_answer'
  | 'long_answer'
  | 'multiple_choice'
  | 'checkbox'
  | 'dropdown';

export type EventRegistrationQuestionDraft = {
  id: string;
  label: string;
  type: EventQuestionType;
  placeholder: string;
  required: boolean;
  options: string[];
};

export type EventRegistrationFormDraft = {
  name: string;
  questions: EventRegistrationQuestionDraft[];
};

export interface StoredEventRegistrationQuestion extends EventRegistrationQuestionDraft {
  formId: string;
  order: number;
}

export interface StoredEventRegistrationForm {
  id: string;
  eventId: string;
  eventTitleSnapshot: string;
  name: string;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isActive: boolean;
  questions: StoredEventRegistrationQuestion[];
}

export type EventRegistrationAnswerValue = string | string[];

export interface StoredEventRegistrationAnswer {
  formId: string;
  formName: string;
  formVersion: number;
  questionId: string;
  questionLabel: string;
  questionType: EventQuestionType;
  order: number;
  required: boolean;
  value: EventRegistrationAnswerValue;
}

export interface StoredEventRegistrationResponse {
  id: string;
  eventId: string;
  eventTitleSnapshot: string;
  userId: string;
  userName: string;
  userEmail: string;
  rsvpStatus: 'going' | 'maybe' | 'not_going';
  additionalInfo: string;
  answers: StoredEventRegistrationAnswer[];
  submittedAt: string;
  updatedAt: string;
}

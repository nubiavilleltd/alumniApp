// features/events/components/RegisterEventModal.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { useEventRegistration } from '../hooks/useEventRegistration';
import type { Event } from '../types/event.types';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { EventRegistrationQuestionField } from './EventRegistrationQuestionField';
import { toast } from '@/shared/components/ui/Toast';
import {
  useEventSurveyForms,
  useSubmitEventSurveyRegistration,
  useValidateEventSurveyRegistration,
} from '../hooks/useEventSurvey';
import { serializeRegistrationAnswersForAdditionalInfo } from '../lib/eventSurveySerialization';
import {
  getStoredEventSurveyAvailability,
  setStoredEventSurveyAvailability,
} from '../lib/eventSurveyAvailability';
import { formatDateRange } from '@/shared/utils/dateHelpers';
import type {
  EventQuestionType,
  EventRegistrationAnswerValue,
} from '../types/eventRegistrationForm.types';
import type { EventSurveyFormView } from '../api/firebase/survey.types';
import { Calendar, CircleCheck, FileText, Info, LoaderCircle, MapPin, Shirt } from 'lucide-react';

const EMPTY_SURVEY_FORMS: EventSurveyFormView[] = [];
const MODAL_ICON_STROKE = 2.5;

interface StructuredSurveyAnswer {
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

interface RegisterEventModalProps {
  event: Event | null;
  onClose: () => void;
}

export function RegisterEventModal({ event, onClose }: RegisterEventModalProps) {
  // const currentUser = useAuthStore((state) => state.user);
  const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUser();
  const { register, isLoading } = useEventRegistration(event?.id || '');
  const submitSurveyRegistration = useSubmitEventSurveyRegistration();
  const validateSurveyRegistration = useValidateEventSurveyRegistration();

  const rsvpStatus = 'going' as const;
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [formAnswers, setFormAnswers] = useState<Record<string, EventRegistrationAnswerValue>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surveySubmissionWarning, setSurveySubmissionWarning] = useState<string | null>(null);
  const cachedSurveyAvailability = useMemo(
    () => getStoredEventSurveyAvailability(event?.id || ''),
    [event?.id],
  );
  const shouldUseSurvey =
    !!event?.id &&
    !!currentUser?.id &&
    (event?.hasRegistrationQuestions === true || cachedSurveyAvailability === 'enabled');

  const {
    data: surveyFormsData,
    isLoading: isLoadingSurveyForms,
    error: surveyFormsError,
  } = useEventSurveyForms(event?.id || '', shouldUseSurvey);
  const registrationForms = surveyFormsData ?? EMPTY_SURVEY_FORMS;
  const isSurveyMarkedButUnavailable =
    shouldUseSurvey && !isLoadingSurveyForms && !surveyFormsError && registrationForms.length === 0;
  const shouldBlockForSurveyLoadFailure = shouldUseSurvey && !!surveyFormsError;

  const formQuestions = useMemo(
    () =>
      registrationForms.flatMap((form) =>
        form.questions
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((question) => ({
            ...question,
            formId: form.id,
            formName: form.name,
            formVersion: form.version,
          })),
      ),
    [registrationForms],
  );

  useEffect(() => {
    if (!event?.id) return;

    if (event.hasRegistrationQuestions === true) {
      setStoredEventSurveyAvailability(event.id, true);
      return;
    }

    if (registrationForms.length > 0) {
      setStoredEventSurveyAvailability(event.id, true);
    }
  }, [event?.hasRegistrationQuestions, event?.id, registrationForms.length]);

  useEffect(() => {
    if (!event || !currentUser?.id) {
      setFormAnswers({});
      setQuestionErrors({});
      setAdditionalInfo('');
      return;
    }

    const nextAnswers = formQuestions.reduce<Record<string, EventRegistrationAnswerValue>>(
      (answers, question) => {
        answers[question.id] = question.type === 'checkbox' ? [] : '';
        return answers;
      },
      {},
    );

    setFormAnswers(nextAnswers);
    setQuestionErrors({});
    setAdditionalInfo('');
  }, [currentUser?.id, event?.id, formQuestions]);

  const updateAnswer = (questionId: string, value: EventRegistrationAnswerValue) => {
    setFormAnswers((current) => ({ ...current, [questionId]: value }));
    setQuestionErrors((current) => {
      if (!current[questionId]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[questionId];
      return nextErrors;
    });
  };

  const toggleCheckboxAnswer = (questionId: string, option: string) => {
    const question = formQuestions.find((item) => item.id === questionId);
    const selectedValues = Array.isArray(formAnswers[questionId]) ? formAnswers[questionId] : [];
    const isAddingBeyondLimit =
      question?.type === 'checkbox' &&
      question.maxSelections !== null &&
      !selectedValues.includes(option) &&
      selectedValues.length >= question.maxSelections;

    setFormAnswers((current) => {
      const currentValues = Array.isArray(current[questionId]) ? current[questionId] : [];
      const isRemovingOption = currentValues.includes(option);

      if (
        !isRemovingOption &&
        question?.type === 'checkbox' &&
        question.maxSelections !== null &&
        currentValues.length >= question.maxSelections
      ) {
        return current;
      }

      const nextValues = isRemovingOption
        ? currentValues.filter((value) => value !== option)
        : [...currentValues, option];

      return {
        ...current,
        [questionId]: nextValues,
      };
    });
    setQuestionErrors((current) => {
      if (isAddingBeyondLimit && question?.maxSelections !== null) {
        return {
          ...current,
          [questionId]: `Select up to ${question.maxSelections} option${
            question.maxSelections === 1 ? '' : 's'
          }.`,
        };
      }

      if (!current[questionId]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[questionId];
      return nextErrors;
    });
  };

  const buildStructuredAnswers = (): StructuredSurveyAnswer[] => {
    return formQuestions.map((question) => {
      const rawValue = formAnswers[question.id];
      const normalizedValue = Array.isArray(rawValue)
        ? rawValue.map((value) => value.trim()).filter(Boolean)
        : String(rawValue ?? '').trim();

      return {
        formId: question.formId,
        formName: question.formName,
        formVersion: question.formVersion,
        questionId: question.id,
        questionLabel: question.label,
        questionType: question.type,
        order: question.order,
        required: question.required,
        value: normalizedValue,
      };
    });
  };

  const validateStructuredAnswers = (answers: StructuredSurveyAnswer[]) => {
    const nextErrors: Record<string, string> = {};

    for (const answer of answers) {
      const question = formQuestions.find((item) => item.id === answer.questionId);
      if (!question) {
        continue;
      }

      if (question.required) {
        const isEmpty = Array.isArray(answer.value)
          ? answer.value.length === 0
          : answer.value.trim().length === 0;

        if (isEmpty) {
          nextErrors[question.id] = 'This question is required.';
          continue;
        }
      }

      if (
        (question.type === 'multiple_choice' || question.type === 'dropdown') &&
        !Array.isArray(answer.value) &&
        answer.value &&
        !question.options.includes(answer.value)
      ) {
        nextErrors[question.id] = 'Please select one of the provided options.';
      }

      if (question.type === 'checkbox' && Array.isArray(answer.value)) {
        const hasInvalidOption = answer.value.some((value) => !question.options.includes(value));
        if (hasInvalidOption) {
          nextErrors[question.id] = 'Please choose only from the listed options.';
          continue;
        }

        if (question.maxSelections !== null && answer.value.length > question.maxSelections) {
          nextErrors[question.id] = `Select up to ${question.maxSelections} option${
            question.maxSelections === 1 ? '' : 's'
          }.`;
        }
      }
    }

    setQuestionErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!currentUser || !event) {
  //     console.error('User must be logged in to register');
  //     setError('You must be logged in to register for events');
  //     return;
  //   }

  //   try {
  //     // Register with status 'going' (backend supports 'going', 'maybe', 'not_going')
  //     register('going');
  //     setSubmitted(true);
  //   } catch (err) {
  //     setError('Failed to register. Please try again.');
  //     console.error('Registration error:', err);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSurveySubmissionWarning(null);

    if (!currentUser || !event) {
      setError('You must be logged in to register for events');
      return;
    }

    if (shouldBlockForSurveyLoadFailure || isSurveyMarkedButUnavailable) {
      setError('We could not load the event registration questions. Please try again.');
      return;
    }

    try {
      const structuredAnswers = buildStructuredAnswers();

      if (registrationForms.length > 0 && !validateStructuredAnswers(structuredAnswers)) {
        setError('Please complete the required registration questions.');
        return;
      }

      const submissionAnswers = structuredAnswers.map((answer) => ({
        formId: answer.formId,
        questionId: answer.questionId,
        value: answer.value,
      }));

      if (shouldUseSurvey && registrationForms.length > 0) {
        try {
          await validateSurveyRegistration.mutateAsync({
            eventId: event.id,
            answers: submissionAnswers,
          });
        } catch (surveyValidationError: any) {
          const validationMessage =
            surveyValidationError?.message ||
            'We could not validate your registration answers. Please review them and try again.';

          setError(validationMessage);
          window.alert(validationMessage);
          return;
        }
      }

      const apiAdditionalInfo =
        shouldUseSurvey && registrationForms.length > 0
          ? serializeRegistrationAnswersForAdditionalInfo({
              forms: registrationForms,
              answers: structuredAnswers,
              additionalInfo,
            })
          : additionalInfo;

      await register({
        status: rsvpStatus,
        additionalInfo: apiAdditionalInfo,
      });

      if (shouldUseSurvey && registrationForms.length > 0) {
        try {
          await submitSurveyRegistration.mutateAsync({
            eventId: event.id,
            eventTitleSnapshot: event.title,
            rsvpStatus,
            additionalInfo,
            answers: submissionAnswers,
          });
        } catch (surveyError: any) {
          const warningMessage =
            surveyError?.message ||
            'Your RSVP was saved, but we could not save the extra registration responses.';

          setSurveySubmissionWarning(warningMessage);
          toast.error(warningMessage);
        }
      }

      //This is a workaround for get_events CORS error. Work on it Remove it once it fixed
      // toast.success('You have successfully for registered for this event');

      setSubmitted(true);

      //This is a workaround for get_events CORS error. Work on it. Work on it Remove it once it fixed
      // setTimeout(window.location.reload, 3000);
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  // const handleClose = () => {
  //   onClose();
  //   // Reset state after modal closes
  //   setTimeout(() => {
  //     setSubmitted(false);
  //     setError(null);
  //   }, 300);
  // };

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setAdditionalInfo('');
      setFormAnswers({});
      setQuestionErrors({});
      setSurveySubmissionWarning(null);
    }, 300);
  };

  if (!event) return null;

  return (
    <Modal isOpen={!!event} onClose={handleClose} title="Confirm Registration">
      {submitted ? (
        <div className="text-center py-8">
          <CircleCheck
            size={56}
            strokeWidth={MODAL_ICON_STROKE}
            className="mx-auto mb-4 text-primary-500"
          />
          <h3 className="text-gray-900 font-bold text-lg mb-2">Registration Successful!</h3>
          <p className="text-gray-500 text-sm mb-6">
            You have successfully registered for{' '}
            <span className="font-semibold">{event.title}</span>.
          </p>

          {surveySubmissionWarning ? (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-left">
              <p className="text-sm font-semibold text-yellow-800">One more thing</p>
              <p className="mt-1 text-xs text-yellow-700">{surveySubmissionWarning}</p>
            </div>
          ) : null}

          {/* Show virtual link if event is virtual */}
          {event.isVirtual && event.virtualLink && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-xs font-semibold text-blue-900 mb-2">Virtual Event Link:</p>
              <a
                href={event.virtualLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 underline break-all"
              >
                {event.virtualLink}
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-2.5 rounded-full transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Event Details Summary */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Event Details
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              {formatDateRange(event.startDate, event.endDate, {
                locale: 'en-GB',
                formatOptions: {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                },
              }) && (
                <div className="flex items-start gap-2">
                  <Calendar size={15} strokeWidth={MODAL_ICON_STROKE} />
                  <span>
                    {formatDateRange(event.startDate, event.endDate, {
                      locale: 'en-GB',
                      formatOptions: {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      },
                    })}
                    {event.startTime && ` at ${event.startTime}`}
                    {event.endTime && ` - ${event.endTime}`}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <MapPin size={15} strokeWidth={MODAL_ICON_STROKE} />
                <span>{event.location}</span>
              </div>
              {event.attire && (
                <div className="flex items-start gap-2">
                  <Shirt
                    size={15}
                    strokeWidth={MODAL_ICON_STROKE}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span>{event.attire}</span>
                </div>
              )}
            </div>
          </div>

          {/* Note about guests - backend doesn't support guest count yet */}
          {event.allowGuests && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info
                  size={16}
                  strokeWidth={MODAL_ICON_STROKE}
                  className="mt-0.5 text-yellow-600"
                />
                <p className="text-xs text-yellow-700">
                  This event allows guests. You can bring guests with you.
                </p>
              </div>
            </div>
          )}

          {shouldUseSurvey && isLoadingSurveyForms ? (
            <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <LoaderCircle
                  size={16}
                  strokeWidth={MODAL_ICON_STROKE}
                  className="animate-spin text-primary-500"
                />
                Loading registration questions...
              </span>
            </div>
          ) : null}

          {shouldBlockForSurveyLoadFailure || isSurveyMarkedButUnavailable ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              We could not load the event registration questions right now. Please try again.
            </div>
          ) : null}

          {registrationForms.length > 0 ? (
            <div className="space-y-4">
              {registrationForms.map((form) => {
                const questions = form.questions.slice().sort((a, b) => a.order - b.order);

                return (
                  <div
                    key={form.id}
                    className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-white p-2 text-primary-500 shadow-sm">
                        <FileText size={20} strokeWidth={MODAL_ICON_STROKE} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{form.name}</p>
                        <p className="text-xs text-gray-500">
                          Please answer the following questions before confirming your registration.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <EventRegistrationQuestionField
                          key={question.id}
                          question={question}
                          index={index}
                          value={formAnswers[question.id]}
                          error={questionErrors[question.id]}
                          onValueChange={(value) => updateAnswer(question.id, value)}
                          onCheckboxToggle={(option) => toggleCheckboxAnswer(question.id, option)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <TextareaInput
            label={registrationForms.length > 0 ? 'Extra Note' : 'Additional Info (Optional)'}
            id="additionalInfo"
            rows={5}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            hint={
              registrationForms.length > 0
                ? 'Optional extra note to go along with your saved form responses.'
                : undefined
            }
          />

          {/* <TextareaInput
                    label="Additional Info"
                    id="residentialAddress"
                    rows={5}
                    placeholder=""
                    // error={detailForm.formState.errors.residentialAddress?.message}
                    // {...detailForm.register('residentialAddress')}
                  /> */}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isLoading ||
              isLoadingProfile ||
              (shouldUseSurvey && isLoadingSurveyForms) ||
              validateSurveyRegistration.isPending ||
              submitSurveyRegistration.isPending ||
              shouldBlockForSurveyLoadFailure ||
              isSurveyMarkedButUnavailable
            }
            className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ||
            validateSurveyRegistration.isPending ||
            submitSurveyRegistration.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderCircle size={16} strokeWidth={MODAL_ICON_STROKE} className="animate-spin" />
                {isLoading
                  ? 'Registering...'
                  : validateSurveyRegistration.isPending
                    ? 'Validating responses...'
                    : 'Saving responses...'}
              </span>
            ) : (
              'Confirm Registration'
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}

// Legacy export for backward compatibility
export interface RegisterEventModalEvent {
  slug: string;
  title: string;
}

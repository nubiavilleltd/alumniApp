// features/events/components/RegisterEventModal.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { useEventRegistration } from '../hooks/useEventRegistration';
import type { Event } from '../types/event.types';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { EventRegistrationQuestionField } from './EventRegistrationQuestionField';
import {
  getEventRegistrationForms,
  getEventRegistrationResponse,
  saveEventRegistrationResponse,
  serializeRegistrationAnswersForAdditionalInfo,
} from '../lib/eventRegistrationFormStorage';
import type {
  EventRegistrationAnswerValue,
  StoredEventRegistrationAnswer,
} from '../types/eventRegistrationForm.types';

interface RegisterEventModalProps {
  event: Event | null;
  onClose: () => void;
}

export function RegisterEventModal({ event, onClose }: RegisterEventModalProps) {
  // const currentUser = useAuthStore((state) => state.user);
  const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUser();
  const { register, isLoading } = useEventRegistration(event?.id || '');

  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe'>('going');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [formAnswers, setFormAnswers] = useState<Record<string, EventRegistrationAnswerValue>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrationForms = useMemo(
    () => (event?.id ? getEventRegistrationForms(event.id) : []),
    [event?.id],
  );

  const formQuestions = useMemo(
    () =>
      registrationForms.flatMap((form) =>
        form.questions
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((question) => ({
            ...question,
            formName: form.name,
            formVersion: form.version,
          })),
      ),
    [registrationForms],
  );

  useEffect(() => {
    if (!event || !currentUser?.id) {
      setFormAnswers({});
      setQuestionErrors({});
      setAdditionalInfo('');
      return;
    }

    const savedResponse = getEventRegistrationResponse(event.id, currentUser.id);
    const nextAnswers = formQuestions.reduce<Record<string, EventRegistrationAnswerValue>>(
      (answers, question) => {
        const savedAnswer = savedResponse?.answers.find(
          (answer) => answer.questionId === question.id,
        );
        answers[question.id] = savedAnswer?.value ?? (question.type === 'checkbox' ? [] : '');
        return answers;
      },
      {},
    );

    setFormAnswers(nextAnswers);
    setQuestionErrors({});
    setAdditionalInfo(savedResponse?.additionalInfo ?? '');
  }, [currentUser?.id, event, formQuestions]);

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
    setFormAnswers((current) => {
      const currentValues = Array.isArray(current[questionId]) ? current[questionId] : [];
      const nextValues = currentValues.includes(option)
        ? currentValues.filter((value) => value !== option)
        : [...currentValues, option];

      return {
        ...current,
        [questionId]: nextValues,
      };
    });
    setQuestionErrors((current) => {
      if (!current[questionId]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[questionId];
      return nextErrors;
    });
  };

  const buildStructuredAnswers = (): StoredEventRegistrationAnswer[] => {
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

  const validateStructuredAnswers = (answers: StoredEventRegistrationAnswer[]) => {
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

    if (!currentUser || !event) {
      setError('You must be logged in to register for events');
      return;
    }

    try {
      const structuredAnswers = buildStructuredAnswers();

      if (registrationForms.length > 0 && !validateStructuredAnswers(structuredAnswers)) {
        setError('Please complete the required registration questions.');
        return;
      }

      const apiAdditionalInfo =
        registrationForms.length > 0
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

      if (registrationForms.length > 0) {
        saveEventRegistrationResponse({
          eventId: event.id,
          eventTitle: event.title,
          forms: registrationForms,
          user: {
            id: currentUser.id,
            fullName: currentUser.fullName,
            email: currentUser.email,
          },
          rsvpStatus,
          additionalInfo,
          answers: structuredAnswers,
        });
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
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
      setRsvpStatus('going');
      setAdditionalInfo('');
      setFormAnswers({});
      setQuestionErrors({});
    }, 300);
  };

  if (!event) return null;

  return (
    <Modal isOpen={!!event} onClose={handleClose} title="Confirm Registration">
      {submitted ? (
        <div className="text-center py-8">
          <Icon icon="mdi:check-circle" className="w-14 h-14 text-primary-500 mx-auto mb-4" />
          <h3 className="text-gray-900 font-bold text-lg mb-2">Registration Successful!</h3>
          <p className="text-gray-500 text-sm mb-6">
            You have successfully registered for{' '}
            <span className="font-semibold">{event.title}</span>.
          </p>

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

          {/* User Info (Read-only) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Your Information
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-700">{currentUser?.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-700">{currentUser?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Class:</span>
                <span className="font-medium text-gray-700">{currentUser?.graduationYear}</span>
              </div>
            </div>
          </div>

          {/* Event Details Summary */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Event Details
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Icon icon="mdi:calendar-outline" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {event.startTime && ` at ${event.startTime}`}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Icon icon="mdi:map-marker-outline" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
              {event.attire && (
                <div className="flex items-start gap-2">
                  <Icon icon="mdi:hanger" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{event.attire}</span>
                </div>
              )}
            </div>
          </div>

          {/* RSVP Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Will you attend?</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                {/* <input
                  type="radio"
                  name="rsvpStatus"
                  value="going"
                  defaultChecked
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                /> */}
                <input
                  type="radio"
                  name="rsvpStatus"
                  value="going"
                  checked={rsvpStatus === 'going'}
                  onChange={() => setRsvpStatus('going')}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                />
                <div>
                  <span className="font-medium text-gray-700">Yes, I'm going</span>
                  <p className="text-xs text-gray-500">I'll be there</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                {/* <input
                  type="radio"
                  name="rsvpStatus"
                  value="maybe"
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                /> */}

                <input
                  type="radio"
                  name="rsvpStatus"
                  value="maybe"
                  checked={rsvpStatus === 'maybe'}
                  onChange={() => setRsvpStatus('maybe')}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                />
                <div>
                  <span className="font-medium text-gray-700">Maybe</span>
                  <p className="text-xs text-gray-500">I'm not sure yet</p>
                </div>
              </label>
            </div>
          </div>

          {/* Note about guests - backend doesn't support guest count yet */}
          {event.allowGuests && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Icon icon="mdi:information-outline" className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  This event allows guests. You can bring guests with you.
                </p>
              </div>
            </div>
          )}

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
                        <Icon icon="mdi:clipboard-text-outline" className="h-5 w-5" />
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
            label={registrationForms.length > 0 ? 'Extra Note' : 'Additional Info'}
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
            disabled={isLoading || isLoadingProfile}
            className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                Registering...
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

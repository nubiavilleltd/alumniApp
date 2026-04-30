import { useEffect, useState, type DragEvent } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/shared/components/ui/Button';
import { EventRegistrationQuestionField } from './EventRegistrationQuestionField';
import type {
  EventQuestionType,
  EventRegistrationFormDraft,
  EventRegistrationQuestionDraft,
} from '../types/eventRegistrationForm.types';

export type {
  EventQuestionType,
  EventRegistrationFormDraft,
  EventRegistrationQuestionDraft,
} from '../types/eventRegistrationForm.types';

type DropPosition = 'before' | 'after';

interface EventRegistrationFormBuilderModalProps {
  isOpen: boolean;
  value: EventRegistrationFormDraft | null;
  onClose: () => void;
  onSave: (draft: EventRegistrationFormDraft) => void;
}

const questionTypeOptions: Array<{
  value: EventQuestionType;
  label: string;
  icon: string;
}> = [
  { value: 'short_answer', label: 'Short answer', icon: 'mdi:format-text' },
  { value: 'long_answer', label: 'Long Answer', icon: 'mdi:text-box-outline' },
  { value: 'multiple_choice', label: 'Multiple choice', icon: 'mdi:radiobox-marked' },
  { value: 'checkbox', label: 'Check box', icon: 'mdi:checkbox-marked-outline' },
  { value: 'dropdown', label: 'Drop down', icon: 'mdi:menu-down' },
];

function createQuestionId() {
  return `question-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDefaultPlaceholder(type: EventQuestionType) {
  switch (type) {
    case 'long_answer':
      return 'Enter a longer response';
    case 'multiple_choice':
    case 'checkbox':
    case 'dropdown':
      return 'Add your answer choices below';
    case 'short_answer':
    default:
      return 'Enter your answer';
  }
}

function createDefaultOptions(type: EventQuestionType) {
  if (type === 'multiple_choice' || type === 'checkbox' || type === 'dropdown') {
    return ['Option 1', 'Option 2'];
  }

  return [];
}

function isChoiceQuestion(type: EventQuestionType) {
  return type === 'multiple_choice' || type === 'checkbox' || type === 'dropdown';
}

function createEmptyQuestion(): EventRegistrationQuestionDraft {
  return {
    id: createQuestionId(),
    label: '',
    type: 'short_answer',
    placeholder: getDefaultPlaceholder('short_answer'),
    required: false,
    options: [],
  };
}

function createInitialDraft(): EventRegistrationFormDraft {
  return {
    name: '',
    questions: [createEmptyQuestion()],
  };
}

function normalizeQuestion(
  question: Partial<EventRegistrationQuestionDraft>,
): EventRegistrationQuestionDraft {
  const type = question.type ?? 'short_answer';

  return {
    id: question.id ?? createQuestionId(),
    label: question.label ?? '',
    type,
    placeholder: question.placeholder ?? getDefaultPlaceholder(type),
    required: Boolean(question.required),
    options: Array.isArray(question.options) ? question.options : createDefaultOptions(type),
  };
}

function reorderQuestions(
  questions: EventRegistrationQuestionDraft[],
  draggedQuestionId: string,
  targetQuestionId: string,
  position: DropPosition,
) {
  if (draggedQuestionId === targetQuestionId) {
    return questions;
  }

  const draggedQuestion = questions.find((question) => question.id === draggedQuestionId);
  if (!draggedQuestion) {
    return questions;
  }

  const remainingQuestions = questions.filter((question) => question.id !== draggedQuestionId);
  const targetIndex = remainingQuestions.findIndex((question) => question.id === targetQuestionId);

  if (targetIndex === -1) {
    return questions;
  }

  const insertionIndex = position === 'before' ? targetIndex : targetIndex + 1;
  const nextQuestions = [...remainingQuestions];
  nextQuestions.splice(insertionIndex, 0, draggedQuestion);

  return nextQuestions;
}

export function EventRegistrationFormBuilderModal({
  isOpen,
  value,
  onClose,
  onSave,
}: EventRegistrationFormBuilderModalProps) {
  const [draft, setDraft] = useState<EventRegistrationFormDraft>(createInitialDraft);
  const [formError, setFormError] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    questionId: string;
    position: DropPosition;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setDraft(
      value
        ? {
            name: value.name,
            questions:
              value.questions.length > 0
                ? value.questions.map((question) => normalizeQuestion(question))
                : [createEmptyQuestion()],
          }
        : createInitialDraft(),
    );
    setActiveQuestionId(value?.questions[0]?.id ?? null);
    setDraggedQuestionId(null);
    setDropIndicator(null);
    setFormError('');
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateQuestion = (questionId: string, updates: Partial<EventRegistrationQuestionDraft>) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId ? { ...question, ...updates } : question,
      ),
    }));
    setFormError('');
  };

  const addQuestion = () => {
    const nextQuestion = createEmptyQuestion();

    setDraft((current) => ({
      ...current,
      questions: [...current.questions, nextQuestion],
    }));
    setActiveQuestionId(nextQuestion.id);
    setDraggedQuestionId(null);
    setDropIndicator(null);
    setFormError('');
  };

  const removeQuestion = (questionId: string) => {
    setDraft((current) => {
      if (current.questions.length === 1) return current;

      const remainingQuestions = current.questions.filter((question) => question.id !== questionId);
      if (activeQuestionId === questionId) {
        setActiveQuestionId(remainingQuestions[0]?.id ?? null);
      }

      return {
        ...current,
        questions: remainingQuestions,
      };
    });
    setFormError('');
  };

  const getDropPosition = (
    event: DragEvent<HTMLDivElement>,
    questionId: string,
  ): DropPosition | null => {
    if (!draggedQuestionId || draggedQuestionId === questionId) {
      return null;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const midpoint = bounds.top + bounds.height / 2;

    return event.clientY < midpoint ? 'before' : 'after';
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, questionId: string) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', questionId);
    setDraggedQuestionId(questionId);
    setDropIndicator(null);
  };

  const handleDragEnd = () => {
    setDraggedQuestionId(null);
    setDropIndicator(null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, questionId: string) => {
    const position = getDropPosition(event, questionId);
    if (!position) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    setDropIndicator((current) => {
      if (current?.questionId === questionId && current.position === position) {
        return current;
      }

      return { questionId, position };
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, questionId: string) => {
    event.preventDefault();

    const position = getDropPosition(event, questionId);
    if (!draggedQuestionId || !position) {
      setDropIndicator(null);
      return;
    }

    setDraft((current) => ({
      ...current,
      questions: reorderQuestions(current.questions, draggedQuestionId, questionId, position),
    }));
    setDraggedQuestionId(null);
    setDropIndicator(null);
    setFormError('');
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>, questionId: string) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setDropIndicator((current) => (current?.questionId === questionId ? null : current));
  };

  const addOption = (questionId: string) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: [...question.options, `Option ${question.options.length + 1}`],
        };
      }),
    }));
    setFormError('');
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: question.options.map((option, index) =>
            index === optionIndex ? value : option,
          ),
        };
      }),
    }));
    setFormError('');
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        if (question.options.length <= 2) return question;

        return {
          ...question,
          options: question.options.filter((_, index) => index !== optionIndex),
        };
      }),
    }));
    setFormError('');
  };

  const handleSave = () => {
    if (!draft.name.trim()) {
      setFormError('Give this form a name before adding it to the event.');
      return;
    }

    const emptyQuestion = draft.questions.find((question) => !question.label.trim());
    if (emptyQuestion) {
      setFormError('Each question needs a label.');
      return;
    }

    const invalidChoiceQuestion = draft.questions.find((question) => {
      if (!isChoiceQuestion(question.type)) return false;

      const usableOptions = question.options.map((option) => option.trim()).filter(Boolean);
      return usableOptions.length < 2;
    });

    if (invalidChoiceQuestion) {
      setFormError('Multiple choice, check box, and drop down questions need at least 2 options.');
      return;
    }

    onSave({
      name: draft.name.trim(),
      questions: draft.questions.map((question) => ({
        ...question,
        label: question.label.trim(),
        placeholder: question.placeholder.trim() || getDefaultPlaceholder(question.type),
        options: question.options.map((option) => option.trim()).filter(Boolean),
      })),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[110] overflow-y-auto bg-black/45 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-5xl rounded-[2rem] bg-white px-4 py-5 shadow-[0_32px_80px_rgba(7,17,22,0.22)] sm:px-6 sm:py-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-primary-50"
            aria-label="Close registration form builder"
          >
            <Icon icon="mdi:close" className="h-8 w-8" />
          </button>
        </div>

        <div className="mt-1 rounded-[1.25rem] bg-[#f5f5f5] px-5 py-5">
          <input
            type="text"
            value={draft.name}
            onChange={(event) => {
              setDraft((current) => ({ ...current, name: event.target.value }));
              setFormError('');
            }}
            placeholder="Name of Form"
            className="w-full border-0 bg-transparent text-2xl font-medium tracking-tight text-gray-500 outline-none placeholder:text-gray-500 sm:text-4xl"
          />
        </div>

        <div className="mt-6 space-y-4">
          {draft.questions.map((question, index) => {
            const selectedType =
              questionTypeOptions.find((option) => option.value === question.type) ??
              questionTypeOptions[0];
            const isEditing =
              activeQuestionId === null ? index === 0 : activeQuestionId === question.id;
            const isDragging = draggedQuestionId === question.id;
            const showDropBefore =
              dropIndicator?.questionId === question.id && dropIndicator.position === 'before';
            const showDropAfter =
              dropIndicator?.questionId === question.id && dropIndicator.position === 'after';

            return (
              <div
                key={question.id}
                onDragOver={(event) => handleDragOver(event, question.id)}
                onDragLeave={(event) => handleDragLeave(event, question.id)}
                onDrop={(event) => handleDrop(event, question.id)}
                className={`relative rounded-[1.5rem] transition-all ${
                  showDropBefore
                    ? 'before:absolute before:-top-2 before:left-5 before:right-5 before:h-1 before:rounded-full before:bg-primary-500 before:content-[""]'
                    : ''
                } ${
                  showDropAfter
                    ? 'after:absolute after:-bottom-2 after:left-5 after:right-5 after:h-1 after:rounded-full after:bg-primary-500 after:content-[""]'
                    : ''
                }`}
              >
                {!isEditing ? (
                  <div
                    onClick={() => setActiveQuestionId(question.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveQuestionId(question.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`relative block w-full overflow-hidden rounded-[1.4rem] border border-sky-200 bg-white px-4 py-4 text-left shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50/30 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:px-6 ${
                      isDragging ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 w-3 bg-primary-200" />

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">
                            Preview
                          </p>
                          <p className="mt-1 text-sm text-gray-400">
                            This is how the attendee will see this question.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center">
                          <button
                            type="button"
                            draggable
                            onDragStart={(event) => handleDragStart(event, question.id)}
                            onDragEnd={handleDragEnd}
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex cursor-grab items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-500 active:cursor-grabbing"
                            aria-label={`Drag question ${index + 1}`}
                          >
                            <Icon icon="mdi:drag" className="h-4 w-4" />
                            Move
                          </button>
                          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 text-sm font-semibold text-primary-500">
                            <Icon icon="mdi:pencil-outline" className="h-4 w-4" />
                            Edit
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-400">
                          Question {index + 1}
                        </p>
                      </div>

                      <EventRegistrationQuestionField
                        question={question}
                        index={index}
                        mode="preview"
                      />

                      <p className="text-sm text-gray-400">
                        {selectedType.label}
                        {question.required ? ' • Required' : ' • Optional'}
                        {isChoiceQuestion(question.type)
                          ? ` • ${question.options.filter((option) => option.trim()).length} options`
                          : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative overflow-hidden rounded-[1.5rem] border border-sky-200 bg-white px-4 py-4 shadow-sm transition-opacity sm:px-6 sm:py-5 ${
                      isDragging ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 w-3 bg-primary-500" />

                    <div className="flex justify-center pb-2 text-gray-300">
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => handleDragStart(event, question.id)}
                        onDragEnd={handleDragEnd}
                        className="inline-flex cursor-grab items-center justify-center rounded-full p-1 transition-colors hover:bg-primary-50 active:cursor-grabbing"
                        aria-label={`Drag question ${index + 1}`}
                      >
                        <Icon icon="mdi:dots-grid" className="h-7 w-7" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-start">
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="rounded-[1rem] bg-[#f5f5f5] px-4 py-3 shadow-[inset_0_-3px_0_0_#9333ea]">
                          <input
                            type="text"
                            value={question.label}
                            onChange={(event) =>
                              updateQuestion(question.id, { label: event.target.value })
                            }
                            placeholder={`Question ${index + 1}`}
                            className="w-full border-0 bg-transparent text-xl font-medium text-gray-500 outline-none placeholder:text-gray-500"
                          />
                        </div>

                        <div className="rounded-[1rem] bg-[#f8f7f4] px-4 py-3">
                          {question.type === 'long_answer' ? (
                            <textarea
                              rows={2}
                              value={question.placeholder}
                              onChange={(event) =>
                                updateQuestion(question.id, { placeholder: event.target.value })
                              }
                              placeholder="Enter a longer response"
                              className="w-full resize-none border-0 bg-transparent text-base text-gray-400 outline-none placeholder:text-gray-400"
                            />
                          ) : question.type === 'short_answer' ? (
                            <input
                              type="text"
                              value={question.placeholder}
                              onChange={(event) =>
                                updateQuestion(question.id, { placeholder: event.target.value })
                              }
                              placeholder="Enter your answer"
                              className="w-full border-0 bg-transparent text-base text-gray-400 outline-none placeholder:text-gray-400"
                            />
                          ) : (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={`${question.id}-option-${optionIndex}`}
                                  className="flex items-center gap-3"
                                >
                                  <span className="flex h-5 w-5 items-center justify-center text-gray-400">
                                    <Icon
                                      icon={
                                        question.type === 'multiple_choice'
                                          ? 'mdi:radiobox-blank'
                                          : question.type === 'checkbox'
                                            ? 'mdi:checkbox-blank-outline'
                                            : 'mdi:menu-down'
                                      }
                                      className="h-5 w-5"
                                    />
                                  </span>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(event) =>
                                      updateOption(question.id, optionIndex, event.target.value)
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1 border-0 bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeOption(question.id, optionIndex)}
                                    disabled={question.options.length <= 2}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
                                    aria-label={`Remove option ${optionIndex + 1}`}
                                  >
                                    <Icon icon="mdi:close" className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => addOption(question.id)}
                                className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-100"
                              >
                                <Icon icon="mdi:plus" className="h-4 w-4" />
                                Add option
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <label className="w-full rounded-[1rem] border border-sky-200 bg-white px-4 py-3 md:w-[18rem] md:flex-none">
                        <span className="sr-only">Question type</span>
                        <div className="flex items-center gap-3">
                          <Icon icon={selectedType.icon} className="h-6 w-6 text-gray-500" />
                          <select
                            value={question.type}
                            onChange={(event) => {
                              const nextType = event.target.value as EventQuestionType;
                              updateQuestion(question.id, {
                                type: nextType,
                                placeholder: getDefaultPlaceholder(nextType),
                                options: isChoiceQuestion(nextType)
                                  ? question.options.length > 0
                                    ? question.options
                                    : createDefaultOptions(nextType)
                                  : [],
                              });
                            }}
                            className="w-full appearance-none border-0 bg-transparent text-lg font-semibold text-gray-500 outline-none"
                          >
                            {questionTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <Icon icon="mdi:chevron-down" className="h-6 w-6 text-gray-400" />
                        </div>
                      </label>
                    </div>

                    <div className="mt-5 border-t border-gray-200 pt-4">
                      <div className="flex flex-wrap items-center justify-end gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuestion(question.id, { required: !question.required })
                          }
                          role="switch"
                          aria-checked={question.required}
                          className="inline-flex items-center gap-3"
                        >
                          <span
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                              question.required ? 'bg-primary-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                                question.required ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </span>
                          <span className="text-lg font-semibold text-gray-500">Required</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          disabled={draft.questions.length === 1}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`Delete question ${index + 1}`}
                        >
                          <Icon icon="mdi:delete-outline" className="h-8 w-8" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-5 py-2.5 text-lg font-semibold text-primary-500 transition-colors hover:bg-primary-50"
          >
            <Icon icon="mdi:plus" className="h-6 w-6" />
            Add new question
          </button>
        </div>

        {formError ? (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center">
          <Button type="button" size="lg" className="min-w-[16rem]" onClick={handleSave}>
            Add to Event
          </Button>
        </div>
      </div>
    </div>
  );
}

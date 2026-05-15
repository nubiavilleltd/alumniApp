import { useEffect, useState, type DragEvent } from 'react';
import {
  ChevronDown,
  Circle,
  CircleChevronDown,
  Grip,
  GripVertical,
  Pencil,
  Plus,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import { EventRegistrationQuestionField } from './EventRegistrationQuestionField';
import { renderIcon, type AppIcon } from '@/shared/utils/renderIcon';
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

type FormValidationErrors = {
  name?: string;
  questions?: Record<
    string,
    {
      label?: string;
      options?: Record<number, string>;
    }
  >;
  form?: string;
};

interface EventRegistrationFormBuilderModalProps {
  isOpen: boolean;
  value: EventRegistrationFormDraft | null;
  onClose: () => void;
  onSave: (draft: EventRegistrationFormDraft) => void;
}

const questionTypeOptions: Array<{
  value: EventQuestionType;
  label: string;
  icon: AppIcon;
  description?: string;
}> = [
  {
    value: 'short_answer',
    label: 'Short answer',
    icon: <img src="/short_answer.svg" alt="" aria-hidden="true" />,
  },
  {
    value: 'long_answer',
    label: 'Long answer',
    icon: <img src="/long_answer.svg" alt="" aria-hidden="true" />,
  },
  {
    value: 'multiple_choice',
    label: 'Multiple Choice',
    description: '(single selections)',
    icon: <img src="/MultipleSelection.svg" alt="" aria-hidden="true" />,
  },
  {
    value: 'checkbox',
    label: 'Checkboxes',
    description: '(multiple selections)',
    icon: <img src="/checkbox.svg" alt="" aria-hidden="true" />,
  },
  {
    value: 'dropdown',
    label: 'Dropdown',
    icon: <CircleChevronDown />,
  },
];

function renderChoicePreviewIcon(type: EventQuestionType) {
  if (type === 'multiple_choice') {
    return <Circle className="h-5 w-5" strokeWidth={2.2} />;
  }

  if (type === 'checkbox') {
    return <Square className="h-5 w-5" strokeWidth={2.2} />;
  }

  return <ChevronDown className="h-5 w-5" strokeWidth={2.2} />;
}

function createQuestionId() {
  return `question-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDefaultPlaceholder(type: EventQuestionType) {
  switch (type) {
    case 'long_answer':
      return 'Enter response';
    case 'multiple_choice':
    case 'checkbox':
    case 'dropdown':
      return 'Add your answer choices below';
    case 'short_answer':
    default:
      return 'Add response';
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

function isDefaultOptionLabel(option: string, optionIndex: number) {
  return option === `Option ${optionIndex + 1}`;
}

function normalizeQuestionOptions(type: EventQuestionType, options: unknown) {
  if (!isChoiceQuestion(type)) {
    return [];
  }

  const normalizedOptions = Array.isArray(options)
    ? options.map((option) => String(option)).filter((option) => option.length > 0)
    : [];

  return normalizedOptions.length > 0 ? normalizedOptions : createDefaultOptions(type);
}

function normalizeMaxSelections(
  rawValue: unknown,
  type: EventQuestionType,
  optionCount: number,
): number | null {
  if (type !== 'checkbox') {
    return null;
  }

  const parsedValue = Number(rawValue);
  if (!Number.isFinite(parsedValue) || parsedValue < 1 || optionCount < 1) {
    return null;
  }

  return Math.min(Math.floor(parsedValue), optionCount);
}

function createEmptyQuestion(): EventRegistrationQuestionDraft {
  return {
    id: createQuestionId(),
    label: '',
    type: 'short_answer',
    placeholder: getDefaultPlaceholder('short_answer'),
    required: false,
    options: [],
    maxSelections: null,
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
  const options = normalizeQuestionOptions(type, question.options);

  return {
    id: question.id ?? createQuestionId(),
    label: question.label ?? '',
    type,
    placeholder: question.placeholder ?? getDefaultPlaceholder(type),
    required: Boolean(question.required),
    options,
    maxSelections: normalizeMaxSelections(question.maxSelections, type, options.length),
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
  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({});
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [openQuestionTypeMenuId, setOpenQuestionTypeMenuId] = useState<string | null>(null);
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    questionId: string;
    position: DropPosition;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const nextDraft: EventRegistrationFormDraft = value
      ? {
          name: value.name,
          questions:
            value.questions.length > 0
              ? value.questions.map((question) => normalizeQuestion(question))
              : [createEmptyQuestion()],
        }
      : createInitialDraft();

    setDraft(nextDraft);
    setActiveQuestionId(nextDraft.questions[0]?.id ?? null);
    setOpenQuestionTypeMenuId(null);
    setDraggedQuestionId(null);
    setDropIndicator(null);
    setValidationErrors({});
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!openQuestionTypeMenuId) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        setOpenQuestionTypeMenuId(null);
        return;
      }

      if (event.target.closest('[data-question-type-menu]')) {
        return;
      }

      setOpenQuestionTypeMenuId(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [openQuestionTypeMenuId]);

  if (!isOpen) return null;

  const clearNameError = () => {
    setValidationErrors((current) => ({
      ...current,
      name: undefined,
    }));
  };

  const clearQuestionLabelError = (questionId: string) => {
    setValidationErrors((current) => {
      const nextQuestions = { ...current.questions };

      if (nextQuestions[questionId]) {
        nextQuestions[questionId] = {
          ...nextQuestions[questionId],
          label: undefined,
        };
      }

      return {
        ...current,
        questions: nextQuestions,
      };
    });
  };

  const clearOptionError = (questionId: string, optionIndex: number) => {
    setValidationErrors((current) => {
      const nextQuestions = { ...current.questions };
      const currentQuestionErrors = nextQuestions[questionId];

      if (currentQuestionErrors?.options) {
        const nextOptions = { ...currentQuestionErrors.options };
        delete nextOptions[optionIndex];

        nextQuestions[questionId] = {
          ...currentQuestionErrors,
          options: nextOptions,
        };
      }

      return {
        ...current,
        form: undefined,
        questions: nextQuestions,
      };
    });
  };

  const clearFormLevelError = () => {
    setValidationErrors((current) => ({
      ...current,
      form: undefined,
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<EventRegistrationQuestionDraft>) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId ? { ...question, ...updates } : question,
      ),
    }));

    if ('label' in updates) {
      clearQuestionLabelError(questionId);
    }
  };

  const addQuestion = () => {
    const nextQuestion = createEmptyQuestion();

    setDraft((current) => ({
      ...current,
      questions: [...current.questions, nextQuestion],
    }));
    setActiveQuestionId(nextQuestion.id);
    setOpenQuestionTypeMenuId(null);
    setDraggedQuestionId(null);
    setDropIndicator(null);
    clearFormLevelError();
  };

  const removeQuestion = (questionId: string) => {
    setDraft((current) => {
      if (current.questions.length === 1) return current;

      const remainingQuestions = current.questions.filter((question) => question.id !== questionId);
      if (activeQuestionId === questionId) {
        setActiveQuestionId(remainingQuestions[0]?.id ?? null);
      }
      if (openQuestionTypeMenuId === questionId) {
        setOpenQuestionTypeMenuId(null);
      }

      return {
        ...current,
        questions: remainingQuestions,
      };
    });

    setValidationErrors((current) => {
      const nextQuestions = { ...current.questions };
      delete nextQuestions[questionId];

      return {
        ...current,
        form: undefined,
        questions: nextQuestions,
      };
    });
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

        const nextOptionCount = question.options.length + 1;
        return {
          ...question,
          options: [...question.options, `Option ${question.options.length + 1}`],
          maxSelections: normalizeMaxSelections(
            question.maxSelections,
            question.type,
            nextOptionCount,
          ),
        };
      }),
    }));
    clearFormLevelError();
  };

  const addOtherOption = (questionId: string) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId || question.type !== 'multiple_choice') {
          return question;
        }

        const hasOtherOption = question.options.some(
          (option) => option.trim().toLowerCase() === 'other',
        );

        if (hasOtherOption) {
          return question;
        }

        return {
          ...question,
          options: [...question.options, 'Other'],
        };
      }),
    }));
    clearFormLevelError();
  };

  const clearDefaultOptionOnFocus = (questionId: string, optionIndex: number) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        const option = question.options[optionIndex];

        if (!isDefaultOptionLabel(option, optionIndex)) {
          return question;
        }

        return {
          ...question,
          options: question.options.map((currentOption, index) =>
            index === optionIndex ? '' : currentOption,
          ),
        };
      }),
    }));
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
    clearOptionError(questionId, optionIndex);
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        const nextOptions = question.options.filter((_, index) => index !== optionIndex);
        if (question.options.length <= 2) return question;

        return {
          ...question,
          options: nextOptions,
          maxSelections: normalizeMaxSelections(
            question.maxSelections,
            question.type,
            nextOptions.length,
          ),
        };
      }),
    }));
    clearFormLevelError();
  };

  const updateQuestionType = (questionId: string, nextType: EventQuestionType) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const nextOptions = normalizeQuestionOptions(nextType, question.options);
        return {
          ...question,
          type: nextType,
          placeholder: getDefaultPlaceholder(nextType),
          options: nextOptions,
          maxSelections: normalizeMaxSelections(
            question.maxSelections,
            nextType,
            nextOptions.length,
          ),
        };
      }),
    }));
    setOpenQuestionTypeMenuId(null);
    clearFormLevelError();
  };

  const updateMaxSelections = (questionId: string, rawValue: string) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        return {
          ...question,
          maxSelections: normalizeMaxSelections(rawValue, question.type, question.options.length),
        };
      }),
    }));
  };

  const validateDraft = (currentDraft: EventRegistrationFormDraft): FormValidationErrors => {
    const nextErrors: FormValidationErrors = {};
    const questionErrors: NonNullable<FormValidationErrors['questions']> = {};
    const formMessages: string[] = [];

    if (!currentDraft.name.trim()) {
      nextErrors.name = 'Enter a section name.';
    }

    if (currentDraft.questions.length === 0) {
      formMessages.push('Add at least one question.');
    }

    currentDraft.questions.forEach((question) => {
      const currentQuestionErrors: {
        label?: string;
        options?: Record<number, string>;
      } = {};

      if (!question.label.trim()) {
        currentQuestionErrors.label = 'Enter a question.';
      }

      if (isChoiceQuestion(question.type)) {
        const optionErrors: Record<number, string> = {};
        const trimmedOptions = question.options.map((option) => option.trim());

        trimmedOptions.forEach((option, optionIndex) => {
          if (!option) {
            optionErrors[optionIndex] = 'Option cannot be empty.';
          }
        });

        const usableOptions = trimmedOptions.filter(Boolean);

        if (usableOptions.length < 2) {
          formMessages.push(
            `Question "${question.label.trim() || 'Untitled question'}" needs at least 2 filled options.`,
          );
        }

        if (Object.keys(optionErrors).length > 0) {
          currentQuestionErrors.options = optionErrors;
        }
      }

      if (currentQuestionErrors.label || currentQuestionErrors.options) {
        questionErrors[question.id] = currentQuestionErrors;
      }
    });

    if (Object.keys(questionErrors).length > 0) {
      nextErrors.questions = questionErrors;
    }

    if (formMessages.length > 0) {
      nextErrors.form = formMessages.join(' ');
    }

    return nextErrors;
  };

  const hasValidationErrors = (errors: FormValidationErrors) => {
    return Boolean(
      errors.name || errors.form || (errors.questions && Object.keys(errors.questions).length > 0),
    );
  };

  const handleSave = () => {
    const errors = validateDraft(draft);
    setValidationErrors(errors);

    if (hasValidationErrors(errors)) {
      const firstInvalidQuestion = draft.questions.find((question) => {
        const questionError = errors.questions?.[question.id];
        return questionError?.label || questionError?.options;
      });

      if (firstInvalidQuestion) {
        setActiveQuestionId(firstInvalidQuestion.id);
      }

      return;
    }

    onSave({
      name: draft.name.trim(),
      questions: draft.questions.map((question) => {
        const trimmedOptions = question.options.map((option) => option.trim()).filter(Boolean);

        return {
          ...question,
          label: question.label.trim(),
          placeholder: question.placeholder.trim() || getDefaultPlaceholder(question.type),
          options: trimmedOptions,
          maxSelections: normalizeMaxSelections(
            question.maxSelections,
            question.type,
            trimmedOptions.length,
          ),
        };
      }),
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
            <X className="h-8 w-8" strokeWidth={2.2} />
          </button>
        </div>

        <div>
          <div
            className={`mt-1 rounded-[1.15rem] border px-4 py-3 ${
              validationErrors.name ? 'border-red-200 bg-red-50' : 'border-black/5 bg-[#f5f5f5]'
            }`}
          >
            <input
              type="text"
              value={draft.name}
              onChange={(event) => {
                setDraft((current) => ({ ...current, name: event.target.value }));
                clearNameError();
              }}
              placeholder="Section name"
              aria-invalid={Boolean(validationErrors.name)}
              className="w-full border-0 bg-transparent text-2xl font-medium tracking-tight text-gray-500 outline-none placeholder:text-gray-500 sm:text-2xl"
            />
          </div>

          {validationErrors.name ? (
            <p className="mt-2 px-2 text-sm font-medium text-red-600">{validationErrors.name}</p>
          ) : null}
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
            const isQuestionTypeMenuOpen = openQuestionTypeMenuId === question.id;
            const hasOtherOption = question.options.some(
              (option) => option.trim().toLowerCase() === 'other',
            );
            const questionValidationErrors = validationErrors.questions?.[question.id];

            return (
              <div
                key={question.id}
                onDragOver={(event) => handleDragOver(event, question.id)}
                onDragLeave={(event) => handleDragLeave(event, question.id)}
                onDrop={(event) => handleDrop(event, question.id)}
                className={`relative rounded-[1rem] transition-all ${
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
                    onClick={() => {
                      setActiveQuestionId(question.id);
                      setOpenQuestionTypeMenuId(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveQuestionId(question.id);
                        setOpenQuestionTypeMenuId(null);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`relative block w-full overflow-hidden rounded-[1.4rem] border border-sky-100 bg-white px-4 py-4 text-left shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-all hover:border-primary-200 hover:bg-primary-50/30 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:px-6 ${
                      isDragging ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.4rem] bg-primary-200" />

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
                            <Grip className="h-4 w-4" strokeWidth={2.2} />
                            Move
                          </button>
                          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 text-sm font-semibold text-primary-500">
                            <Pencil className="h-4 w-4" strokeWidth={2.2} />
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
                        {selectedType.description ? ` ${selectedType.description}` : ''}
                        {question.required ? ' • Required' : ' • Optional'}
                        {isChoiceQuestion(question.type)
                          ? ` • ${question.options.filter((option) => option.trim()).length} options`
                          : ''}
                        {question.type === 'checkbox' && question.maxSelections
                          ? ` • Limit ${question.maxSelections}`
                          : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative rounded-[1rem] border border-sky-100 bg-white px-4 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-opacity sm:px-6 sm:py-5 ${
                      isDragging ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1rem] bg-primary-500" />

                    <div className="flex justify-center pb-2 text-gray-300">
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => handleDragStart(event, question.id)}
                        onDragEnd={handleDragEnd}
                        className="inline-flex cursor-grab items-center justify-center rounded-full p-1 transition-colors hover:bg-primary-50 active:cursor-grabbing"
                        aria-label={`Drag question ${index + 1}`}
                      >
                        <GripVertical className="h-7 w-7" strokeWidth={2.2} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-start">
                      <div className="min-w-0 flex-1 space-y-4">
                        <div>
                          <div
                            className={`rounded-[0.95rem] px-4 py-3 shadow-[inset_0_-2px_0_0_#9333ea] ${
                              questionValidationErrors?.label ? 'bg-red-50' : 'bg-[#f5f5f5]'
                            }`}
                          >
                            <input
                              type="text"
                              value={question.label}
                              onChange={(event) =>
                                updateQuestion(question.id, { label: event.target.value })
                              }
                              placeholder={`Question ${index + 1}`}
                              aria-invalid={Boolean(questionValidationErrors?.label)}
                              className="w-full border-0 bg-transparent text-xl font-medium text-gray-500 outline-none placeholder:text-gray-500"
                            />
                          </div>

                          {questionValidationErrors?.label ? (
                            <p className="mt-2 px-2 text-sm font-medium text-red-600">
                              {questionValidationErrors.label}
                            </p>
                          ) : null}
                        </div>

                        <div className="rounded-[0.85rem] bg-[#f8f7f4] px-4 py-3">
                          {question.type === 'long_answer' ? (
                            <textarea
                              rows={2}
                              value={question.placeholder}
                              readOnly
                              placeholder="Enter response"
                              className="w-full resize-none border-0 bg-transparent text-base text-gray-400 outline-none placeholder:text-gray-400"
                            />
                          ) : question.type === 'short_answer' ? (
                            <input
                              type="text"
                              value={question.placeholder}
                              readOnly
                              placeholder="Enter your answer"
                              className="w-full border-0 bg-transparent text-base text-gray-400 outline-none placeholder:text-gray-400"
                            />
                          ) : (
                            <div className="space-y-3">
                              {question.options.map((option, optionIndex) => {
                                const optionValidationError =
                                  questionValidationErrors?.options?.[optionIndex];

                                return (
                                  <div
                                    key={`${question.id}-option-${optionIndex}`}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="mt-3 flex h-5 w-5 items-center justify-center text-gray-400">
                                      {renderChoicePreviewIcon(question.type)}
                                    </span>

                                    <div className="flex-1">
                                      <div
                                        className={`rounded-[0.9rem] px-4 py-3 ${
                                          optionValidationError
                                            ? 'bg-red-50 ring-1 ring-red-200'
                                            : 'bg-white/70'
                                        }`}
                                      >
                                        <input
                                          type="text"
                                          value={option}
                                          onFocus={() =>
                                            clearDefaultOptionOnFocus(question.id, optionIndex)
                                          }
                                          onChange={(event) =>
                                            updateOption(
                                              question.id,
                                              optionIndex,
                                              event.target.value,
                                            )
                                          }
                                          placeholder={`Option ${optionIndex + 1}`}
                                          aria-invalid={Boolean(optionValidationError)}
                                          className="w-full border-0 bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
                                        />
                                      </div>

                                      {optionValidationError ? (
                                        <p className="mt-1 px-2 text-sm font-medium text-red-600">
                                          {optionValidationError}
                                        </p>
                                      ) : null}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => removeOption(question.id, optionIndex)}
                                      disabled={question.options.length <= 2}
                                      className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
                                      aria-label={`Remove option ${optionIndex + 1}`}
                                    >
                                      <X className="h-4 w-4" strokeWidth={2.2} />
                                    </button>
                                  </div>
                                );
                              })}

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm font-semibold text-primary-600">
                                <button
                                  type="button"
                                  onClick={() => addOption(question.id)}
                                  className="inline-flex items-center gap-2 transition-colors hover:text-primary-700"
                                >
                                  <Plus className="h-4 w-4" strokeWidth={2.2} />
                                  Add option
                                </button>
                                {question.type === 'multiple_choice' ? (
                                  <>
                                    <span className="text-gray-400">or</span>
                                    <button
                                      type="button"
                                      onClick={() => addOtherOption(question.id)}
                                      disabled={hasOtherOption}
                                      className="inline-flex items-center gap-2 transition-colors hover:text-primary-700 disabled:cursor-not-allowed disabled:text-gray-400"
                                    >
                                      Add "Other" option
                                    </button>
                                  </>
                                ) : null}
                              </div>

                              {question.type === 'checkbox' ? (
                                <div className="rounded-[0.9rem] border border-sky-100 bg-white px-4 py-3">
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-500">
                                        Selection limit
                                      </p>
                                      <p className="mt-1 text-sm text-gray-400">
                                        Leave blank to allow any number of selections.
                                      </p>
                                    </div>
                                    <input
                                      type="number"
                                      min={1}
                                      max={question.options.length}
                                      value={question.maxSelections ?? ''}
                                      onChange={(event) =>
                                        updateMaxSelections(question.id, event.target.value)
                                      }
                                      placeholder="No limit"
                                      className="w-full rounded-[0.8rem] border border-sky-100 bg-[#f8f7f4] px-4 py-2.5 text-base text-gray-500 outline-none transition-colors focus:border-primary-300 sm:max-w-[11rem]"
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="relative w-full md:w-[17.5rem] md:flex-none"
                        data-question-type-menu
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenQuestionTypeMenuId((current) =>
                              current === question.id ? null : question.id,
                            )
                          }
                          className="flex w-full items-center gap-2.5 rounded-[0.95rem] border border-sky-100 bg-white px-3.5 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.03)] transition-colors hover:border-primary-200"
                          aria-expanded={isQuestionTypeMenuOpen}
                          aria-haspopup="listbox"
                        >
                          {renderIcon(selectedType.icon, 'h-5 w-5 shrink-0 text-gray-500')}
                          <span className="min-w-0 flex-1">
                            <span className="block text-base font-semibold leading-tight text-gray-500">
                              {selectedType.label}
                            </span>
                            {selectedType.description ? (
                              <span className="mt-0.5 block text-sm leading-tight text-gray-400">
                                {selectedType.description}
                              </span>
                            ) : null}
                          </span>
                          <ChevronDown
                            className={`h-6 w-6 shrink-0 text-gray-400 transition-transform ${
                              isQuestionTypeMenuOpen ? 'rotate-180' : ''
                            }`}
                            strokeWidth={2.2}
                          />
                        </button>

                        {isQuestionTypeMenuOpen ? (
                          <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-20 rounded-[1.2rem] border border-sky-100 bg-white p-2 shadow-[0_22px_50px_rgba(15,23,42,0.14)]">
                            {questionTypeOptions.map((option) => {
                              const isSelected = option.value === question.type;

                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => updateQuestionType(question.id, option.value)}
                                  className={`flex w-full items-start gap-2.5 rounded-[0.95rem] px-3 py-2.5 text-left transition-colors ${
                                    isSelected ? 'bg-primary-50/60' : 'hover:bg-primary-50/40'
                                  }`}
                                  role="option"
                                  aria-selected={isSelected}
                                >
                                  {renderIcon(option.icon, 'mt-0.5 h-5 w-5 shrink-0 text-gray-500')}
                                  <span className="min-w-0">
                                    <span className="block text-base font-semibold leading-tight text-gray-500">
                                      {option.label}
                                    </span>
                                    {option.description ? (
                                      <span className="mt-0.5 block text-sm leading-tight text-gray-400">
                                        {option.description}
                                      </span>
                                    ) : null}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
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
                          <Trash2 className="h-8 w-8" strokeWidth={2.2} />
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
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-1 text-md font-semibold text-primary-500 transition-colors hover:bg-primary-50"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Add new question
          </button>
        </div>

        {validationErrors.form ? (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {validationErrors.form}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center">
          <Button type="button" size="md" className="min-w-[12rem]" onClick={handleSave}>
            {value ? 'Update' : 'Add to Event'}
          </Button>
        </div>
      </div>
    </div>
  );
}

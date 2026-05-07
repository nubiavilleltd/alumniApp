import { SelectInput } from '@/shared/components/ui/SelectInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import type {
  EventQuestionType,
  EventRegistrationAnswerValue,
} from '../types/eventRegistrationForm.types';

interface RegistrationFieldQuestion {
  id: string;
  label: string;
  type: EventQuestionType;
  required: boolean;
  placeholder: string;
  options: string[];
  maxSelections: number | null;
}

interface EventRegistrationQuestionFieldProps {
  question: RegistrationFieldQuestion;
  index: number;
  value?: EventRegistrationAnswerValue;
  error?: string;
  mode?: 'interactive' | 'preview';
  onValueChange?: (value: EventRegistrationAnswerValue) => void;
  onCheckboxToggle?: (option: string) => void;
}

export function EventRegistrationQuestionField({
  question,
  index,
  value,
  error,
  mode = 'interactive',
  onValueChange,
  onCheckboxToggle,
}: EventRegistrationQuestionFieldProps) {
  const isPreview = mode === 'preview';
  const selectedCheckboxValues = Array.isArray(value) ? value : [];
  const dropdownOptions = question.options.map((option) => ({ label: option, value: option }));
  const sharedFieldClasses =
    'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary-400';

  return (
    <div className={isPreview ? 'pointer-events-none' : undefined}>
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-900">
            {index + 1}. {question.label || `Untitled question ${index + 1}`}
            {question.required ? <span className="ml-1 text-red-500">*</span> : null}
          </p>
        </div>

        {question.type === 'long_answer' ? (
          <TextareaInput
            rows={4}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onValueChange?.(event.target.value)}
            placeholder={question.placeholder || 'Enter your answer'}
            readOnly={isPreview}
            showCounter={!isPreview}
            className="gap-2"
            textareaClassName={`${sharedFieldClasses} resize-none`}
          />
        ) : question.type === 'short_answer' ? (
          <input
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onValueChange?.(event.target.value)}
            placeholder={question.placeholder || 'Enter your answer'}
            readOnly={isPreview}
            className={sharedFieldClasses}
          />
        ) : question.type === 'dropdown' ? (
          <SelectInput
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onValueChange?.(event.target.value)}
            options={dropdownOptions}
            placeholder="Select an option"
            disabled={isPreview}
            className="gap-0"
            controlClassName="rounded-2xl px-4 py-3 pr-10 text-sm shadow-none"
          />
        ) : question.type === 'multiple_choice' ? (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={() => onValueChange?.(option)}
                  className="mt-0.5 h-4 w-4 text-primary-500 focus:ring-primary-400"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {question.options.map((option) => {
              const selectionLimitReached =
                !selectedCheckboxValues.includes(option) &&
                question.maxSelections !== null &&
                selectedCheckboxValues.length >= question.maxSelections;

              return (
                <label
                  key={option}
                  className={`flex items-start gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors ${
                    selectionLimitReached && !isPreview
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedCheckboxValues.includes(option)}
                    onChange={() => onCheckboxToggle?.(option)}
                    disabled={selectionLimitReached}
                    className="mt-0.5 h-4 w-4 rounded text-primary-500 focus:ring-primary-400"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        )}

        {question.type === 'checkbox' && question.maxSelections ? (
          <p className="mt-2 text-xs font-medium text-gray-400">
            Select up to {question.maxSelections}{' '}
            {question.maxSelections === 1 ? 'option' : 'options'}.
          </p>
        ) : null}

        {error ? <p className="mt-2 text-xs font-medium text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}

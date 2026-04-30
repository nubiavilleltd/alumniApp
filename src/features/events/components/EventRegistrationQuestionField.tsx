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
          <textarea
            rows={4}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onValueChange?.(event.target.value)}
            placeholder={question.placeholder || 'Enter your answer'}
            readOnly={isPreview}
            className={`${sharedFieldClasses} resize-none`}
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
          <select
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onValueChange?.(event.target.value)}
            className={`${sharedFieldClasses} cursor-pointer`}
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
              const selectedValues = Array.isArray(value) ? value : [];

              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedValues.includes(option)}
                    onChange={() => onCheckboxToggle?.(option)}
                    className="mt-0.5 h-4 w-4 rounded text-primary-500 focus:ring-primary-400"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        )}

        {error ? <p className="mt-2 text-xs font-medium text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}

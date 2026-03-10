import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, error, hint, id, name, required, disabled, className = '', ...rest }, ref) => {
    const inputId = id ?? name;

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          disabled={disabled}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none transition-colors shadow-sm
            ${error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-400'}
            ${disabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          {...rest}
        />

        {error ? (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);

TextareaInput.displayName = 'TextareaInput';
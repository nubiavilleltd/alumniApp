import { forwardRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

export const DEFAULT_TEXTAREA_MAX_LENGTH = 750;

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  textareaClassName?: string;
  showCounter?: boolean;
  labelClassName?: string;
}

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  (
    {
      label,
      error,
      hint,
      id,
      name,
      required,
      disabled,
      className = '',
      textareaClassName = '',
      showCounter = true,
      labelClassName = '',
      maxLength = DEFAULT_TEXTAREA_MAX_LENGTH,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name;
    const [characterCount, setCharacterCount] = useState(() => {
      const initialValue = value ?? defaultValue ?? '';
      return String(initialValue).length;
    });
    const hasCounter = showCounter && typeof maxLength === 'number' && maxLength > 0;
    const isNearLimit = hasCounter && characterCount / maxLength >= 0.85;
    const isAtLimit = hasCounter && characterCount >= maxLength;

    useEffect(() => {
      if (value !== undefined) {
        setCharacterCount(String(value ?? '').length);
      }
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharacterCount(event.target.value.length);
      onChange?.(event);
    };

    return (
      <div className={`textarea-input flex flex-col gap-1 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`textarea-input__label block text-sm font-medium text-gray-700 ${labelClassName}`}
          >
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
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          className={`textarea-input__field w-full border rounded-2xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none transition-colors shadow-sm
            ${error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-400'}
            ${disabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'bg-white'}
            ${textareaClassName}
          `}
          {...rest}
        />

        {(error || hint || hasCounter) && (
          <div className="flex items-start justify-between gap-3">
            {error ? (
              <p className="textarea-input__message textarea-input__message--error flex items-center gap-1 text-xs text-red-500">
                <Icon icon="mdi:alert-circle-outline" className="h-3 w-3" />
                {error}
              </p>
            ) : hint ? (
              <p className="textarea-input__message textarea-input__message--hint text-xs text-gray-400">
                {hint}
              </p>
            ) : (
              <span />
            )}

            {hasCounter ? (
              <p
                className={`text-xs font-medium whitespace-nowrap ${
                  isAtLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : 'text-gray-400'
                }`}
              >
                {characterCount}/{maxLength}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);

TextareaInput.displayName = 'TextareaInput';

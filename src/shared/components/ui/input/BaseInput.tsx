import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingSlot?: React.ReactNode; // icon, prefix text, etc.
  trailingSlot?: React.ReactNode; // eye toggle, search button, etc.
  onValueChange?: (value: string) => void; // simple controlled usage outside RHF
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      label,
      error,
      hint,
      leadingSlot,
      trailingSlot,
      id,
      name,
      required,
      disabled,
      className = '',
      onValueChange,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e); // RHF / native handler
      onValueChange?.(e.target.value); // simple controlled usage
    };

    return (
      <div className={`base-input flex flex-col gap-1 ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="base-input__label block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Input row */}
        <div
          className={`flex items-center bg-white border rounded-3xl overflow-hidden shadow-sm transition-colors
            ${error ? 'border-red-400 focus-within:border-red-400' : 'border-gray-200 focus-within:border-primary-400'}
            ${disabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : ''}
          `}
        >
          {leadingSlot && (
            <div className="base-input__leading pl-3 text-gray-400 flex-shrink-0">
              {leadingSlot}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            required={required}
            disabled={disabled}
            onChange={handleChange}
            className="base-input__field flex-1 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent disabled:cursor-not-allowed"
            {...rest}
          />

          {trailingSlot && <div className="base-input__trailing flex-shrink-0">{trailingSlot}</div>}
        </div>

        {/* Error or hint */}
        {error ? (
          <p className="base-input__message base-input__message--error text-xs text-red-500 flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
            {error}
          </p>
        ) : hint ? (
          <p className="base-input__message base-input__message--hint text-xs text-gray-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

BaseInput.displayName = 'BaseInput';

import { forwardRef } from 'react';
import { FormInput, type FormInputProps } from './FormInput';
import {
  isNumericEditingKey,
  NIGERIAN_PHONE_LENGTH,
  normalizeNigerianPhoneNumber,
} from '@/shared/utils/nigerianPhoneNumber';

export interface PhoneNumberInputProps extends Omit<
  FormInputProps,
  'type' | 'inputMode' | 'maxLength'
> {
  maxLength?: number;
}

export const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  ({ onChange, onKeyDown, maxLength = NIGERIAN_PHONE_LENGTH, ...rest }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = normalizeNigerianPhoneNumber(event.target.value).slice(0, maxLength);
      onChange?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isNumericEditingKey(event)) {
        event.preventDefault();
      }

      onKeyDown?.(event);
    };

    return (
      <FormInput
        ref={ref}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="tel-national"
        maxLength={maxLength}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    );
  },
);

PhoneNumberInput.displayName = 'PhoneNumberInput';

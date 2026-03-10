import { forwardRef } from 'react';
import { BaseInput, type BaseInputProps } from './BaseInput';
import { Icon } from '@iconify/react';

interface FormInputProps extends Omit<BaseInputProps, 'leadingSlot' | 'trailingSlot'> {
  icon?: string; // optional leading icon e.g. "mdi:email-outline"
  
}

// forwardRef so react-hook-form's register() works seamlessly
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ icon, ...rest }, ref) => {
    return (
      <BaseInput
        ref={ref}
        leadingSlot={icon ? <Icon icon={icon} className="w-4 h-4" /> : undefined}
        {...rest}
      />
    );
  },
);

FormInput.displayName = 'FormInput';
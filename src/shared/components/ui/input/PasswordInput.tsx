import { useState } from 'react';
import { Icon } from '@iconify/react';
import { BaseInput, type BaseInputProps } from './BaseInput';

type PasswordInputProps = Omit<BaseInputProps, 'type' | 'leadingSlot' | 'trailingSlot'>;

export const PasswordInput = ({ ...rest }: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <BaseInput
      type={show ? 'text' : 'password'}
      trailingSlot={
        <button
          type="button"
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={() => setShow((prev) => !prev)}
          className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon icon={show ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
        </button>
      }
      {...rest}
    />
  );
};

PasswordInput.displayName = 'PasswordInput';

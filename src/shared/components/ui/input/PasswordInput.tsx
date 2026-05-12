import { forwardRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { BaseInput, type BaseInputProps } from './BaseInput';

// type PasswordInputProps = Omit<BaseInputProps, 'type' | 'leadingSlot' | 'trailingSlot'>;

// export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
//   ({ ...rest }, ref) => {
//     const [show, setShow] = useState(false);

//     return (
//       <BaseInput
//         ref={ref}
//         type={show ? 'text' : 'password'}
//         trailingSlot={
//           <button
//             type="button"
//             aria-pressed={show}
//             aria-label={show ? 'Hide password' : 'Show password'}
//             onClick={() => setShow((prev) => !prev)}
//             className="password-input__toggle px-3 text-gray-400 hover:text-gray-600 transition-colors bg-transparent"
//           >
//             <Icon icon={show ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} className="w-4 h-4" />
//           </button>
//         }
//         {...rest}
//       />
//     );
//   },
// );

type PasswordInputProps = Omit<BaseInputProps, 'type' | 'leadingSlot' | 'trailingSlot'> & {
  disablePaste?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ disablePaste, ...rest }, ref) => {
    const [show, setShow] = useState(false);

    const handlePaste = disablePaste
      ? (e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault()
      : undefined;

    return (
      <BaseInput
        ref={ref}
        type={show ? 'text' : 'password'}
        onPaste={handlePaste}
        trailingSlot={
          <button
            type="button"
            aria-pressed={show}
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((prev) => !prev)}
            className="password-input__toggle px-3 text-gray-400 hover:text-gray-600 transition-colors bg-transparent"
          >
            <Icon icon={show ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} className="w-4 h-4" />
          </button>
        }
        {...rest}
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

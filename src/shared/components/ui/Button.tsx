// // import clsx from 'clsx';
// // import React, { ReactNode } from 'react';

// // type ButtonProps = {
// //   type?: 'submit' | 'button';
// //   onClick?: () => void;
// //   children: ReactNode;
// //   styles?: string;
// //   disabled?: boolean;
// // };

// // const Button = ({ type = 'button', styles, children, onClick, disabled }: ButtonProps) => {
// //   return (
// //     <button
// //       type={type}
// //       disabled={disabled}
// //       className={clsx(
// //         'bg-primary-500 text-white w-full rounded-lg p-2 cursor-pointer hover:bg-primary-600',
// //         styles,
// //       )}
// //       onClick={onClick}
// //     >
// //       {children}
// //     </button>
// //   );
// // };

// // export default Button;

// import { forwardRef } from 'react';
// import { Icon } from '@iconify/react';
// import clsx from 'clsx';

// type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'white';
// type ButtonSize = 'sm' | 'md' | 'lg';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant;
//   size?: ButtonSize;
//   loading?: boolean;
//   leftIcon?: string;
//   rightIcon?: string;
//   fullWidth?: boolean;
// }

// const variantStyles: Record<ButtonVariant, string> = {
//   primary: 'bg-primary-500 text-white hover:bg-primary-600 border border-transparent',
//   outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 bg-transparent',
//   ghost:   'border border-transparent text-primary-500 hover:bg-primary-50 bg-transparent',
//   danger:  'bg-red-500 text-white hover:bg-red-600 border border-transparent',
//   white:  'bg-white text-primary-500',
// };

// const sizeStyles: Record<ButtonSize, string> = {
//   sm: 'px-4 py-1.5 text-xs rounded-md',
//   md: 'px-6 py-2.5 text-sm rounded-lg',
//   lg: 'px-8 py-3 text-base rounded-lg',
// };

// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       variant = 'primary',
//       size = 'md',
//       loading = false,
//       leftIcon,
//       rightIcon,
//       fullWidth = false,
//       disabled,
//       className,
//       children,
//       ...rest
//     },
//     ref,
//   ) => {
//     const isDisabled = disabled || loading;

//     return (
//       <button
//         ref={ref}
//         disabled={isDisabled}
//         className={clsx(
//           'inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer',
//           'disabled:opacity-50 disabled:cursor-not-allowed',
//           variantStyles[variant],
//           sizeStyles[size],
//           fullWidth && 'w-full',
//           className,
//         )}
//         {...rest}
//       >
//         {/* Loading spinner */}
//         {loading && (
//           <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//         )}

//         {/* Left icon */}
//         {!loading && leftIcon && (
//           <Icon icon={leftIcon} className="w-4 h-4" />
//         )}

//         {children}

//         {/* Right icon */}
//         {!loading && rightIcon && (
//           <Icon icon={rightIcon} className="w-4 h-4" />
//         )}
//       </button>
//     );
//   },
// );

// Button.displayName = 'Button';

// export default Button;

import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 border border-transparent',
  outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 bg-transparent',
  ghost: 'border border-transparent text-primary-500 hover:bg-primary-50 bg-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600 border border-transparent',
  white: 'bg-white text-primary-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-xs rounded-md',
  md: 'px-6 py-2.5 text-sm rounded-lg',
  lg: 'px-8 py-3 text-base rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && 'w-full',
            className, // always last — wins over everything above
          ),
        )}
        {...rest}
      >
        {loading && <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />}
        {!loading && leftIcon && <Icon icon={leftIcon} className="w-4 h-4" />}
        {children}
        {!loading && rightIcon && <Icon icon={rightIcon} className="w-4 h-4" />}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;

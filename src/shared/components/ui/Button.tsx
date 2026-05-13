import { forwardRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AppLink } from './AppLink';
import { renderIcon, type AppIcon } from '@/shared/utils/renderIcon';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: AppIcon;
  rightIcon?: AppIcon;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  loading?: boolean;
}

interface ButtonLinkProps extends ButtonStyleProps {
  href: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 border border-transparent',
  outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 bg-transparent',
  ghost: 'border border-transparent text-primary-500 hover:bg-primary-50 bg-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600 border border-transparent',
  white: 'bg-white text-primary-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-xs rounded-3xl',
  md: 'px-6 py-2.5 text-sm rounded-3xl',
  lg: 'px-8 py-3 text-base rounded-3xl',
};
// const sizeStyles: Record<ButtonSize, string> = {
//   sm: 'px-4 py-1.5 text-xs rounded-md',
//   md: 'px-6 py-2.5 text-sm rounded-lg',
//   lg: 'px-8 py-3 text-base rounded-lg',
// };

function getButtonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleProps) {
  return twMerge(
    clsx(
      'inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className,
    ),
  );
}

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
        className={getButtonClassName({ variant, size, fullWidth, className })}
        {...rest}
      >
        {loading && renderIcon(LoaderCircle, 'h-4 w-4 animate-spin')}
        {!loading && renderIcon(leftIcon, 'h-4 w-4')}
        {children}
        {!loading && renderIcon(rightIcon, 'h-4 w-4')}
      </button>
    );
  },
);

Button.displayName = 'Button';

export function ButtonLink({
  href,
  ariaLabel,
  target,
  rel,
  onClick,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <AppLink
      href={href}
      ariaLabel={ariaLabel}
      target={target}
      rel={rel}
      onClick={onClick}
      className={getButtonClassName({ variant, size, fullWidth, className })}
    >
      {renderIcon(leftIcon, 'h-4 w-4')}
      {children}
      {renderIcon(rightIcon, 'h-4 w-4')}
    </AppLink>
  );
}

export default Button;

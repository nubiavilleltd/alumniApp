import { forwardRef, type ReactNode } from 'react';
import { BaseInput, type BaseInputProps } from './BaseInput';
import { Icon as IconifyIcon } from '@iconify/react';
import type { LucideIcon } from 'lucide-react';

interface FormInputProps extends Omit<BaseInputProps, 'leadingSlot' | 'trailingSlot'> {
  icon?: string | LucideIcon | ReactNode;
}

function renderLeadingIcon(icon: FormInputProps['icon']) {
  if (!icon) return undefined;

  if (typeof icon === 'string') {
    return <IconifyIcon icon={icon} className="w-4 h-4" />;
  }

  if (typeof icon === 'function') {
    const Icon = icon;
    return <Icon className="w-4 h-4" />;
  }

  return icon;
}

// forwardRef so react-hook-form's register() works seamlessly
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ icon, ...rest }, ref) => {
  return <BaseInput ref={ref} leadingSlot={renderLeadingIcon(icon)} {...rest} />;
});

FormInput.displayName = 'FormInput';

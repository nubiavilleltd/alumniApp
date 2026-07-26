import { forwardRef, type ReactNode } from 'react';
import React from 'react';
import { BaseInput, type BaseInputProps } from './BaseInput';
import { Icon as IconifyIcon } from '@iconify/react';
import type { LucideIcon } from 'lucide-react';

interface FormInputProps extends Omit<BaseInputProps, 'leadingSlot' | 'trailingSlot'> {
  icon?: string | LucideIcon | ReactNode;
}

function renderLeadingIcon(icon: FormInputProps['icon']): ReactNode {
  if (!icon) return undefined;

  // Iconify icon name
  if (typeof icon === 'string') {
    return <IconifyIcon icon={icon} className="w-4 h-4" />;
  }

  // Already-rendered JSX
  if (React.isValidElement(icon)) {
    return icon;
  }

  // Lucide component reference
  const Icon = icon as LucideIcon;

  return <Icon className="w-4 h-4" />;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ icon, ...rest }, ref) => {
  return <BaseInput ref={ref} leadingSlot={renderLeadingIcon(icon)} {...rest} />;
});

FormInput.displayName = 'FormInput';

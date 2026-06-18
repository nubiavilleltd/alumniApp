import { Icon as IconifyIcon } from '@iconify/react';
import type { LucideIcon } from 'lucide-react';
import { cloneElement, isValidElement, type ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

export type AppIcon = string | LucideIcon | ReactElement;

export function renderIcon(icon: AppIcon | undefined, className: string) {
  if (!icon) {
    return null;
  }

  if (typeof icon === 'string') {
    return <IconifyIcon icon={icon} className={className} />;
  }

  if (isValidElement(icon)) {
    return cloneElement(icon, {
      className: twMerge((icon.props as { className?: string }).className, className),
    });
  }

  const LucideComponent = icon as LucideIcon;
  return <LucideComponent className={className} />;
}

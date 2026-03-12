import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = 'mdi:inbox-outline',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <Icon icon={icon} className="w-8 h-8 text-primary-300" />
      </div>

      {/* Text */}
      <h3 className="text-gray-700 font-semibold text-base mb-1">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{description}</p>
      )}

      {/* Action */}
      {actionLabel && (
        <div className="mt-6">
          {actionHref ? (
            <AppLink
              href={actionHref}
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              {actionLabel}
            </AppLink>
          ) : onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
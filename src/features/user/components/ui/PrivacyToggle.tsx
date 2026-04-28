// features/user/components/ui/PrivacyToggle.tsx

/**
 * ============================================================================
 * PRIVACY TOGGLE - OPTIMISTIC UPDATES
 * ============================================================================
 *
 * Toggle privacy between "public" and "private"
 *
 * Features:
 * - Optimistic updates (instant UI feedback)
 * - Automatic backend sync
 * - Error handling with rollback
 * - Loading states
 *
 * ============================================================================
 */

import { Icon } from '@iconify/react';
import type { FieldVisibility } from '@/features/authentication/types/auth.types';

interface Props {
  value: FieldVisibility;
  onChange: (value: FieldVisibility) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

export function PrivacyToggle({ value, onChange, disabled = false, showLabel = false }: Props) {
  const isPublic = value === 'public';

  const handleToggle = () => {
    if (disabled) return;
    onChange(isPublic ? 'private' : 'public');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
        isPublic
          ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isPublic ? 'Click to make private' : 'Click to make public'}
    >
      <Icon icon={isPublic ? 'mdi:eye-outline' : 'mdi:lock'} className="w-3 h-3" />
      {showLabel && (isPublic ? 'Public' : 'Private')}
      {disabled && <Icon icon="mdi:loading" className="w-3 h-3 animate-spin" />}
    </button>
  );
}

/**
 * Enhanced version that connects directly to backend
 *
 * Usage:
 * ```tsx
 * import { ConnectedPrivacyToggle } from './PrivacyToggle';
 *
 * <ConnectedPrivacyToggle field="photo" showLabel />
 * ```
 */
export function ConnectedPrivacyToggle({
  field,
  showLabel = false,
}: {
  field: keyof import('@/features/authentication/types/auth.types').PrivacySettings;
  showLabel?: boolean;
}) {
  const { value, toggle, isUpdating } = usePrivacyToggle(field);

  return (
    <PrivacyToggle value={value} onChange={toggle} disabled={isUpdating} showLabel={showLabel} />
  );
}

// Import hook at bottom to avoid circular dependency
import { usePrivacyToggle } from '@/features/user/hooks/usePrivacySettings';

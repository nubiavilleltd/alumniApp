// features/user/components/ui/FieldWithPrivacy.tsx

/**
 * ============================================================================
 * FIELD WITH PRIVACY - ENHANCED
 * ============================================================================
 *
 * Wraps a form field with privacy toggle
 *
 * Features:
 * - Optimistic privacy updates
 * - Connects to real backend
 * - Visual feedback during updates
 *
 * ============================================================================
 */

import { usePrivacyToggle } from '@/features/user/hooks/usePrivacySettings';
import { PrivacyToggle } from './PrivacyToggle';
import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';

interface Props {
  field: keyof PrivacySettings;
  label?: string;
  children?: React.ReactNode;
  privacy: PrivacySettings;
  onPrivacyChange: (field: keyof PrivacySettings, value: FieldVisibility) => void;
  hideLabel?: boolean;
}

export function FieldWithPrivacy({
  field,
  label,
  children,
  privacy,
  onPrivacyChange,
  hideLabel = false,
}: Props) {
  // ✅ Connect to real backend with optimistic updates
  const { value, toggle, isUpdating } = usePrivacyToggle(field);

  return (
    <div className="flex flex-col gap-1.5">
      {label && !hideLabel && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <PrivacyToggle value={value} onChange={toggle} disabled={isUpdating} showLabel={false} />
        </div>
      )}
      {hideLabel && (
        <PrivacyToggle value={value} onChange={toggle} disabled={isUpdating} showLabel={true} />
      )}
      {children}
    </div>
  );
}

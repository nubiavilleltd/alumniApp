// features/user/components/ui/FieldWithPrivacy.tsx

import type { ReactNode } from 'react';
import { PrivacyToggle } from './PrivacyToggle';
import type { FieldVisibility, PrivacySettings } from '@/features/authentication/types/auth.types';

interface FieldWithPrivacyProps {
  children: ReactNode;
  field: keyof PrivacySettings;
  privacy: PrivacySettings;
  onPrivacyChange: (field: keyof PrivacySettings, value: FieldVisibility) => void;
  label: string;
}

/**
 * Wrapper component that adds an inline privacy toggle to any form field
 * The toggle appears in the label row, next to the field name
 */
export function FieldWithPrivacy({
  children,
  field,
  privacy,
  onPrivacyChange,
  label,
}: FieldWithPrivacyProps) {
  return (
    <div className="flex flex-col">
      {/* Custom label row with privacy toggle */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
        <PrivacyToggle value={privacy[field]} onChange={(value) => onPrivacyChange(field, value)} />
      </div>

      {/* Child input component (without label) */}
      {children}
    </div>
  );
}

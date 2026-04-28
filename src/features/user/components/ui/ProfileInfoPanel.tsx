// features/user/components/ui/ProfileInfoPanel.tsx
//
// Shared right-column content used by both UserProfilePage and AlumniProfilePage.
// Renders About Me, Bio fields, Address, Professional Info sections.
// 'copyable' prop adds copy-to-clipboard on contact fields (AlumniProfilePage).
// 'owner' prop controls which fields are visible.

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from '@/shared/components/ui/Toast';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileInfoData {
  // About
  bio?: string;

  // Bio section
  fullName?: string;
  maidenName?: string;
  nicknameInSchool?: string;
  email?: string;
  whatsapp?: string;
  altPhone?: string;
  dateOfBirth?: string;

  // Address
  streetAddress?: string;
  area?: string;
  state?: string;
  city?: string;

  // Professional
  employmentStatus?: string;
  occupation?: string;
  industrySector?: string;
  yearsOfExperience?: string | number;

  // Social (shown as icon row in sidebar, but also accessible here)
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

interface ProfileInfoPanelProps {
  data: ProfileInfoData;
  /** If true, shows copy buttons next to contact fields */
  copyable?: boolean;
  /** If false (viewing another person's profile), some fields may be hidden */
  isOwner?: boolean;
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      className="text-primary-400 hover:text-primary-600 transition-colors flex-shrink-0"
    >
      <Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} className="w-4 h-4" />
    </button>
  );
}

// ─── Section container ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <h2 className="text-sm font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  copyable,
}: {
  label: string;
  value?: string | number;
  copyable?: boolean;
}) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 whitespace-nowrap min-w-[140px] sm:min-w-[180px]">
        {label}:
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-gray-700 break-words">{value}</span>
        {copyable && typeof value === 'string' && <CopyButton value={value} />}
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function ProfileInfoPanel({
  data,
  copyable = false,
  isOwner = false,
}: ProfileInfoPanelProps) {
  const hasBioFields =
    data.fullName ||
    data.maidenName ||
    data.nicknameInSchool ||
    data.email ||
    data.whatsapp ||
    data.altPhone ||
    data.dateOfBirth;

  const hasAddress = data.streetAddress || data.state || data.city;

  const hasProfessional =
    data.employmentStatus || data.occupation || data.industrySector || data.yearsOfExperience;

  return (
    <div className="space-y-4">
      {/* About Me */}
      {data.bio && (
        <Section title="About Me">
          <p className="text-sm text-gray-600 leading-relaxed">{data.bio}</p>
        </Section>
      )}

      {/* Bio */}
      {hasBioFields && (
        <Section title="Bio">
          <FieldRow label="Full Name" value={data.fullName} />
          <FieldRow label="Maiden Name" value={data.maidenName} />
          <FieldRow label="Nickname in School" value={data.nicknameInSchool} />
          <FieldRow label="Email" value={data.email} copyable={copyable} />
          <FieldRow label="WhatsApp" value={data.whatsapp} copyable={copyable} />
          <FieldRow label="Alt. Phone" value={data.altPhone} copyable={copyable} />
          <FieldRow label="Date of Birth" value={data.dateOfBirth} />
        </Section>
      )}

      {/* Address — only shown if we have data */}
      {/* {hasAddress && (
        <Section title="Address">
          <FieldRow label="Street Number and Name" value={data.streetAddress} />
          <FieldRow label="Area"                   value={data.area} />
          <FieldRow label="City"                   value={data.city} />
        </Section>
      )} */}

      {/* Professional Info */}
      {hasProfessional && (
        <Section title="Professional Info">
          <FieldRow label="Employment Status" value={data.employmentStatus} />
          <FieldRow label="Occupation" value={data.occupation} />
          <FieldRow label="Industry Sector" value={data.industrySector} />
          <FieldRow label="Years of Experience" value={data.yearsOfExperience} />
        </Section>
      )}
    </div>
  );
}

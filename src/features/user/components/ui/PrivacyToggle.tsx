// // features/user/components/ui/PrivacyToggle.tsx

// import { Icon } from '@iconify/react';
// import type { FieldVisibility } from '@/features/authentication/types/auth.types';

// interface PrivacyToggleProps {
//   value: FieldVisibility;
//   onChange: (value: FieldVisibility) => void;
//   className?: string;
// }

// /**
//  * Compact inline privacy toggle for profile fields
//  * Shows as: 🔓 Public or 🔒 Private
//  * Click to toggle between states
//  */
// export function PrivacyToggle({ value, onChange, className = '' }: PrivacyToggleProps) {
//   const isPublic = value === 'public';

//   const handleToggle = () => {
//     onChange(isPublic ? 'private' : 'public');
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleToggle}
//       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
//         isPublic
//           ? 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
//           : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
//       } ${className}`}
//       title={isPublic ? 'Click to make private' : 'Click to make public'}
//     >
//       <Icon
//         icon={isPublic ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
//         className="w-3.5 h-3.5"
//       />
//       <span>{isPublic ? 'Public' : 'Private'}</span>
//     </button>
//   );
// }

// features/user/components/ui/PrivacyToggle.tsx

import { Icon } from '@iconify/react';
import type { FieldVisibility } from '@/features/authentication/types/auth.types';

interface PrivacyToggleProps {
  value: FieldVisibility;
  onChange: (value: FieldVisibility) => void;
  className?: string;
}

/**
 * Compact inline privacy toggle for profile fields
 * Shows as: 🔓 Public or 🔒 Private
 * Click to toggle between states
 */
export function PrivacyToggle({ value, onChange, className = '' }: PrivacyToggleProps) {
  const isPublic = value === 'public';

  const handleToggle = () => {
    onChange(isPublic ? 'private' : 'public');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
        isPublic
          ? 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
      } ${className}`}
      title={isPublic ? 'Click to make private' : 'Click to make public'}
    >
      <Icon icon={isPublic ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} className="w-3 h-3" />
      <span>{isPublic ? 'Public' : 'Private'}</span>
    </button>
  );
}

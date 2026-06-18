// // features/user/utils/privacyResolvers.ts

// import { isGroupVisible } from './profileUtils';
// import type { PrivacySettings } from '@/features/authentication/types/auth.types';

// export function resolveVisibleField<T>(
//   value: T,
//   group: keyof PrivacySettings,
//   privacy: PrivacySettings | undefined,
//   isOwner: boolean,
// ): T | undefined {
//   return isGroupVisible(group, privacy, isOwner)
//     ? value
//     : undefined;
// }

// features/user/utils/privacyResolvers.ts
//
// MIGRATION: resolveVisibleField has been merged into profileUtils.ts.
// This file re-exports it so existing import paths keep working without changes.
// You can delete this file once all imports have been updated to point to profileUtils.

export { resolveVisibleField } from './profileUtils';

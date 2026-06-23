import type { SocialSignupResponse } from '../../types/auth.types';

function readString(...values: unknown[]) {
  const value = values.find((item) => typeof item === 'string' && item.trim().length > 0);
  return typeof value === 'string' ? value.trim() : null;
}

function readBoolean(...values: unknown[]) {
  const value = values.find((item) => item !== undefined && item !== null);

  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'verified'].includes(value.trim().toLowerCase());
  }

  return false;
}

export function mapSocialSignupResponse(raw: unknown): SocialSignupResponse {
  const data = (raw ?? {}) as Record<string, any>;
  const user = (data.user ?? data.profile ?? data.data ?? {}) as Record<string, any>;

  const fullName = readString(data.fullname, data.full_name, data.name, user.fullname, user.name);
  const firstName = readString(data.first_name, data.given_name, user.first_name, user.given_name);
  const lastName = readString(data.last_name, data.family_name, user.last_name, user.family_name);
  const splitName = fullName?.split(/\s+/).filter(Boolean) ?? [];
  const inferredFirstName = splitName.length > 1 ? splitName.slice(0, -1).join(' ') : splitName[0];

  return {
    raw,
    provider: 'google',
    userId:
      readString(data.user_id, data.userId, data.id, user.user_id, user.userId, user.id) ?? '',
    providerUserId:
      readString(
        data.provider_user_id,
        data.social_id,
        data.google_id,
        data.sub,
        user.provider_user_id,
        user.social_id,
        user.google_id,
        user.sub,
      ) ?? '',
    firstName: firstName ?? inferredFirstName ?? null,
    lastName: lastName ?? (splitName.length > 1 ? splitName[splitName.length - 1] : null),
    email: readString(data.email, user.email),
    emailVerified: readBoolean(
      data.email_verified,
      data.emailVerified,
      user.email_verified,
      user.emailVerified,
    ),
    avatarUrl: readString(
      data.avatar,
      data.picture,
      data.photo,
      user.avatar,
      user.picture,
      user.photo,
    ),
    accessToken: readString(data.access_token, data.accessToken),
    refreshToken: readString(data.refresh_token, data.refreshToken),
  };
}

import { HttpError } from '../utils/errors';
import type { VerifiedRequestUser } from '../types/auth';

type HttpRequest = {
  header(name: string): string | undefined;
};

function getBearerToken(req: HttpRequest) {
  const authorization = req.header('Authorization') || req.header('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HttpError(401, 'Missing bearer token.');
  }

  return authorization.slice('Bearer '.length).trim();
}

function getRequestingUserId(req: HttpRequest) {
  const userId = req.header('X-User-Id')?.trim();

  if (!userId) {
    throw new HttpError(400, 'Missing X-User-Id header.');
  }

  return userId;
}

function buildProfileUrl() {
  const baseUrl = process.env.ALUMNI_API_BASE_URL?.trim();
  const endpoint = process.env.ALUMNI_PROFILE_ENDPOINT?.trim() || '/api/get_user_profile';

  if (!baseUrl) {
    throw new HttpError(
      500,
      'Missing ALUMNI_API_BASE_URL. Configure backend profile verification first.',
    );
  }

  return new URL(endpoint, baseUrl).toString();
}

export async function verifyExistingBearerToken(req: HttpRequest): Promise<VerifiedRequestUser> {
  const accessToken = getBearerToken(req);
  const requestingUserId = getRequestingUserId(req);
  const apiKey = process.env.ALUMNI_API_TOKEN?.trim();

  const response = await fetch(buildProfileUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(apiKey ? { 'X-API-Key': apiKey } : {}),
    },
    body: JSON.stringify({
      user_id: requestingUserId,
    }),
  });

  const payload = await response.json().catch(() => null);
  const user = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;

  if (!response.ok || !user || typeof user !== 'object') {
    throw new HttpError(401, 'Unable to verify authenticated user.', payload);
  }

  const resolvedUserId = String((user as Record<string, unknown>).user_id ?? '');

  if (!resolvedUserId) {
    throw new HttpError(401, 'User verification succeeded but no user ID was returned.', payload);
  }

  if (resolvedUserId !== requestingUserId) {
    throw new HttpError(403, 'Authenticated user does not match requested user context.', payload);
  }

  const rawUser = user as Record<string, unknown>;
  const fullName =
    String(rawUser.fullname ?? '').trim() ||
    `${String(rawUser.first_name ?? '').trim()} ${String(rawUser.last_name ?? '').trim()}`.trim();

  return {
    id: resolvedUserId,
    role: rawUser.user_role === 'admin' ? 'admin' : 'member',
    fullName,
    email: String(rawUser.email ?? ''),
    chapterId: rawUser.chapter_id ? String(rawUser.chapter_id) : undefined,
    raw: rawUser,
  };
}

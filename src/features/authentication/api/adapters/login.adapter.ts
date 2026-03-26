import { DuesStatus } from '../../constants/mockAccounts';
import type { LoginFormValues, AuthSessionUser } from '../../types/auth.types';

/**
 * Login Payload & Response Adapter
 *
 * Maps frontend login form data to backend API payload format,
 * and backend response to frontend AuthSessionUser format.
 *
 * UPDATE THIS FILE when backend changes - rest of code stays the same!
 *
 * Last Updated: 2026-03-24
 * Backend Status: Unstable (in development)
 *
 * ============================================================================
 * BACKEND CONTRACT (Current - Subject to Change)
 * ============================================================================
 *
 * Request:
 * - identity: string  (email address)
 * - password: string
 *
 * Response (200):
 * - status, message, access_token, refresh_token, token_type, expires_in
 * - user_id, email, fullname, first_name, last_name, phone
 * - user_role, avatar, active, email_verified, is_approved
 * - chapter_id, graduation_year, department, bio, profile
 *
 * Error Status Codes:
 * - 400 → Wrong password
 * - 401 → Invalid API token
 * - 403 → Email not verified
 * - 404 → Email not registered
 * - 406 → Awaiting admin approval
 * - 422 → Invalid email format
 * - 423 → Account deactivated by admin
 *
 * ============================================================================
 * TODO / CLARIFICATIONS NEEDED FROM BACKEND TEAM:
 * ============================================================================
 *
 * 1. Does the backend ever return `nameInSchool` / `name_in_school`?
 *    - Not present in current response — defaulting to empty string
 *
 * 2. What is `memberId` on the backend?
 *    - Not present in current response — using user_id as fallback
 *
 * 3. `slug` for profile URLs — is this ever returned?
 *    - Not present in current response — deriving from email prefix for now
 *
 * 4. `duesStatus`, `approvalStatus`, `accountStatus` — are these ever returned?
 *    - Not present in current response — inferring from `is_approved` / `active`
 *
 * 5. Confirm `user_role` values — is "alumni" the only non-admin role?
 *
 * ============================================================================
 */

/**
 * Maps frontend login form data to backend API payload
 */
export function mapLoginPayload(values: LoginFormValues) {
  return {
    identity: values.email, // Frontend: email → Backend: identity
    password: values.password,
  };
}

/**
 * Maps backend login response to frontend AuthSessionUser + token format
 */
export function mapLoginResponse(backendResponse: any): {
  user: AuthSessionUser;
  accessToken: string;
  refreshToken: string;
} {
  const r = backendResponse;

  // ─── Derive fields not directly in backend response ──────────────────────
  const firstName = r.first_name || '';
  const lastName = r.last_name || '';
  const fullName = r.fullname || `${firstName} ${lastName}`.trim();

  // Derive initials for avatar fallback
  const avatarInitials =
    [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() ||
    r.email?.[0]?.toUpperCase() ||
    '?';

  // Derive slug from email prefix (e.g. "emeka.okafor@gmail.com" → "emeka-okafor")
  // TODO: Replace with backend-provided slug when available
  const slug = (r.email || '')
    .split('@')[0]
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();

  // ─── Infer statuses from available backend flags ──────────────────────────
  // TODO: Replace with dedicated fields when backend provides them
  const approvalStatus = r.is_approved ? 'approved' : 'pending';
  const accountStatus = r.active ? 'active' : 'deactivated';

  return {
    accessToken: r.access_token || '',
    refreshToken: r.refresh_token || '',

    user: {
      // ── Identity ────────────────────────────────────────────────────────
      id: String(r.user_id || ''),
      memberId: String(r.user_id || ''), // TODO: Use dedicated memberId when backend provides it
      slug,
      avatarInitials,
      profileHref: `/alumni/${slug}`,
      createdAt: new Date().toISOString(), // TODO: Use backend-provided createdAt when available
      chapterId: r.chapter_id ? String(r.chapter_id) : undefined,

      // ── Auth ────────────────────────────────────────────────────────────
      role: r.user_role === 'admin' ? 'admin' : 'member',

      // ── Verification ────────────────────────────────────────────────────
      isEmailVerified: r.email_verified ?? false,

      // ── Approval & Account ──────────────────────────────────────────────
      approvalStatus,
      accountStatus,

      // ── Dues (not in backend response yet) ──────────────────────────────
      // TODO: Map from backend when dues fields are added
      duesStatus: mapBackendDues(r.dues_status),
      // duesStatus: 'unknown',

      // ── Core fields ─────────────────────────────────────────────────────
      fullName,
      surname: lastName,
      otherNames: firstName,
      nameInSchool: r.name_in_school || '', // TODO: Confirm if backend will ever return this
      email: r.email || '',
      whatsappPhone: r.phone || '',
      graduationYear: parseInt(r.graduation_year || '0', 10),

      // ── Profile ─────────────────────────────────────────────────────────
      photo: r.avatar || undefined,
      bio: r.bio || undefined,

      // ── Extended profile (from nested `profile` object) ──────────────────
      linkedin: r.profile?.linkedin || undefined,
      twitter: r.profile?.twitter || undefined,
      city: r.profile?.city || undefined,
    } as AuthSessionUser,
  };
}

/**
 * Maps backend login error to a user-friendly message
 *
 * Called in authApi.login catch block — keeps error logic out of the UI.
 */
export function mapLoginError(error: any): string {
  const status = error.response?.status;
  const serverMessage =
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;

  switch (status) {
    case 400:
      return 'Incorrect password. Please try again.';
    case 401:
      return 'Authentication failed. Please try again.';
    case 403:
      return 'EMAIL_NOT_VERIFIED'; // Sentinel — LoginForm handles this specially
    case 404:
      return 'No account found with this email address.';
    case 406:
      return 'AWAITING_APPROVAL'; // Sentinel — LoginForm handles this specially
    case 422:
      return 'Please enter a valid email address.';
    case 423:
      return 'ACCOUNT_DEACTIVATED'; // Sentinel — LoginForm handles this specially
    default:
      return serverMessage || 'Login failed. Please try again.';
  }
}

function mapBackendDues(backendValue: any): DuesStatus {
  switch (backendValue) {
    case 'paid':
    case 'owing':
    case 'overdue':
      return backendValue;
    default:
      return 'unknown';
  }
}

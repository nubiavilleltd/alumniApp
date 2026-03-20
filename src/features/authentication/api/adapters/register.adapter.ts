import { formatPhoneNumberWithCountryCode } from '../../constants/phoneCountries';
import type { RegisterDetailsFormValues } from '../../types/auth.types';

/**
 * Registration Payload Adapter
 * 
 * Maps frontend registration form data to backend API payload format.
 * 
 * UPDATE THIS FILE when backend changes - rest of code stays the same!
 * 
 * Last Updated: 2026-03-18
 * Backend Status: Unstable (in development)
 * 
 * ============================================================================
 * BACKEND CONTRACT (Current - Subject to Change)
 * ============================================================================
 * 
 * Required Fields:
 * - first_name, last_name, email, password
 * - phone, graduation_year, name_in_school
 * - user_role, chapter_id, year, department
 * 
 * Optional Fields (can be empty):
 * - All extended profile fields (alternative_phone, birth_date, house_color, etc.)
 * 
 * ============================================================================
 * TODO / CLARIFICATIONS NEEDED FROM BACKEND TEAM:
 * ============================================================================
 * 
 * 1. What is the 'year' field for?
 *    - Current year? Membership year? Registration year?
 *    - Currently defaulting to current year
 * 
 * 2. Should 'chapter_id' be dynamic or always "1" (Lagos)?
 *    - Currently hardcoded to "1"
 *    - May need to add chapter selection to registration form
 * 
 * 3. Should 'department' be collected during registration?
 *    - Currently sending empty string
 *    - May need to add department dropdown to form
 *    - Need list of valid departments from backend
 * 
 * 4. Are extended profile fields required or optional?
 *    - Currently sending empty values
 *    - Assuming these will be filled in profile edit after registration
 * 
 * 5. Confirm field name mappings:
 *    - Frontend 'otherNames' → Backend 'first_name' (correct?)
 *    - Frontend 'surname' → Backend 'last_name' (correct?)
 * 
 * ============================================================================
 */

/**
 * Maps frontend registration form data to backend API payload
 */
export function mapRegistrationPayload(values: RegisterDetailsFormValues) {
  return {
    // ─── Basic Info ──────────────────────────────────────────────────────
    // Frontend fields → Backend fields
    first_name: values.otherNames,      // Frontend: otherNames → Backend: first_name
    last_name: values.surname,          // Frontend: surname → Backend: last_name
    email: values.email,
    password: values.password,
    
    // ─── Contact ─────────────────────────────────────────────────────────
    phone: formatPhoneNumberWithCountryCode(values.phoneCountry, values.whatsappPhone),
    
    // ─── School Info ─────────────────────────────────────────────────────
    name_in_school: values.nameInSchool,
    graduation_year: String(values.graduationYear),
    
    // ─── System Defaults ─────────────────────────────────────────────────
    // TODO: Confirm these with backend team
    user_role: "alumni",                        // Always "alumni" for registration
    chapter_id: "1",                            // TODO: Should this be dynamic? Currently hardcoded to Lagos
    year: new Date().getFullYear().toString(),  // TODO: Clarify what this field represents
    department: "",                             // TODO: Add to form or confirm if optional
    
    // ─── Extended Profile Fields ─────────────────────────────────────────
    // These are filled in profile edit AFTER registration
    // Sending empty values for now - backend should accept these as optional
    alternative_phone: "",
    birth_date: "",
    house_color: "",
    is_coordinator: false,
    residential_address: "",
    area: "",
    city: "",
    employment_status: "",
    occupation: "",
    industry_sector: "",
    years_of_experience: "",
    is_volunteer: false,
  };
}

/**
 * Maps backend registration response to frontend format
 * 
 * Handles different response structures as backend evolves
 */
export function mapRegistrationResponse(backendResponse: any) {
  return {
    status: 'verification_required' as const,
    message: backendResponse.message || backendResponse.msg || 'Verification code sent to your email',
    expiresInMinutes: backendResponse.expiresInMinutes || backendResponse.expires_in_minutes || 10,
    draft: {
      fullName: `${backendResponse.first_name || backendResponse.otherNames || ''} ${backendResponse.last_name || backendResponse.surname || ''}`.trim(),
      email: backendResponse.email || '',
      phoneNumber: backendResponse.phone || backendResponse.phoneNumber || '',
      graduationYear: parseInt(backendResponse.graduation_year || backendResponse.graduationYear || '0'),
      userId:backendResponse.user_id
    },
  };
}

/**
 * Maps email verification request to backend format
 */
export function mapVerificationPayload(email: string, code: string, userId:string) {

    
  return {
    email,
    verify_code:code,
    user_id:userId
    // TODO: Add other fields if backend requires them
  };
}

/**
 * Maps backend verification response to frontend format
 */
export function mapVerificationResponse(backendResponse: any) {
  return {
    status: 'pending_admin_approval' as const,
    message: backendResponse.message || backendResponse.msg || 'Email verified. Awaiting admin approval.',
    draft: {
      fullName: backendResponse.full_name 
        || backendResponse.fullName 
        || `${backendResponse.first_name || ''} ${backendResponse.last_name || ''}`.trim()
        || '',
      email: backendResponse.email || '',
      phoneNumber: backendResponse.phone || backendResponse.phoneNumber || '',
      graduationYear: parseInt(backendResponse.graduation_year || backendResponse.graduationYear || '0'),
      userId:backendResponse.user_id
    },
  };
}
import type {
  CompleteRegistrationResponse,
  RegisterDetailsFormValues,
  StartRegistrationResponse,
} from '../types/auth.types';

export type RegistrationStep = 'details' | 'verification' | 'success';

export interface RegistrationFlowState {
  step: RegistrationStep;
  formValues: RegisterDetailsFormValues | null;
  verificationResponse: StartRegistrationResponse | null;
  userId: string | null;
  completionResponse: CompleteRegistrationResponse | null;
}

export const INITIAL_REGISTRATION_FLOW_STATE: RegistrationFlowState = {
  step: 'details',
  formValues: null,
  verificationResponse: null,
  userId: null,
  completionResponse: null,
};

const STORAGE_KEY = 'registration_flow';

export function saveRegistrationFlow(state: RegistrationFlowState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function loadRegistrationFlow(): RegistrationFlowState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as RegistrationFlowState;
  } catch {
    return null;
  }
}

export function clearRegistrationFlow() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

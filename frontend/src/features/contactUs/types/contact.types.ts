export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export interface ContactSubmissionResponse {
  status?: number;
  message?: string;
  data?: unknown;
}

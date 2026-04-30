export interface VerifiedRequestUser {
  id: string;
  role: 'member' | 'admin';
  fullName: string;
  email: string;
  chapterId?: string;
  raw: Record<string, unknown>;
}

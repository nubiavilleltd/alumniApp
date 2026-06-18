import type { VerifiedRequestUser } from '../types/auth';
import { HttpError } from '../utils/errors';

export function requireAdmin(user: VerifiedRequestUser) {
  if (user.role !== 'admin') {
    throw new HttpError(403, 'You do not have permission to perform this action.');
  }
}

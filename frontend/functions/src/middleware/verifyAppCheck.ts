import { getAppCheck } from 'firebase-admin/app-check';
import { HttpError } from '../utils/errors';

type HttpRequest = {
  header(name: string): string | undefined;
};

export async function verifyAppCheck(req: HttpRequest) {
  const enforce = process.env.ENFORCE_APP_CHECK === 'true';
  const token = req.header('X-Firebase-AppCheck');

  if (!token) {
    if (enforce) {
      throw new HttpError(401, 'Missing Firebase App Check token.');
    }

    return null;
  }

  try {
    return await getAppCheck().verifyToken(token);
  } catch (error) {
    throw new HttpError(401, 'Invalid Firebase App Check token.', error);
  }
}

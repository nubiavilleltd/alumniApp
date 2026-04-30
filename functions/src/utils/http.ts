import { requireAdmin } from '../middleware/requireAdmin';
import { verifyAppCheck } from '../middleware/verifyAppCheck';
import { verifyExistingBearerToken } from '../middleware/verifyExistingBearerToken';
import type { VerifiedRequestUser } from '../types/auth';
import { HttpError, isHttpError } from './errors';

type HttpRequest = {
  method?: string;
  body?: unknown;
  header(name: string): string | undefined;
};

type HttpResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): HttpResponse;
  json(payload: unknown): void;
  send(payload: string): void;
};

type HandlerOptions = {
  adminOnly?: boolean;
};

type HandlerContext<TBody> = {
  body: TBody;
  user: VerifiedRequestUser;
  req: HttpRequest;
  res: HttpResponse;
};

export function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getSurveyRequestOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    region: 'us-central1' as const,
    cors: allowedOrigins.length > 0 ? allowedOrigins : true,
  };
}

function applyCors(req: HttpRequest, res: HttpResponse) {
  const origin = req.header('Origin');
  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.length === 0) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-User-Id, X-Firebase-AppCheck',
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

function readBody<TBody>(req: HttpRequest): TBody {
  const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});

  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }

  return rawBody as TBody;
}

function sendError(res: HttpResponse, error: unknown) {
  if (isHttpError(error)) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  const message = error instanceof Error ? error.message : 'Unexpected error';
  res.status(500).json({ error: message });
}

export async function handleSurveyHttpRequest<TBody, TResult>(
  req: HttpRequest,
  res: HttpResponse,
  handler: (context: HandlerContext<TBody>) => Promise<TResult>,
  options: HandlerOptions = {},
) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    if (req.method !== 'POST') {
      throw new HttpError(405, 'Only POST requests are supported.');
    }

    const body = readBody<TBody>(req);
    await verifyAppCheck(req);
    const user = await verifyExistingBearerToken(req);

    if (options.adminOnly) {
      requireAdmin(user);
    }

    const result = await handler({ body, user, req, res });
    res.status(200).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

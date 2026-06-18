const STORAGE_PREFIX = 'auth.verification-resend:';

export const VERIFICATION_RESEND_COOLDOWN_MS = 45 * 1000;
export const VERIFICATION_RESEND_MAX_TRIES = 3;
export const VERIFICATION_RESEND_BLOCK_MS = 2 * 60 * 60 * 1000;

interface VerificationResendRecord {
  attempts: number;
  cooldownUntil: number | null;
  blockedUntil: number | null;
}

export interface VerificationResendStatus {
  attempts: number;
  attemptsRemaining: number;
  cooldownRemainingMs: number;
  blockRemainingMs: number;
  isCoolingDown: boolean;
  isBlocked: boolean;
  canCallApi: boolean;
}

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function defaultRecord(): VerificationResendRecord {
  return {
    attempts: 0,
    cooldownUntil: null,
    blockedUntil: null,
  };
}

function normalizeRecord(userId: string, now = Date.now()): VerificationResendRecord {
  if (!userId) {
    return defaultRecord();
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    if (!raw) {
      return defaultRecord();
    }

    const parsed = JSON.parse(raw) as Partial<VerificationResendRecord>;
    const next: VerificationResendRecord = {
      attempts: Number.isFinite(parsed.attempts) ? Number(parsed.attempts) : 0,
      cooldownUntil:
        parsed.cooldownUntil && Number.isFinite(parsed.cooldownUntil)
          ? Number(parsed.cooldownUntil)
          : null,
      blockedUntil:
        parsed.blockedUntil && Number.isFinite(parsed.blockedUntil)
          ? Number(parsed.blockedUntil)
          : null,
    };

    if (next.blockedUntil && next.blockedUntil <= now) {
      const reset = defaultRecord();
      persistRecord(userId, reset);
      return reset;
    }

    return next;
  } catch {
    return defaultRecord();
  }
}

function persistRecord(userId: string, record: VerificationResendRecord) {
  if (!userId) return;

  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(record));
  } catch {}
}

export function getVerificationResendStatus(
  userId: string,
  now = Date.now(),
): VerificationResendStatus {
  const record = normalizeRecord(userId, now);
  const cooldownRemainingMs = Math.max(0, (record.cooldownUntil ?? 0) - now);
  const blockRemainingMs = Math.max(0, (record.blockedUntil ?? 0) - now);
  const isBlocked = blockRemainingMs > 0;
  const isCoolingDown = !isBlocked && cooldownRemainingMs > 0;
  const attemptsRemaining = Math.max(0, VERIFICATION_RESEND_MAX_TRIES - record.attempts);

  return {
    attempts: record.attempts,
    attemptsRemaining,
    cooldownRemainingMs,
    blockRemainingMs,
    isCoolingDown,
    isBlocked,
    canCallApi: !isBlocked && !isCoolingDown && attemptsRemaining > 0,
  };
}

export function markInitialVerificationSend(userId: string, now = Date.now()) {
  const record = normalizeRecord(userId, now);
  persistRecord(userId, {
    ...record,
    cooldownUntil: now + VERIFICATION_RESEND_COOLDOWN_MS,
  });
}

export function recordVerificationResendAttempt(userId: string, now = Date.now()) {
  const record = normalizeRecord(userId, now);
  const attempts = record.attempts + 1;

  persistRecord(userId, {
    attempts,
    cooldownUntil: now + VERIFICATION_RESEND_COOLDOWN_MS,
    blockedUntil:
      attempts >= VERIFICATION_RESEND_MAX_TRIES ? now + VERIFICATION_RESEND_BLOCK_MS : null,
  });
}

export function formatVerificationResendDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(durationMs / 1000));

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
}

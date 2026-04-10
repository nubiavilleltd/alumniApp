// lib/utils/adapters.ts
//
// Shared utilities used by all feature adapters.
// Import from here — never duplicate these in individual adapter files.

// ─── Type coercion ────────────────────────────────────────────────────────────

/** Safely parse any value to integer. Returns undefined for empty / NaN. */
export function safeParseInt(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

/** Convert "0"/"1", 0/1, true/false to boolean. Returns undefined for unknown. */
export function stringToBoolean(value: unknown): boolean | undefined {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return undefined;
}

/**
 * Convert Unix timestamp (seconds) or date string to ISO string.
 * Returns current time as fallback so UI never breaks on missing dates.
 */
// export function safeParseDate(value: unknown): string {
//   if (!value) return new Date().toISOString();

//   if (typeof value === 'string' && value.includes('T')) return value;

//   const asInt = parseInt(String(value), 10);
//   if (!isNaN(asInt) && asInt > 1_000_000_000) {
//     return new Date(asInt * 1000).toISOString();
//   }

//   const parsed = new Date(value as string);
//   return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
// }

export function safeParseDate(value: unknown): string {
  if (!value) return new Date().toISOString();

  // ✅ If already ISO (has time), keep it
  if (typeof value === 'string' && value.includes('T')) return value;

  // ✅ If it's a date-only string (YYYY-MM-DD), KEEP IT AS IS
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value; // 🔥 CRITICAL FIX
  }

  // Unix timestamp
  const asInt = parseInt(String(value), 10);
  if (!isNaN(asInt) && asInt > 1_000_000_000) {
    return new Date(asInt * 1000).toISOString();
  }

  // Fallback parsing
  const parsed = new Date(value as string);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

// ─── Slug generation ──────────────────────────────────────────────────────────

/**
 * Generate a URL-friendly slug from a name + fallback ID.
 * Truncated to 50 chars. Falls back to `{prefix}-{id}` if name is empty.
 */
export function generateSlug(name: string, id: string | number, prefix = 'item'): string {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return `${prefix}-${id}`;

  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);

  return slug || `${prefix}-${id}`;
}

// ─── Response unwrapping ──────────────────────────────────────────────────────

/**
 * Extract a list from a backend response that may wrap the array
 * under different keys depending on the endpoint and backend version.
 *
 * Checks keys in order — first match wins.
 * Falls back to empty array so callers always get an array.
 *
 * Usage:
 *   const listings = extractList(response.data, ['listings', 'data', 'users']);
 */
export function extractList(data: unknown, keys: string[]): unknown[] {
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    for (const key of keys) {
      const candidate = (data as Record<string, unknown>)[key];
      if (Array.isArray(candidate)) return candidate;
    }
  }

  return [];
}

/**
 * Extract a single object from a backend response.
 * Checks keys in order — first non-null match wins.
 * Falls back to the root data object if no key matches.
 */
export function extractObject(data: unknown, keys: string[]): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') return null;

  for (const key of keys) {
    const candidate = (data as Record<string, unknown>)[key];
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return candidate as Record<string, unknown>;
    }
  }

  return data as Record<string, unknown>;
}

// ─── Image parsing ────────────────────────────────────────────────────────────

/**
 * Parse images from a backend field that may be an array, a JSON string,
 * a comma-separated string, or null/undefined.
 */
export function parseImages(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter((i) => typeof i === 'string');

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return [];
}

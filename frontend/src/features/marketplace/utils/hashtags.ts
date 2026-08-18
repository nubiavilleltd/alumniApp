// features/marketplace/utils/hashtags.ts

export const MAX_INSTAGRAM_HASHTAGS = 3;
const HASHTAG_CHAR_PATTERN = /^[A-Za-z0-9_]+$/;

/** Splits a raw comma-separated string into clean, deduped hashtag strings (no leading #, no whitespace). */
export function parseHashtags(raw?: string): string[] {
  if (!raw) return [];

  const seen = new Set<string>();
  const tags: string[] = [];

  for (const piece of raw.split(',')) {
    const cleaned = piece.trim().replace(/^#+/, '').replace(/\s+/g, '');
    // const cleaned = piece.trim().replace(/\s+/g, '');
    if (!cleaned) continue;

    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue; // dedupe — drop if you'd rather keep duplicates
    seen.add(key);
    tags.push(cleaned);
  }

  return tags;
}

/** Re-joins a parsed tag array into the canonical stored string form. */
export function serializeHashtags(tags: string[]): string | undefined {
    console.log("okay", tags, tags.join(', '))
  return tags.length > 0 ? tags.join(', ') : undefined;
}

/** Validates a raw hashtag string; returns an error message, or undefined if valid. */
export function validateHashtags(raw?: string): string | undefined {
  const tags = parseHashtags(raw);

  if (tags.length > MAX_INSTAGRAM_HASHTAGS) {
    return `Up to ${MAX_INSTAGRAM_HASHTAGS} hashtags allowed`;
  }

//   const invalid = tags.find((tag) => !HASHTAG_CHAR_PATTERN.test(tag));
//   if (invalid) {
//     return `"${invalid}" — only letters, numbers, and underscores allowed`;
//   }

  return undefined;
}



export function normalizeLegacyHashtags(raw?: string): string | undefined {
  if (!raw) return undefined;

  const seen = new Set<string>();
  const tags: string[] = [];

  for (const piece of raw.split(/[,#]+|\s+/)) {
    const cleaned = piece.trim();
    if (!cleaned) continue;

    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(cleaned);
  }

  return tags.length > 0 ? tags.join(', ') : undefined;
}
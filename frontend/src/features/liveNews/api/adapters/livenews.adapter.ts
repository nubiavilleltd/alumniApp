import { generateSlug, safeParseInt, stringToBoolean, safeParseDate } from '@/lib/utils/adapters';
import { mapBackendPrivacyToFrontend } from '@/features/user/api/adapters/privacy.adapter';
import { LiveNewsItem } from '../../types/livenews.types';

// ─── Helpers (local, minimal) ───────────────────────────────────────────────

const safeString = (v: unknown, fallback = '') => (v ? String(v).trim() : fallback);

const optionalString = (v: unknown) => (v ? String(v).trim() : undefined);

export function mapBackendLiveNewsToFrontend(raw: unknown): LiveNewsItem {
    const d = raw as Record<string, any>;

    return {
        id: safeString(d.id),
        slug: safeString(d.slug),
        title: safeString(d.title),
        excerpt: safeString(d.description),
        source: safeString(d.source),
        body: safeString(d.fullcontent),
        imageUrl: safeString(d.image),
        publishedAt: safeString(d.published_at),

    };
}

export function mapBackendLiveNewsList(raw: unknown): LiveNewsItem[] {
    if (!Array.isArray(raw)) return [];

    return raw
        .map((item) => {
            try {
                return mapBackendLiveNewsToFrontend(item);
            } catch (err) {
                console.error('Failed to map live news item:', item, err);
                return null;
            }
        })
        .filter((a): a is LiveNewsItem => a !== null);
}

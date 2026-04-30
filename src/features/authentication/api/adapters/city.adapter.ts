// features/alumni/api/adapters/city.adapter.ts
//
// Maps raw GET /get_cities response items → frontend City objects.
// Mirrors the adapter pattern used throughout the codebase.

import { City } from '../../types/city.types';

const safeNum = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const safeStr = (v: unknown, fallback = ''): string =>
  v != null && String(v).trim() !== '' ? String(v).trim() : fallback;

/** Maps a single raw city item from the backend to a frontend City object. */
export function mapBackendCityToFrontend(raw: unknown): City {
  const d = raw as Record<string, any>;

  return {
    cityId: safeNum(d.city_id),
    city: safeStr(d.city),
    chapterId: safeNum(d.chapter_id),
    zoneId: safeNum(d.zone_id),
    zone: safeStr(d.zone),
  };
}

/** Maps the full /get_cities data array → City[]. Skips malformed items. */
export function mapBackendCityList(raw: unknown): City[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      try {
        return mapBackendCityToFrontend(item);
      } catch (err) {
        console.error('[city.adapter] Failed to map city item:', item, err);
        return null;
      }
    })
    .filter((c): c is City => c !== null);
}

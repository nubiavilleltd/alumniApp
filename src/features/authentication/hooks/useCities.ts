// features/alumni/hooks/useCities.ts
//
// React Query hook for the city list.
// Matches the pattern used in useAlumni.ts and other hooks in this codebase.

import { useQuery } from '@tanstack/react-query';
import { cityService } from '../services/city.service';
import { City } from '../types/city.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const cityKeys = {
  all: ['cities'] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the full list of cities with their zones.
 * Cached for 10 minutes — this data changes rarely.
 */
export function useCities() {
  return useQuery<City[]>({
    queryKey: cityKeys.all,
    queryFn: () => cityService.getCities(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

/**
 * Convenience: looks up a city by its name string and returns the full City
 * object (including zone). Returns undefined when the list isn't loaded yet
 * or the city isn't found (e.g. legacy free-text city names).
 */
export function useCityByName(cityName: string | undefined) {
  const { data: cities } = useCities();

  if (!cityName || !cities) return undefined;

  return cities.find((c) => c.city.toLowerCase() === cityName.toLowerCase());
}

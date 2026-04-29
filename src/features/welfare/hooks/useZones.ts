// features/welfare/hooks/useZones.ts
//
// React Query hook for the welfare zone list.
// Matches the pattern used in useCities.ts and other hooks in this codebase.

import { useQuery } from '@tanstack/react-query';
import { welfareService } from '../services/welfare.service';
import { WelfareZone } from '../types/welfare.type';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const zoneKeys = {
  all: ['welfare-zones'] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the full list of welfare zones with coordinator info.
 * Cached for 10 minutes — this data changes rarely.
 */
export function useZones() {
  return useQuery<WelfareZone[]>({
    queryKey: zoneKeys.all,
    queryFn: () => welfareService.getZones(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

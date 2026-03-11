
import { useQuery } from '@tanstack/react-query';
import {
  announcementService,
  type GetAnnouncementsParams,
} from '@/features/announcements/services/announcement.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const announcementKeys = {
  all:    ['announcements'] as const,
  list:   (params?: object) => [...announcementKeys.all, 'list', params] as const,
  detail: (slug: string)    => [...announcementKeys.all, 'detail', slug] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All announcements */
export function useAnnouncements(params?: GetAnnouncementsParams) {
  return useQuery({
    queryKey: announcementKeys.list(params),
    queryFn:  () => announcementService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
}

/** Single announcement by slug */
export function useAnnouncement(slug: string) {
  return useQuery({
    queryKey: announcementKeys.detail(slug),
    queryFn:  () => announcementService.getBySlug(slug),
    enabled:  !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

/** Latest N announcements for homepage — sorted most recent first */
export function useLatestAnnouncements(count = 5) {
  return useQuery({
    queryKey: announcementKeys.list(),
    queryFn:  () => announcementService.getAll(),
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      [...data]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count),
  });
}
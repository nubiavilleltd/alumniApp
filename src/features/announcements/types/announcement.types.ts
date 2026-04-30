// features/announcements/types/announcement.types.ts

export type AnnouncementType = 'info' | 'warning' | 'success' | 'event';

export interface Announcement {
  id: string | number;
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  image: string;
  date: string;
  type: AnnouncementType;
  tag?: string;
  createdBy?: string;
  chapterId?: string;
  year?: number;
  startsAt?: string;
  endsAt?: string;
  featured?: boolean;
}

export type NewsItem = Announcement;

export interface GetAnnouncementsParams {
  id?: string | number;
  createdBy?: string | number;
  type?: AnnouncementType;
  chapterId?: string | number;
  year?: string | number;
}

export interface AnnouncementMutationInput {
  title: string;
  content: string;
  type?: AnnouncementType;
  chapterId?: string;
  year?: string;
  startsAt?: string;
  endsAt?: string;
  image?: File | null;
}

import { parseDateInput } from '@/shared/utils/dateHelpers';

export function formatNewsDate(date: string) {
  const parsed = parseDateInput(date);
  if (!parsed) return '';

  const now = new Date();
  const isToday = parsed.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = parsed.toDateString() === yesterday.toDateString();

  const time = parsed.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `${time} Today`;
  if (isYesterday) return `${time} Yesterday`;

  return parsed.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
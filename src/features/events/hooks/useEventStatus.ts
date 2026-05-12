import { useMemo } from 'react';

type EventLike = {
  date?: string; // legacy support (YYYY-MM-DD)
  startDate?: string; // future
  endDate?: string; // future
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  status?: string;
};

function parseDateTime(date: string, time?: string) {
  const [y, m, d] = date.split('-').map(Number);
  const [h = 0, min = 0] = (time ?? '00:00').split(':').map(Number);
  return new Date(y, m - 1, d, h, min, 0).getTime();
}

function resolveStart(event: EventLike) {
  const date = event.startDate ?? event.date;
  if (!date) return 0;
  return parseDateTime(date, event.startTime);
}

// function resolveEnd(event: EventLike) {
//   const date = event.endDate ?? event.date;
//   if (!date) return 0;
//   return parseDateTime(date, event.endTime || event.startTime);
// }

function resolveEnd(event: EventLike) {
  // Fall back to startDate if no endDate — event ends on the same day it starts
  const date = event.endDate ?? event.startDate ?? event.date;
  if (!date) return 0;
  // If there's an endTime use it, otherwise treat end of day as the cutoff
  const time = event.endTime ?? '23:59';
  return parseDateTime(date, time);
}

export function useEventStatus(event?: EventLike | null) {
  return useMemo(() => {
    if (!event) {
      return {
        isUpcoming: false,
        isOngoing: false,
        isPast: false,
        start: 0,
        end: 0,
      };
    }

    const start = resolveStart(event);
    const end = resolveEnd(event);
    const now = Date.now();

    const isPast = now > end;
    const isUpcoming = now < start;
    const isOngoing = now >= start && now <= end;

    return {
      isUpcoming,
      isOngoing,
      isPast,
      start,
      end,
      now,
    };
  }, [event?.date, event?.startDate, event?.endDate, event?.startTime, event?.endTime]);
}

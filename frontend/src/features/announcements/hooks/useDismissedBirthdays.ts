// import { useCallback, useEffect, useState } from 'react';
// import { Birthday } from '../types/announcement.types';

// /**
//  * Local (not UTC) date, formatted as YYYY-MM-DD, used as part of the
//  * localStorage key so each day gets its own isolated bucket.
//  */
// function getTodayKey(): string {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, '0');
//   const day = String(now.getDate()).padStart(2, '0');
//   return `birthday-widget-${year}-${month}-${day}`;
// }

// export function useDismissedBirthdays(serverPeople: Birthday[] | undefined) {
//   // null = "we haven't reconciled with localStorage yet" (distinct from "[]",
//   // which means "reconciled, and everyone's been dismissed")
//   const [visibleIds, setVisibleIds] = useState<string[] | null>(null);

//   useEffect(() => {
//     // Nothing to reconcile against yet (still loading from the server)
//     if (!serverPeople) return;

//     const key = getTodayKey();

//     try {
//       const stored = localStorage.getItem(key);
//       if (stored) {
//         setVisibleIds(JSON.parse(stored));
//         return;
//       }
//     } catch {
//       // Corrupted value under this key — fall through and reseed below
//     }

//     // Nothing stored for today yet: seed today's key with everyone the
//     // server sent, and show all of them.
//     const freshIds = serverPeople.map((person) => person.userId);

//     try {
//       localStorage.setItem(key, JSON.stringify(freshIds));
//     } catch {
//       // localStorage unavailable (private browsing, quota exceeded, etc.)
//       // Degrade gracefully: dismissal still works for this session via
//       // React state, it just won't survive a reload.
//     }

//     setVisibleIds(freshIds);
//   }, [serverPeople]);

//   const dismiss = useCallback((userId: string) => {
//     setVisibleIds((prev) => {
//       const next = (prev ?? []).filter((id) => id !== userId);

//       try {
//         localStorage.setItem(getTodayKey(), JSON.stringify(next));
//       } catch {
//         // ignore write failure, state still updates for this session
//       }

//       return next;
//     });
//   }, []);

//   const visiblePeople =
//     serverPeople && visibleIds
//       ? serverPeople.filter((person) => visibleIds.includes(person.userId))
//       : (serverPeople ?? []);

//   return { visiblePeople, dismiss };
// }






import { useCallback, useEffect, useState } from 'react';
import { Birthday } from '../types/announcement.types';

const KEY_PREFIX = 'birthday-widget';

/**
 * Local (not UTC) date, formatted as YYYY-MM-DD.
 */
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Per-user, per-day localStorage key. Keying on memberId (not email) keeps
 * it stable even if a user's email changes, and avoids storing an email
 * address in plaintext browser storage.
 */
function getTodayKey(memberId: string): string {
  return `${KEY_PREFIX}-${memberId}-${getTodayDateString()}`;
}

/**
 * Removes every birthday-widget-* key that isn't for today — regardless of
 * which user it belongs to. Safe to run unconditionally: any key not
 * matching today's date string is guaranteed stale, since the widget only
 * ever reads/writes today's key for anyone.
 */
function pruneStaleKeys() {
  const todaySuffix = `-${getTodayDateString()}`;

  try {
    const staleKeys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${KEY_PREFIX}-`) && !key.endsWith(todaySuffix)) {
        staleKeys.push(key);
      }
    }

    staleKeys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // localStorage unavailable — nothing to prune, nothing to break
  }
}

export function useDismissedBirthdays(
  serverPeople: Birthday[] | undefined,
  memberId: string | undefined,
) {
  // null = "we haven't reconciled with localStorage yet" (distinct from "[]",
  // which means "reconciled, and everyone's been dismissed")
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);

  useEffect(() => {
    // Nothing to reconcile against yet (still loading from the server, or
    // we don't know who's logged in yet)
    if (!serverPeople || !memberId) return;

    pruneStaleKeys();

    const key = getTodayKey(memberId);

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setVisibleIds(JSON.parse(stored));
        return;
      }
    } catch {
      // Corrupted value under this key — fall through and reseed below
    }

    // Nothing stored for this user today yet: seed with everyone the
    // server sent, and show all of them.
    const freshIds = serverPeople.map((person) => person.userId);

    try {
      localStorage.setItem(key, JSON.stringify(freshIds));
    } catch {
      // localStorage unavailable (private browsing, quota exceeded, etc.)
      // Degrade gracefully: dismissal still works for this session via
      // React state, it just won't survive a reload.
    }

    setVisibleIds(freshIds);
  }, [serverPeople, memberId]);

  const dismiss = useCallback(
    (userId: string) => {
      if (!memberId) return;

      setVisibleIds((prev) => {
        const next = (prev ?? []).filter((id) => id !== userId);

        try {
          localStorage.setItem(getTodayKey(memberId), JSON.stringify(next));
        } catch {
          // ignore write failure, state still updates for this session
        }

        return next;
      });
    },
    [memberId],
  );

  const visiblePeople =
    serverPeople && visibleIds
      ? serverPeople.filter((person) => visibleIds.includes(person.userId))
      : (serverPeople ?? []);

  return { visiblePeople, dismiss };
}
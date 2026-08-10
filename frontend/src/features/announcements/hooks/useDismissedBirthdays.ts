
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Birthday } from '../types/announcement.types';

const KEY_PREFIX = 'birthday-widget';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayKey(memberId: string): string {
  return `${KEY_PREFIX}-dismissed-${memberId}-${getTodayDateString()}`;
}

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
    // localStorage unavailable — nothing to prune
  }
}

export function useDismissedBirthdays(
  serverPeople: Birthday[] | undefined,
  memberId: string | undefined,
) {
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (!serverPeople || !memberId) return;

    pruneStaleKeys();

    const key = getTodayKey(memberId);
    const serverIds = serverPeople.map((person) => person.userId);

    try {
      const stored = localStorage.getItem(key);
      let dismissedIds: string[] = [];

      if (stored) {
        dismissedIds = JSON.parse(stored);
        // Ensure dismissedIds is an array (handle corrupted data)
        if (!Array.isArray(dismissedIds)) {
          dismissedIds = [];
        }
      }

      // ✅ Show all server people EXCEPT those dismissed
      const visible = serverIds.filter((id) => !dismissedIds.includes(id));

      // Save empty array if nothing dismissed (so we know the key exists)
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(dismissedIds));
      }

      setVisibleIds(visible);
    } catch {
      // On error: show everyone
      setVisibleIds(serverIds);
    }
  }, [serverPeople, memberId]);

  const dismiss = useCallback(
    (userId: string) => {
      if (!memberId) return;

      const key = getTodayKey(memberId);

      setVisibleIds((prev) => {
        if (!prev) return prev;

        // Remove from visible
        const next = prev.filter((id) => id !== userId);

        // Add to dismissed in localStorage
        try {
          const stored = localStorage.getItem(key);
          const dismissedIds: string[] = stored ? JSON.parse(stored) : [];
          
          if (!dismissedIds.includes(userId)) {
            dismissedIds.push(userId);
            localStorage.setItem(key, JSON.stringify(dismissedIds));
          }
        } catch {
          // ignore write failure
        }

        return next;
      });
    },
    [memberId],
  );

  const visiblePeople = useMemo(() => {
    if (!serverPeople || !visibleIds) return serverPeople ?? [];
    return serverPeople.filter((person) => visibleIds.includes(person.userId));
  }, [serverPeople, visibleIds]);

  return { visiblePeople, dismiss };
}
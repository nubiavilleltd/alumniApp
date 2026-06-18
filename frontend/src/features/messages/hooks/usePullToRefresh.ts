import { useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<unknown>;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 72,
  maxPull = 96,
  disabled = false,
}: UsePullToRefreshOptions) {
  const startY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function triggerRefresh() {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }

  return {
    pullDistance,
    isRefreshing,
    isArmed: pullDistance >= threshold,
    bind: {
      onTouchStart: (event: React.TouchEvent) => {
        if (disabled || isRefreshing || window.scrollY > 0) return;
        startY.current = event.touches[0]?.clientY ?? null;
      },
      onTouchMove: (event: React.TouchEvent) => {
        if (disabled || isRefreshing || startY.current === null || window.scrollY > 0) return;

        const delta = event.touches[0].clientY - startY.current;
        if (delta <= 0) {
          setPullDistance(0);
          return;
        }

        event.preventDefault();
        setPullDistance(Math.min(delta * 0.45, maxPull));
      },
      onTouchEnd: async () => {
        if (startY.current === null) return;

        const shouldRefresh = pullDistance >= threshold;
        startY.current = null;
        setPullDistance(0);

        if (shouldRefresh) {
          await triggerRefresh();
        }
      },
      onTouchCancel: () => {
        startY.current = null;
        setPullDistance(0);
      },
    },
  };
}

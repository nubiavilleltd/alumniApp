// src/shared/contexts/BreadcrumbContext.tsx
//
// Context that lets dynamic pages override the auto-generated breadcrumb
// in RootLayout. Pages with dynamic content (event titles, project names,
// order numbers, etc.) call `useBreadcrumbOverride([...])` and the root
// layout will render their trail instead of the URL-derived one.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Crumb } from '@/shared/components/ui/Breadcrumbs';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OverrideState {
  /** The pathname this override applies to. Guards against stale overrides. */
  pathname: string;
  /** The override trail, or null if the page has not provided items yet. */
  items: Crumb[] | null;
  /**
   * True once the current page has called `useBreadcrumbOverride`.
   * Distinguishes "page hasn't decided yet" (→ show loader)
   * from "page decided to fall back to auto" (→ show auto trail).
   */
  hasReported: boolean;
}

interface BreadcrumbContextValue {
  state: OverrideState;
  setOverride: (entry: OverrideState) => void;
  clearOverride: (pathname: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OverrideState>({
    pathname: '',
    items: null,
    hasReported: false,
  });

  const setOverride = useCallback((entry: OverrideState) => {
    setState(entry);
  }, []);

  const clearOverride = useCallback((pathname: string) => {
    setState((prev) =>
      prev.pathname === pathname
        ? { pathname, items: null, hasReported: false }
        : prev
    );
  }, []);

  const value = useMemo(
    () => ({ state, setOverride, clearOverride }),
    [state, setOverride, clearOverride]
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// ─── Consumer hook (used by RootLayout) ───────────────────────────────────────

/**
 * Internal — used by RootLayout to read the current override.
 * Pages should use `useBreadcrumbOverride` instead.
 */
export function useBreadcrumbContext(): BreadcrumbContextValue {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error(
      'useBreadcrumbContext must be used within a <BreadcrumbProvider>'
    );
  }
  return ctx;
}

// ─── Public hook (used by pages) ──────────────────────────────────────────────

/**
 * Pages with dynamic breadcrumbs call this hook.
 *
 * - Pass an array of `Crumb` items to override the auto trail.
 * - Pass `null` to fall back to the auto trail.
 * - Do NOT conditionally call this hook (respect Rules of Hooks).
 *   Call it unconditionally, and pass `null` when data isn't ready yet
 *   if you want the auto trail shown.
 *
 * The items array doesn't need to be memoized — the hook uses a
 * serialized key to avoid infinite loops.
 *
 * Example:
 *   const items = event ? [
 *     { label: 'Home', href: ROUTES.HOME },
 *     { label: 'Events', href: ROUTES.EVENTS.ROOT },
 *     { label: event.title },
 *   ] : null;
 *
 *   useBreadcrumbOverride(items);
 */
export function useBreadcrumbOverride(items: Crumb[] | null) {
  const ctx = useContext(BreadcrumbContext);

  // Silently no-op if used outside the provider (e.g. isolated tests)
  if (!ctx) return;

  const { setOverride, clearOverride } = ctx;
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';

  // Serialize items so that inline arrays don't cause infinite loops.
  const itemsKey = items ? JSON.stringify(items) : '__null__';

  useEffect(() => {
    setOverride({ pathname, items, hasReported: true });
    return () => clearOverride(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, itemsKey]);
}
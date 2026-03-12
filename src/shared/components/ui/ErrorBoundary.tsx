import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Icon } from '@iconify/react';
import { type ReactNode } from 'react';

// ─── Default Fallback UI ──────────────────────────────────────────────────────
function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  const err = error as Error;
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <Icon icon="mdi:alert-circle-outline" className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-gray-800 font-semibold text-base mb-1">Something went wrong</h3>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-6">
        {err?.message ?? 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          <Icon icon="mdi:refresh" className="w-4 h-4" />
          Try Again
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = '/')}
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-500 text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

// ─── Section Fallback UI ──────────────────────────────────────────────────────
function SectionFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
      <Icon icon="mdi:alert-outline" className="w-4 h-4" />
      <span>Failed to load this section.</span>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="text-primary-500 hover:underline text-sm font-semibold ml-1"
      >
        Retry
      </button>
    </div>
  );
}

// ─── Page-level Error Boundary ────────────────────────────────────────────────
export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={DefaultFallback}
      onError={(error, info) => {
        // 🔴 TODO: send to error reporting service e.g. Sentry
        console.error('ErrorBoundary caught:', error, info.componentStack);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// ─── Section-level Error Boundary ────────────────────────────────────────────
export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return <ReactErrorBoundary FallbackComponent={SectionFallback}>{children}</ReactErrorBoundary>;
}

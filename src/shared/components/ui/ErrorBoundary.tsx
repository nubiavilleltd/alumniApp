// import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
// import { Icon } from '@iconify/react';
// import { type ReactNode } from 'react';

// // ─── Default Fallback UI ──────────────────────────────────────────────────────
// function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
//   const err = error as Error;
//   return (
//     <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
//       <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
//         <Icon icon="mdi:alert-circle-outline" className="w-8 h-8 text-red-400" />
//       </div>
//       <h3 className="text-gray-800 font-semibold text-base mb-1">Something went wrong</h3>
//       <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-6">
//         {err?.message ?? 'An unexpected error occurred. Please try again.'}
//       </p>
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={resetErrorBoundary}
//           className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
//         >
//           <Icon icon="mdi:refresh" className="w-4 h-4" />
//           Try Again
//         </button>
//         <button
//           type="button"
//           onClick={() => (window.location.href = '/')}
//           className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-500 text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
//         >
//           Go Home
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Section Fallback UI ──────────────────────────────────────────────────────
// function SectionFallback({ resetErrorBoundary }: FallbackProps) {
//   return (
//     <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
//       <Icon icon="mdi:alert-outline" className="w-4 h-4" />
//       <span>Failed to load this section.</span>
//       <button
//         type="button"
//         onClick={resetErrorBoundary}
//         className="text-primary-500 hover:underline text-sm font-semibold ml-1"
//       >
//         Retry
//       </button>
//     </div>
//   );
// }

// // ─── Page-level Error Boundary ────────────────────────────────────────────────
// export function ErrorBoundary({ children }: { children: ReactNode }) {
//   return (
//     <ReactErrorBoundary
//       FallbackComponent={DefaultFallback}
//       onError={(error, info) => {
//         // 🔴 TODO: send to error reporting service e.g. Sentry
//         console.error('ErrorBoundary caught:', error, info.componentStack);
//       }}
//     >
//       {children}
//     </ReactErrorBoundary>
//   );
// }

// // ─── Section-level Error Boundary ────────────────────────────────────────────
// export function SectionErrorBoundary({ children }: { children: ReactNode }) {
//   return <ReactErrorBoundary FallbackComponent={SectionFallback}>{children}</ReactErrorBoundary>;
// }

/**
 * ============================================================================
 * ENHANCED ERROR BOUNDARY
 * ============================================================================
 *
 * User-friendly error display that hides technical details
 * Provides contextual actions based on error type
 *
 * ============================================================================
 */

import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Icon } from '@iconify/react';
import { type ReactNode } from 'react';
import { getUserFriendlyError, logError } from '@/lib/errors/errorUtils';

// ─── Enhanced Default Fallback UI ─────────────────────────────────────────────
function EnhancedFallback({ error, resetErrorBoundary }: FallbackProps) {
  const friendlyError = getUserFriendlyError(error);

  // Different icons for different error types
  const getIcon = () => {
    switch (friendlyError.type) {
      case 'NETWORK':
        return 'mdi:wifi-off';
      case 'AUTH':
        return 'mdi:lock-alert-outline';
      case 'NOT_FOUND':
        return 'mdi:file-search-outline';
      case 'SERVER':
        return 'mdi:server-off';
      default:
        return 'mdi:alert-circle-outline';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <Icon icon={getIcon()} className="w-10 h-10 text-red-400" />
      </div>

      {/* Title */}
      <h3 className="text-gray-800 font-bold text-lg mb-2">{friendlyError.title}</h3>

      {/* Message */}
      <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-6">{friendlyError.message}</p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {friendlyError.canRetry && (
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
            Try Again
          </button>
        )}

        {friendlyError.type === 'AUTH' ? (
          <button
            type="button"
            onClick={() => (window.location.href = '/auth/login')}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <Icon icon="mdi:login" className="w-4 h-4" />
            Log In
          </button>
        ) : (
          <button
            type="button"
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Icon icon="mdi:home-outline" className="w-4 h-4" />
            Go Home
          </button>
        )}
      </div>

      {/* Development mode: Show technical details */}
      {import.meta.env.DEV && (
        <details className="mt-8 max-w-2xl w-full">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 mb-2">
            🔧 Technical Details (Dev Only)
          </summary>
          <pre className="text-left text-xs bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-40">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

// ─── Section Fallback UI ──────────────────────────────────────────────────────
function SectionFallback({ error, resetErrorBoundary }: FallbackProps) {
  const friendlyError = getUserFriendlyError(error);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center bg-gray-50 rounded-2xl border border-gray-100">
      <Icon icon="mdi:alert-outline" className="w-6 h-6 text-gray-400" />
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">{friendlyError.title}</p>
        <p className="text-xs text-gray-500 max-w-sm">{friendlyError.message}</p>
      </div>
      {friendlyError.canRetry && (
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="text-primary-500 hover:text-primary-600 hover:underline text-sm font-semibold mt-1"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// ─── Page-level Error Boundary ────────────────────────────────────────────────
export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={EnhancedFallback}
      onError={(error, info) => {
        logError(error, 'ErrorBoundary');
        // Log component stack in development
        if (import.meta.env.DEV) {
          console.error('Component Stack:', info.componentStack);
        }
      }}
      onReset={() => {
        // Optional: Clear any error state, reset queries, etc.
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// ─── Section-level Error Boundary ─────────────────────────────────────────────
export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={SectionFallback}
      onError={(error) => {
        logError(error, 'SectionErrorBoundary');
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

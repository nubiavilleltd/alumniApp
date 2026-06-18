/**
 * ============================================================================
 * TOAST NOTIFICATION SYSTEM
 * ============================================================================
 *
 * Lightweight toast notifications for errors and success messages
 * Use instead of alert() for better UX
 *
 * ============================================================================
 */

import { create } from 'zustand';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

// ─── Toast Store ──────────────────────────────────────────────────────────────
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));

// ─── Toast Component ──────────────────────────────────────────────────────────
function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast);

  const config = {
    success: {
      icon: 'mdi:check-circle',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
    },
    error: {
      icon: 'mdi:alert-circle',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
    },
    warning: {
      icon: 'mdi:alert',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-800',
    },
    info: {
      icon: 'mdi:information',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
    },
  }[toast.type];

  return (
    <div
      className={`flex items-start gap-3 ${config.bgColor} border ${config.borderColor} rounded-xl px-4 py-3 shadow-lg max-w-md animate-slideIn`}
      role="alert"
    >
      <Icon icon={config.icon} className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`font-semibold text-sm ${config.textColor} mb-0.5`}>{toast.title}</p>
        )}
        <p className={`text-sm ${config.textColor}`}>{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close"
      >
        <Icon icon="mdi:close" className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────
export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}

// ─── Toast Helpers ────────────────────────────────────────────────────────────
export const toast = {
  success: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'success',
      title,
      message,
      duration: 4000,
    });
  },

  error: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'error',
      title,
      message,
      duration: 6000,
    });
  },

  warning: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'warning',
      title,
      message,
      duration: 5000,
    });
  },

  info: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'info',
      title,
      message,
      duration: 4000,
    });
  },

  // For API errors - automatically formats
  fromError: (error: any) => {
    const message =
      error.message || error.response?.data?.message || 'An unexpected error occurred';

    useToastStore.getState().addToast({
      type: 'error',
      message,
      duration: 6000,
    });
  },
};

// Add animation styles to your global CSS:
/*
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
*/

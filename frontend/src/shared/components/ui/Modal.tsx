import { X } from 'lucide-react';
import { useEffect } from 'react';

// ─── Reusable Modal Shell ─────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        {/* Modal panel — stop click propagation so clicking inside doesn't close */}
        <div
          className="relative my-auto w-full max-w-lg overflow-visible rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 pb-4 pt-6">
            <h2 className="min-w-0 whitespace-normal break-words text-xl font-bold text-primary-500 [overflow-wrap:anywhere]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-lg font-semibold leading-none text-gray-500 transition-colors hover:text-gray-800"
              aria-label="Close modal"
            >
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

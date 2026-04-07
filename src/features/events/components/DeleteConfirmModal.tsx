// features/events/components/DeleteConfirmModal.tsx
//
// Reusable delete confirmation modal used by EventCard, EditEventPage,
// and EventDetailPage. Previously duplicated in all three places.

import { Icon } from '@iconify/react';

interface DeleteConfirmModalProps {
  /** Name of the item being deleted — shown in the confirmation text */
  title: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Override the description text if needed */
  description?: string;
}

export function DeleteConfirmModal({
  title,
  isDeleting,
  onConfirm,
  onCancel,
  description,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Delete Event?</h3>
            <p className="text-gray-600 text-sm">
              {description ?? (
                <>
                  Are you sure you want to delete <span className="font-semibold">{title}</span>?
                  This action cannot be undone.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isDeleting && <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />}
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

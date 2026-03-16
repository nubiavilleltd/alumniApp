import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { useEventRegistration } from '../hooks/useEventRegistration';
import type { Event } from '../types/event.types';

interface RegisterEventModalProps {
  event: Event | null;
  onClose: () => void;
}

export function RegisterEventModal({ event, onClose }: RegisterEventModalProps) {
  const currentUser = useAuthStore((state) => state.user);
  const { register } = useEventRegistration(event?.id || '');

  const [guestCount, setGuestCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !event) {
      console.error('User must be logged in to register');
      return;
    }

    // Register via event store
    // TODO: When backend is ready, this will call:
    // await apiClient.post(`/events/${event.id}/register`, { guestCount })
    register(guestCount);

    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset state after modal closes
    setTimeout(() => {
      setGuestCount(0);
      setSubmitted(false);
    }, 300);
  };

  if (!event) return null;

  return (
    <Modal isOpen={!!event} onClose={handleClose} title="Confirm Registration">
      {submitted ? (
        <div className="text-center py-8">
          <Icon icon="mdi:check-circle" className="w-14 h-14 text-primary-500 mx-auto mb-4" />
          <h3 className="text-gray-900 font-bold text-lg mb-2">Registration Successful!</h3>
          <p className="text-gray-500 text-sm mb-6">
            You have successfully registered for{' '}
            <span className="font-semibold">{event.title}</span>.
          </p>

          {/* Show virtual link if event is virtual */}
          {event.isVirtual && event.virtualLink && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-xs font-semibold text-blue-900 mb-2">Virtual Event Link:</p>
              <a
                href={event.virtualLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 underline break-all"
              >
                {event.virtualLink}
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-2.5 rounded-full transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* User Info (Read-only) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Your Information
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-700">{currentUser?.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-700">{currentUser?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Class:</span>
                <span className="font-medium text-gray-700">{currentUser?.graduationYear}</span>
              </div>
            </div>
          </div>

          {/* Guest Count (if event allows guests) */}
          {event.allowGuests && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <div className="relative">
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-primary-400 cursor-pointer transition-colors"
                >
                  <option value={0}>Just me (no guests)</option>
                  <option value={1}>Me + 1 guest</option>
                  <option value={2}>Me + 2 guests</option>
                </select>
                <Icon
                  icon="mdi:chevron-down"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {event.allowGuests
                  ? 'This event allows guests'
                  : 'No guests allowed for this event'}
              </p>
            </div>
          )}

          {/* Event Details Summary */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Event Details
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Icon icon="mdi:calendar-outline" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {event.startTime && ` at ${event.startTime}`}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Icon icon="mdi:map-marker-outline" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
              {event.attire && (
                <div className="flex items-start gap-2">
                  <Icon icon="mdi:hanger" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{event.attire}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-full transition-colors"
          >
            Confirm Registration
          </button>
        </form>
      )}
    </Modal>
  );
}

// Legacy export for backward compatibility
export interface RegisterEventModalEvent {
  slug: string;
  title: string;
}

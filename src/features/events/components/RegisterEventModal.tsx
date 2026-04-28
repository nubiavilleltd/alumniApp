// features/events/components/RegisterEventModal.tsx

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { useEventRegistration } from '../hooks/useEventRegistration';
import type { Event } from '../types/event.types';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

interface RegisterEventModalProps {
  event: Event | null;
  onClose: () => void;
}

export function RegisterEventModal({ event, onClose }: RegisterEventModalProps) {
  // const currentUser = useAuthStore((state) => state.user);
  const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUser();
  const { register, isLoading } = useEventRegistration(event?.id || '');

  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe'>('going');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!currentUser || !event) {
  //     console.error('User must be logged in to register');
  //     setError('You must be logged in to register for events');
  //     return;
  //   }

  //   try {
  //     // Register with status 'going' (backend supports 'going', 'maybe', 'not_going')
  //     register('going');
  //     setSubmitted(true);
  //   } catch (err) {
  //     setError('Failed to register. Please try again.');
  //     console.error('Registration error:', err);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser || !event) {
      setError('You must be logged in to register for events');
      return;
    }

    try {
      await register({
        status: rsvpStatus,
        additionalInfo,
      });

      setSubmitted(true);
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    }
  };

  // const handleClose = () => {
  //   onClose();
  //   // Reset state after modal closes
  //   setTimeout(() => {
  //     setSubmitted(false);
  //     setError(null);
  //   }, 300);
  // };

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setRsvpStatus('going');
      setAdditionalInfo('');
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
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

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

          {/* RSVP Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Will you attend?</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                {/* <input
                  type="radio"
                  name="rsvpStatus"
                  value="going"
                  defaultChecked
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                /> */}
                <input
                  type="radio"
                  name="rsvpStatus"
                  value="going"
                  checked={rsvpStatus === 'going'}
                  onChange={() => setRsvpStatus('going')}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                />
                <div>
                  <span className="font-medium text-gray-700">Yes, I'm going</span>
                  <p className="text-xs text-gray-500">I'll be there</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                {/* <input
                  type="radio"
                  name="rsvpStatus"
                  value="maybe"
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                /> */}

                <input
                  type="radio"
                  name="rsvpStatus"
                  value="maybe"
                  checked={rsvpStatus === 'maybe'}
                  onChange={() => setRsvpStatus('maybe')}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-400"
                />
                <div>
                  <span className="font-medium text-gray-700">Maybe</span>
                  <p className="text-xs text-gray-500">I'm not sure yet</p>
                </div>
              </label>
            </div>
          </div>

          {/* Note about guests - backend doesn't support guest count yet */}
          {event.allowGuests && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Icon icon="mdi:information-outline" className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  This event allows guests. You can bring guests with you.
                </p>
              </div>
            </div>
          )}

          <TextareaInput
            label="Additional Info"
            id="additionalInfo"
            rows={5}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />

          {/* <TextareaInput
                    label="Additional Info"
                    id="residentialAddress"
                    rows={5}
                    placeholder=""
                    // error={detailForm.formState.errors.residentialAddress?.message}
                    // {...detailForm.register('residentialAddress')}
                  /> */}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                Registering...
              </span>
            ) : (
              'Confirm Registration'
            )}
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

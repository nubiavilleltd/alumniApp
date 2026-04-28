// features/events/pages/EventDetailPage.tsx
// REDESIGNED: Better visual hierarchy, separated status badges from action buttons,
// cleaner responsive layout with intuitive positioning

import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useEvent, useDeleteEvent } from '../hooks/useEvents';
import { useEventRegistration, useEventAttendeeCount } from '../hooks/useEventRegistration';
import { useCancelRegistration } from '../hooks/useEvents';
import { toast } from '@/shared/components/ui/Toast';
import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { renderMarkdown } from '@/data/content';

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(targetDate: string, startTime?: string) {
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(
    null,
  );

  useEffect(() => {
    const target = (() => {
      const [y, mo, d] = targetDate.split('-').map(Number);
      const [h = 0, mi = 0] = (startTime ?? '00:00').split(':').map(Number);
      return new Date(y, mo - 1, d, h, mi, 0);
    })();

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining(null);
        return;
      }
      const s = Math.floor(diff / 1000);
      setRemaining({
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, startTime]);

  return remaining;
}

function CountdownBanner({ date, startTime }: { date: string; startTime?: string }) {
  const t = useCountdown(date, startTime);
  if (!t) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-primary-500 text-white rounded-2xl px-6 py-4 inline-flex items-center gap-5 shadow-md">
      <div>
        <p className="text-xs font-semibold text-primary-100 uppercase tracking-wide mb-1">
          Event starts in
        </p>

        <div className="flex items-end gap-3 text-2xl font-bold tabular-nums">
          {t.d > 0 && (
            <span>
              <span>{t.d}</span>
              <span className="text-sm font-normal text-primary-200 ml-1">d</span>
            </span>
          )}

          <span>
            <span>{pad(t.h)}</span>
            <span className="text-sm font-normal text-primary-200 ml-1">h</span>
          </span>

          <span>
            <span>{pad(t.m)}</span>
            <span className="text-sm font-normal text-primary-200 ml-1">m</span>
          </span>

          <span>
            <span>{pad(t.s)}</span>
            <span className="text-sm font-normal text-primary-200 ml-1">s</span>
          </span>
        </div>
      </div>

      <Icon icon="mdi:timer-outline" className="w-10 h-10 text-primary-200 flex-shrink-0" />
    </div>
  );
}

// ─── Unregister confirmation ──────────────────────────────────────────────────

function UnregisterConfirmModal({
  eventTitle,
  isLoading,
  onConfirm,
  onCancel,
}: {
  eventTitle: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Cancel Registration?</h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to unregister from{' '}
              <span className="font-semibold">{eventTitle}</span>?
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Keep Registration
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading && <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />}
            Yes, Unregister
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function EventDetailSkeleton() {
  return (
    <div className="container-custom py-8 animate-pulse">
      <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-2xl mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function EventDetailPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const currentUser = useIdentityStore((state) => state.user);
  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  const [showActionMenu, setShowActionMenu] = useState(false);

  const { data: event, isLoading, error } = useEvent(slug);
  const deleteEvent = useDeleteEvent();
  const cancelMutation = useCancelRegistration();

  const { isRegistered } = useEventRegistration(event?.id ?? '');
  const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event ?? null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);

  const markdown = useMemo(() => {
    if (!event?.content) return '';
    try {
      return renderMarkdown(event.content);
    } catch {
      return event.content ?? '';
    }
  }, [event?.content]);

  if (isLoading)
    return (
      <div className="section">
        <EventDetailSkeleton />
      </div>
    );

  if (error || !event) {
    return (
      <section className="section">
        <div className="container-custom text-center py-12">
          <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-3">Event not found</h1>
          <p className="text-gray-600 mb-6">This event doesn't exist or has been removed.</p>
          <div className="flex gap-4 justify-center">
            <AppLink href={EVENT_ROUTES.ROOT} className="btn btn-primary">
              Back to Events
            </AppLink>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const isPast = new Date(event.date) < new Date();
  const isCancelled = event.status === 'cancelled';
  const isUpcoming = !isPast && !isCancelled;

  const handleDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: () => navigate(EVENT_ROUTES.ROOT),
      onError: (err: any) => {
        setShowDeleteModal(false);
        toast.fromError(err);
      },
    });
  };

  const handleUnregister = async () => {
    try {
      await cancelMutation.mutateAsync(event.id);
      toast.success('You have been unregistered from this event.');
    } catch (err: any) {
      toast.fromError(err);
    } finally {
      setShowUnregisterModal(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: event.title, url }).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success('Link copied!'))
        .catch(() => {});
    }
  };

  // Format date range
  const dateDisplay = (() => {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = new Date(event.date).toLocaleDateString('en-US', opts);
    return event.startTime ? `${start}` : start;
  })();

  return (
    <>
      <SEO title={event.title} description={event.description} />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-6">
          {/* ══════════════════════════════════════════════════════════
              HERO IMAGE
              ═══════════════════════════════════════════════════════ */}
          {event.image ? (
            <div
              className="w-full rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-sm"
              style={{ maxHeight: 360 }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
                style={{ maxHeight: 360 }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6 shadow-sm">
              <Icon icon="mdi:calendar-month-outline" className="w-16 h-16 text-primary-300" />
            </div>
          )}

          <div className="max-w-5xl">
            {/* ─── Back Navigation ───────────────────────── */}
            <div className="mb-4">
              <AppLink
                href={EVENT_ROUTES.ROOT}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                <Icon icon="mdi:arrow-left" className="w-4 h-4" />
                Back to Events
              </AppLink>
            </div>

            {/* ─── Status Badges ───────────────────────── */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {isPast && !isCancelled && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  <Icon icon="mdi:calendar-check-outline" className="w-3.5 h-3.5" />
                  Past Event
                </span>
              )}

              {event.featured && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  <Icon icon="mdi:star" className="w-3.5 h-3.5" />
                  Featured
                </span>
              )}

              {isRegistered && isUpcoming && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                  <Icon icon="mdi:check-circle" className="w-3.5 h-3.5" />
                  You're Registered
                </span>
              )}

              {isRegistered && isPast && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                  <Icon icon="mdi:check-circle" className="w-3.5 h-3.5" />
                  You Attended
                </span>
              )}

              {!isCancelled && isFull && !isRegistered && isUpcoming && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                  <Icon icon="mdi:alert-circle-outline" className="w-3.5 h-3.5" />
                  Event Full
                </span>
              )}

              {isCancelled && (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold border border-red-200">
                  <Icon icon="mdi:cancel" className="w-4 h-4" />
                  Event Cancelled
                </span>
              )}
            </div>

            {/* ─── Title + Actions ───────────────────────── */}
            <div className="flex items-start justify-between gap-4 mb-4 relative">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {event.title}
              </h1>

              {/* ─── Desktop Actions ───────────────── */}
              <div className="hidden sm:flex items-center gap-2">
                {/* Share */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  <Icon icon="mdi:share-variant" className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Edit & Delete for Admin - Desktop */}
                {isAdmin && (
                  <>
                    <AppLink
                      href={EVENT_ROUTES.EDIT(event.id)}
                      className="inline-flex items-center gap-2 border border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      <Icon icon="mdi:pencil" className="w-4 h-4" />
                      Edit
                    </AppLink>

                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center gap-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      <Icon icon="mdi:delete" className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* ─── Mobile Actions (Share + Menu) ───────────────── */}
              <div className="sm:hidden flex items-center gap-2">
                {/* Share button - mobile */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm px-3 py-2 rounded-full transition-colors shadow-sm"
                >
                  <Icon icon="mdi:share-variant" className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* 3-dot Menu for Edit/Delete on mobile */}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu((prev) => !prev)}
                      className="p-2 rounded-full border border-gray-300 bg-white shadow-sm"
                    >
                      <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                    </button>

                    {showActionMenu && (
                      <>
                        {/* Backdrop for closing when clicking outside */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActionMenu(false)}
                        />

                        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                          <AppLink
                            href={EVENT_ROUTES.EDIT(event.id)}
                            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50"
                            onClick={() => setShowActionMenu(false)}
                          >
                            <Icon icon="mdi:pencil" className="w-4 h-4" />
                            Edit
                          </AppLink>

                          <button
                            onClick={() => {
                              setShowDeleteModal(true);
                              setShowActionMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Icon icon="mdi:delete" className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ─── Cancel Registration Button (Separate section below) ───────────────── */}
            {!isPast && !isCancelled && isLoggedIn && isRegistered && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowUnregisterModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-red-300 bg-white hover:bg-red-50 text-red-600 font-semibold text-sm px-6 py-3 rounded-full transition-colors"
                >
                  <Icon icon="mdi:close-circle-outline" className="w-4 h-4" />
                  Cancel Registration
                </button>
              </div>
            )}

            {/* ─── Register Button (if not registered) ───────────────── */}
            {!isPast && !isCancelled && isLoggedIn && !isRegistered && !isFull && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
                >
                  <Icon icon="mdi:calendar-plus" className="w-4 h-4" />
                  Register for Event
                </button>
              </div>
            )}

            {/* ─── Sign in to Register (if not logged in) ───────────────── */}
            {!isPast && !isCancelled && !isLoggedIn && !isFull && (
              <div className="mb-6">
                <AppLink
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
                >
                  <Icon icon="mdi:login" className="w-4 h-4" />
                  Sign in to Register
                </AppLink>
              </div>
            )}

            {/* ─── Event Details ───────────────────────── */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 text-gray-600 text-sm mb-6">
                {event.location && (
                  <span className="flex items-center gap-2">
                    <Icon icon="mdi:map-marker" className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-medium">{event.location}</span>
                  </span>
                )}

                <span className="flex items-center gap-2">
                  <Icon icon="mdi:calendar-clock" className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">
                    {dateDisplay}
                    {event.startTime && ` · ${event.startTime}`}
                    {event.endTime && ` – ${event.endTime}`}
                  </span>
                </span>

                {!isCancelled && attendeeCount > 0 && (
                  <span className="flex items-center gap-2">
                    <Icon
                      icon="mdi:account-group"
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                    />
                    <span className="font-medium">
                      {capacity ? `${attendeeCount}/${capacity}` : attendeeCount} attending
                    </span>
                    {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
                      <span className="text-orange-600 font-semibold">
                        · {spotsLeft} spots left
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* ─── Countdown ───────────────────────── */}
              {isUpcoming && (
                <div className="mb-6">
                  <CountdownBanner date={event.date} startTime={event.startTime} />
                </div>
              )}

              {/* ─── Event Content ───────────────────────── */}
              {markdown && (
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-strong:text-gray-900 mb-8 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: markdown }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegisterEventModal
        event={showRegisterModal ? event : null}
        onClose={() => setShowRegisterModal(false)}
      />

      {showDeleteModal && (
        <DeleteConfirmModal
          title={event.title}
          isDeleting={deleteEvent.isPending}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showUnregisterModal && (
        <UnregisterConfirmModal
          eventTitle={event.title}
          isLoading={cancelMutation.isPending}
          onConfirm={handleUnregister}
          onCancel={() => setShowUnregisterModal(false)}
        />
      )}
    </>
  );
}

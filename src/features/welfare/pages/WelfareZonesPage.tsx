// features/welfare/pages/WelfareZonesPage.tsx
// Route: /welfare/zones
// UPDATED: Replaced static data with live data from useZones() hook.
// Skeleton cards shown while fetching. Error state with retry.
// Responsive: 1-col mobile → 2-col desktop. Matches the design in the screenshot exactly.

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { DonationButton } from '@/shared/components/ui/DonationButton';
import { useStartDirectConversation } from '@/features/messages/hooks/useStartDirectConversation';
import { useZones } from '../hooks/useZones';
import { WelfareZone } from '../types/welfare.type';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';

// ─── Accent colours ───────────────────────────────────────────────────────────
// Cycles through the design palette from the screenshot.
// Keyed by index so any number of zones from the backend gets a colour.

const ACCENT_COLORS = [
  'bg-green-300',
  'bg-purple-300',
  'bg-orange-200',
  'bg-sky-300',
  'bg-rose-200',
  'bg-yellow-200',
  'bg-stone-300',
  'bg-slate-300',
  'bg-green-200',
  'bg-teal-200',
  'bg-indigo-200',
  'bg-pink-200',
];

function accentFor(index: number): string {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function ZoneCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex animate-pulse">
      {/* Accent strip */}
      <div className="w-2.5 flex-shrink-0 bg-gray-200" />

      <div className="flex-1 p-5 space-y-4">
        {/* Zone name + areas */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
          <div className="h-5 w-16 bg-gray-200 rounded flex-shrink-0" />
          <div className="mt-2 sm:mt-0 space-y-2 flex-1">
            <div className="h-3.5 bg-gray-200 rounded w-full" />
            <div className="h-3.5 bg-gray-200 rounded w-4/5" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Coordinator */}
        <div className="space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-40" />
          <div className="flex gap-5">
            <div className="h-3 bg-gray-200 rounded w-28" />
            <div className="h-3 bg-gray-200 rounded w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Zone card ────────────────────────────────────────────────────────────────
function ZoneCard({
  zone,
  index,
  currentUserEmail,
}: {
  zone: WelfareZone;
  index: number;
  currentUserEmail?: string;
}) {
  const isTheSameUserAsCoordinator = currentUserEmail === zone?.coordinator?.email;

  const hasCoordinator = zone.coordinator !== null;
  const coordinatorMemberId =
    zone.coordinator?.userId != null ? String(zone.coordinator.userId) : undefined;
  const canMessageCoordinator = Boolean(coordinatorMemberId);
  const { startDirectConversation } = useStartDirectConversation();
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  async function handleMessageCoordinator() {
    if (!zone.coordinator || !coordinatorMemberId) return;

    setIsStartingConversation(true);

    try {
      await startDirectConversation({
        participantMemberId: coordinatorMemberId,
        topic: `Welfare enquiry for ${zone.zone}`,
        draftMessage: `Hello ${zone.coordinator.firstName || zone.coordinator.name}, I'm reaching out through the welfare page regarding ${zone.zone}. I would appreciate your guidance and support.`,
        recipientProfile: {
          fullName: zone.coordinator.name,
          avatar: zone.coordinator.avatar ?? undefined,
          headline: `Welfare coordinator for ${zone.zone}`,
          profileHref: `/alumni/profiles/${coordinatorMemberId}`,
        },
      });
    } finally {
      setIsStartingConversation(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
      {/* Coloured left accent strip */}
      <div className={`w-2.5 flex-shrink-0 ${accentFor(index)}`} />

      {/* Content */}
      <div className="flex-1 p-5">
        {/* Zone name */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 mb-4">
          <span className="font-bold text-gray-900 text-base whitespace-nowrap flex-shrink-0">
            {zone.zone}
          </span>

          <span>{zone.cities}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-3" />

        <div className="flex-col justify-between items-center sm:flex-row">
          {/* Coordinator info */}
          <div className="space-y-1">
            {hasCoordinator ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Coordinator: {zone.coordinator!.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
                  {zone.coordinator!.phone && (
                    <span className="flex items-center gap-1.5">
                      <Icon icon="mdi:phone-outline" className="w-3.5 h-3.5 text-gray-400" />
                      {zone.coordinator!.phone}
                    </span>
                  )}
                  {zone.coordinator!.email && (
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Icon
                        icon="mdi:email-outline"
                        className="w-3.5 h-3.5 text-gray-400 shrink-0"
                      />
                      <span className="break-all">{zone.coordinator!.email}</span>
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">No coordinator assigned yet</p>
            )}
          </div>

          {/* Send Message button */}
          {hasCoordinator && canMessageCoordinator && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  void handleMessageCoordinator();
                }}
                disabled={isStartingConversation || isTheSameUserAsCoordinator}
                title={isTheSameUserAsCoordinator ? 'You cannot message yourself' : ''}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary-400 text-primary-500 text-sm font-medium hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                {isStartingConversation ? 'Opening chat...' : 'Send Message'}
              </button>
            </div>
          )}

          {hasCoordinator && !canMessageCoordinator && (
            <div className="mt-4 flex justify-end">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 text-gray-400 text-sm font-medium"
                title="This coordinator does not have an in-app messaging profile yet."
              >
                Send Message
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <Icon icon="mdi:alert-circle-outline" className="w-7 h-7 text-red-400" />
      </div>
      <div>
        <p className="text-gray-700 font-semibold text-base">Failed to load welfare zones</p>
        <p className="text-gray-400 text-sm mt-1">Please check your connection and try again.</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 px-5 py-2 rounded-full border border-primary-400 text-primary-500 text-sm font-medium hover:bg-primary-50 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WelfareZonesPage() {
  const { data: zones, isLoading, isError, refetch } = useZones();
  const {
    data: currentUser,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useCurrentUser();

  const skeletonCount = 6;

  // ── Derived state (clean + readable) ───────────────────────────────
  const isZonesLoading = isLoading;
  const hasZonesError = isError;
  const hasProfileError = isProfileError;

  const showSkeletons = isZonesLoading;

  const showError = hasZonesError || hasProfileError;

  const showEmptyState = !isZonesLoading && !hasZonesError && zones && zones.length === 0;

  const showZones = !isZonesLoading && !hasZonesError && zones && zones.length > 0;

  return (
    <>
      <SEO
        title="Welfare Zones"
        description="Find your welfare zone coordinator and get support in your area."
      />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-8 sm:py-10">
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-start justify-between mb-7 gap-4">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Welfare Zones</h1>
          </div>

          {/* ── Grid ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ⚠️ Non-blocking profile warning */}
            {hasProfileError && !hasZonesError && (
              <div className="col-span-full text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                Some features may be limited (profile failed to load).
              </div>
            )}

            {/* 🧱 Loading (zones only) */}
            {showSkeletons &&
              Array.from({ length: skeletonCount }).map((_, i) => <ZoneCardSkeleton key={i} />)}

            {/* ❌ Error */}
            {showError && <ErrorState onRetry={refetch} />}

            {/* 📭 Empty */}
            {showEmptyState && (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                No welfare zones found.
              </div>
            )}

            {/* 📦 Data */}
            {showZones &&
              zones.map((zone, index) => (
                <ZoneCard
                  key={zone.zoneId}
                  zone={zone}
                  index={index}
                  currentUserEmail={currentUser?.email}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

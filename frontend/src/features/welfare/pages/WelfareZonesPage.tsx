// features/welfare/pages/WelfareZonesPage.tsx
// Route: /welfare/zones
// UPDATED: Replaced static data with live data from useZones() hook.
// Skeleton cards shown while fetching. Error state with retry.
// Responsive: 1-col mobile → 2-col desktop. Matches the design in the screenshot exactly.

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { useStartDirectConversation } from '@/features/messages/hooks/useStartDirectConversation';
import { useZones } from '../hooks/useZones';
import { WelfareZone } from '../types/welfare.type';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { Modal } from '@/shared/components/ui/Modal';

// ─── Zone accent colours ──────────────────────────────────────────────────────
// Matched to the Figma side-strip colours by zone label.

const ZONE_CARD_COLORS: Record<string, string> = {
  zone1: '#078E0040',
  zone2: '#E2CDFC',
  zone3a: '#FCDDC2',
  zone3b: '#FCDDC2',
  zone4: '#BFDDF2',
  zone5a: '#F1BFBF',
  zone5b: '#FFF0BF',
  zone5c: '#C5B4B0',
  zone6a: '#BFBFBF',
  zone6b: '#BFBFBF',
  zone7: '#DAEED9',
};

function normalizeZoneKey(zone: string): string {
  return zone.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function accentColorFor(zone: string): string {
  return ZONE_CARD_COLORS[normalizeZoneKey(zone)] ?? '#DAEED9';
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
function ZoneCard({ zone, currentUserEmail, zoneOfCurrentUser }: { zone: WelfareZone; currentUserEmail?: string, zoneOfCurrentUser: string }) {
  const [showZoneWarning, setShowZoneWarning] = useState(false);
  const isTheSameUserAsCoordinator = currentUserEmail === zone?.coordinator?.email;
  const isCurrentUserZone = zoneOfCurrentUser === zone.zone


  const hasCoordinator = zone.coordinator !== null;
  const coordinatorMemberId =
    zone.coordinator?.userId != null ? String(zone.coordinator.userId) : undefined;
  const canMessageCoordinator = Boolean(coordinatorMemberId);
  const { startDirectConversation } = useStartDirectConversation();
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  async function handleMessageCoordinator() {
    if (!zone.coordinator || !coordinatorMemberId) return;

    setIsStartingConversation(true);
    setShowZoneWarning(false); 

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

    // 2. NEW HANDLER: Decide whether to warn or message directly
  function handleSendMessageClick() {
    if (isCurrentUserZone) {
      // Same zone? Just message them.
      void handleMessageCoordinator();
    } else {
      // Outside zone? Show the warning modal.
      setShowZoneWarning(true);
    }
  }

  return (

    <>
       <div className={`relative flex min-h-[179px] w-full max-w-[636px] overflow-hidden rounded-[24px] bg-white shadow-sm md:h-[179px] transition-all ${isCurrentUserZone
        ? 'border-2 border-green-500 shadow-md ring-2 ring-green-500/20'
        : 'border border-gray-100'
      }`}>
      {/* Coloured left accent strip */}
      <div
        className="w-4 flex-shrink-0 self-stretch"
        style={{ backgroundColor: accentColorFor(zone.zone) }}
      />

      {/* Content */}
      <div className={`flex min-w-0 flex-1 flex-col ${isCurrentUserZone ? 'bg-green-50/30' : 'bg-white'}`}>
        {/* Zone name */}
        <div className="flex min-w-0 flex-col gap-2 px-6 py-6 sm:flex-row sm:items-start sm:gap-8 md:h-[104px]">

          {/* On mobile: This row holds Zone Name + Badge together */}
          <div className="flex items-center justify-between gap-2 sm:justify-start sm:w-[7.2rem] flex-shrink-0">
            <span className="whitespace-nowrap text-2xl font-semibold leading-[1.2] text-gray-900">
              {zone.zone}
            </span>

            {/* Badge: Shown here on mobile, hidden on desktop (sm:hidden) */}
            {isCurrentUserZone && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 sm:hidden">
                Your Zone
              </span>
            )}
          </div>

          {/* Cities */}
          <span className="min-w-0 flex-1 text-base font-semibold leading-[1.3] text-gray-600">
            {zone.cities}
          </span>

          {/* Badge: Shown here on desktop, hidden on mobile (hidden sm:inline-flex) */}
          {isCurrentUserZone && (
            <div className="hidden sm:flex flex-shrink-0 items-start pt-1">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                Your Zone
              </span>
            </div>
          )}

        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        <div className="flex flex-1 flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:min-h-0">
          {/* Coordinator info */}
          <div className="min-w-0 space-y-1">
            {hasCoordinator ? (
              <>
                <div className="flex items-center gap-2 text-base font-medium leading-tight text-gray-500">
                  <span>Coordinator: {zone.coordinator!.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-base font-medium leading-tight text-gray-500">
                  {zone.coordinator!.phone && (
                    <span className="flex items-center gap-1.5">
                      <Icon icon="mdi:phone-outline" className="h-4 w-4 text-gray-400" />
                      {zone.coordinator!.phone}
                    </span>
                  )}
                  {zone.coordinator!.email && (
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Icon icon="mdi:email-outline" className="h-4 w-4 shrink-0 text-gray-400" />
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
            <div className="flex flex-shrink-0 justify-end">
              <button
                type="button"
              onClick={handleSendMessageClick} 
                disabled={isStartingConversation || isTheSameUserAsCoordinator}
                title={isTheSameUserAsCoordinator ? 'You cannot message yourself' : ''}
                className="inline-flex min-h-9 min-w-[7.5rem] items-center justify-center gap-1.5 rounded-full border-2 border-primary-500 px-4 text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              >
                {isStartingConversation ? 'Opening chat...' : 'Send Message'}
              </button>
            </div>
          )}

          {hasCoordinator && !canMessageCoordinator && (
            <div className="flex flex-shrink-0 justify-end">
              <span
                className="inline-flex min-h-9 min-w-[7.5rem] items-center justify-center gap-1.5 rounded-full border-2 border-gray-200 px-4 text-sm font-semibold text-gray-400"
                title="This coordinator does not have an in-app messaging profile yet."
              >
                Send Message
              </span>
            </div>
          )}
        </div>
      </div>
    </div>

      <Modal
        isOpen={showZoneWarning}
        onClose={() => setShowZoneWarning(false)}
        title="You're sending a message outside your zone"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              You are currently assigned to <strong className="text-gray-900">{zoneOfCurrentUser || 'no zone'}</strong>. 
              You are about to message the coordinator for <strong className="text-gray-900">{zone.zone}</strong>.
            </p>
            <p className="bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-100 text-xs font-medium">
              Please confirm that your message is related to welfare in this specific area before proceeding.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowZoneWarning(false)}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={() => void handleMessageCoordinator()}
              disabled={isStartingConversation}
              className="inline-flex min-h-9 items-center justify-center rounded-full border-2 border-primary-500 bg-primary-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {isStartingConversation ? 'Opening chat...' : 'Yes, it\'s welfare-related'}
            </button>
          </div>
        </div>
      </Modal>
    </>
 
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

  const sortedData = zones?.sort((a, b) => a.zone.localeCompare(b.zone))


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

  const zoneOfCurrentUser = currentUser?.zone || "";

  return (
    <>
      <SEO
        title="Lagos Chapter Welfare Zones"
        description="Find your welfare zone coordinator and get support in your area."
      />

      <div className="min-h-screen bg-[#F8F8F7]">
        <div className="container-custom py-8 sm:py-10">
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-start justify-between mb-7 gap-4">
            <h1 className="type-section-title text-gray-900">Lagos Chapter Welfare Zones</h1>
          </div>

          {/* ── Grid ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2">
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
              sortedData?.map((zone) => (
                <ZoneCard key={zone.zoneId} zone={zone} currentUserEmail={currentUser?.email} zoneOfCurrentUser={zoneOfCurrentUser} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

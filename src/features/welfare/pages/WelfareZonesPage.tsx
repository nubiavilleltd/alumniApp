// // pages/welfare/WelfareZonesPage.tsx
// // Route: /welfare/zones
// // Design: 2-column grid of zone cards.
// // Each card: colored left border accent, zone name + area list,
// // thin divider, coordinator name (with chat icon) + phone + email.

// import { Icon } from '@iconify/react';
// import { SEO } from '@/shared/common/SEO';
// import { DonationButton } from '@/shared/components/ui/DonationButton';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface ZoneCoordinator {
//   name: string;
//   phone: string;
//   email: string;
// }

// interface WelfareZone {
//   id: string;
//   name: string;
//   areas: string;
//   coordinator: ZoneCoordinator;
//   accentColor: string; // Tailwind bg color class for the left border strip
// }

// // ─── Data ─────────────────────────────────────────────────────────────────────
// // Placeholder coordinator for all zones — replace with real data when available.

// const PLACEHOLDER_COORD: ZoneCoordinator = {
//   name: 'Jane Esther',
//   phone: '08037232897',
//   email: 'jane_esther@gmail.com',
// };

// const zones: WelfareZone[] = [
//   {
//     id: 'zone-1',
//     name: 'Zone 1',
//     areas: 'Badagry, Ojo, Amuwo Odofin, Ajeromi Ifelodun, Apapa (including Festac & Ijanikin)',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-green-300',
//   },
//   {
//     id: 'zone-2',
//     name: 'Zone 2',
//     areas:
//       'Surulere, Mushin, Shomolu, Palmgroove, Obanikoro, Onipanu, Yaba, Ebute Metta, Orile Iganmu, Ijesha',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-purple-300',
//   },
//   {
//     id: 'zone-3',
//     name: 'Zone 3',
//     areas:
//       'Alimosho, Oshodi/Isolo, Egbeda, Iyana Ipaja, Ikotun, Okota, Iba, Abule Egba, Ijaiye, Alagbado',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-orange-200',
//   },
//   {
//     id: 'zone-4',
//     name: 'Zone 4',
//     areas: 'Ifako Ijaiye, Agege, Ikeja, Ojodu/Berger, Ikorodu, Magodo, Isheri',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-sky-300',
//   },
//   {
//     id: 'zone-5a',
//     name: 'Zone 5a',
//     areas: 'Lagos Island, Obalende, Ikoyi, Victoria Island, Oniru',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-rose-200',
//   },
//   {
//     id: 'zone-5b',
//     name: 'Zone 5b',
//     areas: 'Lekki Phase 1-5, Ikota, VGC, Ilaje',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-yellow-200',
//   },
//   {
//     id: 'zone-5c',
//     name: 'Zone 5c',
//     areas:
//       'Ajah, Abraham Adesanya, Sangotedo, Awoyaya, Lakowe, Ibeju-Lekki & environs (Bogije to Eleko)',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-stone-300',
//   },
//   {
//     id: 'zone-6',
//     name: 'Zone 6',
//     areas: 'Ikosi, Alapere, Ketu, Gbagada, Anthony, Maryland, Ogudu, Oworonshoki, Ojota, Ilupeju',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-slate-300',
//   },
//   {
//     id: 'zone-7',
//     name: 'Zone 7',
//     areas: 'Outskirt Communities: Mowe, RCCG Camp, Ogun State and surrounding areas',
//     coordinator: PLACEHOLDER_COORD,
//     accentColor: 'bg-green-200',
//   },
// ];

// // ─── Zone Card ────────────────────────────────────────────────────────────────

// function ZoneCard({ zone }: { zone: WelfareZone }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
//       {/* Colored left accent strip */}
//       <div className={`w-2.5 flex-shrink-0 ${zone.accentColor}`} />

//       {/* Content */}
//       <div className="flex-1 p-5">
//         {/* Zone name + areas */}
//         <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 mb-4">
//           <span className="font-bold text-gray-900 text-base whitespace-nowrap flex-shrink-0">
//             {zone.name}
//           </span>
//           <p className="text-gray-500 text-sm leading-relaxed mt-0.5 sm:mt-0">{zone.areas}</p>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-100 mb-3" />

//         {/* Coordinator info */}
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <span>Coordinator: {zone.coordinator.name}</span>
//             <button
//               type="button"
//               title="Send message"
//               className="text-primary-500 hover:text-primary-600 transition-colors"
//             >
//               <Icon icon="mdi:message-outline" className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
//             <span>{zone.coordinator.phone}</span>
//             <span>{zone.coordinator.email}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function WelfareZonesPage() {
//   return (
//     <>
//       <SEO
//         title="Welfare Zones"
//         description="Find your welfare zone coordinator and get support in your area."
//       />

//       <div className="min-h-screen bg-[#f5f4f0]">
//         <div className="container-custom py-8 sm:py-10">
//           {/* ── Header ───────────────────────────────────────────────── */}
//           <div className="mb-7">
//             <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Welfare Zones</h1>
//           </div>

//           {/* ── Zone grid: 2 cols desktop, 1 col mobile ──────────────── */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {zones.map((zone) => (
//               <ZoneCard key={zone.id} zone={zone} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

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

const zonesCitiesMapping = {
  'Zone 1': 'Badagry, Ojo, Amuwo Odofin, Ajeromi Ifelodun, Apapa (including Festac & Ijanikin)',
  'Zone 2':
    'Surulere, Mushin, Shomolu, Palmgroove, Obanikoro, Onipanu, Yaba, Ebute Metta, Orile Iganmu, Ijesha',
  'Zone 3':
    'Alimosho, Oshodi/Isolo, Egbeda, Iyana Ipaja, Ikotun, Okota, Iba, Abule Egba, Ijaiye, Alagbado',
  'Zone 4': 'Ifako Ijaiye, Agege, Ikeja, Ojodu/Berger, Ikorodu, Magodo, Isheri',
  'Zone 5a': 'Lagos Island, Obalende, Ikoyi, Victoria Island, Oniru',
  'Zone 5b': 'Lekki Phase 1-5, Ikota, VGC, Ilaje',
  'Zone 5c':
    'Ajah, Abraham Adesanya, Sangotedo, Awoyaya, Lakowe, Ibeju-Lekki & environs (Bogije to Eleko)',
  'Zone 6': 'Ikosi, Alapere, Ketu, Gbagada, Anthony, Maryland, Ogudu, Oworonshoki, Ojota, Ilupeju',
  'Zone 7': 'Outskirt Communities: Mowe, RCCG Camp, Ogun State and surrounding areas',
};

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

function ZoneCard({ zone, index }: { zone: WelfareZone; index: number }) {
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

          {/* TODO */}
          {/* The backend doesn't return area names in this endpoint — the zone
              name itself is what the API provides. If the backend adds an
              "areas" field later, render it here. */}

          <span>{zonesCitiesMapping[zone.zone as keyof typeof zonesCitiesMapping]}</span>
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
                disabled={isStartingConversation}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary-400 text-primary-500 text-sm font-medium hover:bg-primary-50 transition-colors"
              >
                <Icon icon="mdi:message-outline" className="h-4 w-4" />
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

  // Show 6 skeleton cards while loading (matches a typical response size)
  const skeletonCount = 6;

  return (
    <>
      <SEO
        title="Welfare Zones"
        description="Find your welfare zone coordinator and get support in your area."
      />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-8 sm:py-10">
          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="flex items-start justify-between mb-7 gap-4">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Welfare Zones</h1>
          </div>

          {/* ── Zone grid: 2-col desktop, 1-col mobile ───────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {isLoading &&
              Array.from({ length: skeletonCount }).map((_, i) => <ZoneCardSkeleton key={i} />)}

            {isError && <ErrorState onRetry={refetch} />}

            {!isLoading && !isError && zones && zones.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                No welfare zones found.
              </div>
            )}

            {!isLoading &&
              !isError &&
              zones?.map((zone, index) => <ZoneCard key={zone.zoneId} zone={zone} index={index} />)}
          </div>
        </div>
      </div>
    </>
  );
}

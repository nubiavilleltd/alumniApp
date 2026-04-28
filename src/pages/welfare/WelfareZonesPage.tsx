// pages/welfare/WelfareZonesPage.tsx
// Route: /welfare/zones
// Design: 2-column grid of zone cards.
// Each card: colored left border accent, zone name + area list,
// thin divider, coordinator name (with chat icon) + phone + email.

import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { DonationButton } from '@/shared/components/ui/DonationButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ZoneCoordinator {
  name: string;
  phone: string;
  email: string;
}

interface WelfareZone {
  id: string;
  name: string;
  areas: string;
  coordinator: ZoneCoordinator;
  accentColor: string; // Tailwind bg color class for the left border strip
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Placeholder coordinator for all zones — replace with real data when available.

const PLACEHOLDER_COORD: ZoneCoordinator = {
  name: 'Jane Esther',
  phone: '08037232897',
  email: 'jane_esther@gmail.com',
};

const zones: WelfareZone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1',
    areas: 'Badagry, Ojo, Amuwo Odofin, Ajeromi Ifelodun, Apapa (including Festac & Ijanikin)',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-green-300',
  },
  {
    id: 'zone-2',
    name: 'Zone 2',
    areas:
      'Surulere, Mushin, Shomolu, Palmgroove, Obanikoro, Onipanu, Yaba, Ebute Metta, Orile Iganmu, Ijesha',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-purple-300',
  },
  {
    id: 'zone-3',
    name: 'Zone 3',
    areas:
      'Alimosho, Oshodi/Isolo, Egbeda, Iyana Ipaja, Ikotun, Okota, Iba, Abule Egba, Ijaiye, Alagbado',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-orange-200',
  },
  {
    id: 'zone-4',
    name: 'Zone 4',
    areas: 'Ifako Ijaiye, Agege, Ikeja, Ojodu/Berger, Ikorodu, Magodo, Isheri',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-sky-300',
  },
  {
    id: 'zone-5a',
    name: 'Zone 5a',
    areas: 'Lagos Island, Obalende, Ikoyi, Victoria Island, Oniru',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-rose-200',
  },
  {
    id: 'zone-5b',
    name: 'Zone 5b',
    areas: 'Lekki Phase 1-5, Ikota, VGC, Ilaje',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-yellow-200',
  },
  {
    id: 'zone-5c',
    name: 'Zone 5c',
    areas:
      'Ajah, Abraham Adesanya, Sangotedo, Awoyaya, Lakowe, Ibeju-Lekki & environs (Bogije to Eleko)',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-stone-300',
  },
  {
    id: 'zone-6',
    name: 'Zone 6',
    areas: 'Ikosi, Alapere, Ketu, Gbagada, Anthony, Maryland, Ogudu, Oworonshoki, Ojota, Ilupeju',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-slate-300',
  },
  {
    id: 'zone-7',
    name: 'Zone 7',
    areas: 'Outskirt Communities: Mowe, RCCG Camp, Ogun State and surrounding areas',
    coordinator: PLACEHOLDER_COORD,
    accentColor: 'bg-green-200',
  },
];

// ─── Zone Card ────────────────────────────────────────────────────────────────

function ZoneCard({ zone }: { zone: WelfareZone }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
      {/* Colored left accent strip */}
      <div className={`w-2.5 flex-shrink-0 ${zone.accentColor}`} />

      {/* Content */}
      <div className="flex-1 p-5">
        {/* Zone name + areas */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 mb-4">
          <span className="font-bold text-gray-900 text-base whitespace-nowrap flex-shrink-0">
            {zone.name}
          </span>
          <p className="text-gray-500 text-sm leading-relaxed mt-0.5 sm:mt-0">{zone.areas}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-3" />

        {/* Coordinator info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Coordinator: {zone.coordinator.name}</span>
            <button
              type="button"
              title="Send message"
              className="text-primary-500 hover:text-primary-600 transition-colors"
            >
              <Icon icon="mdi:message-outline" className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
            <span>{zone.coordinator.phone}</span>
            <span>{zone.coordinator.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WelfareZonesPage() {
  return (
    <>
      <SEO
        title="Welfare Zones"
        description="Find your welfare zone coordinator and get support in your area."
      />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-8 sm:py-10">
          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="mb-7">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Welfare Zones</h1>
          </div>

          {/* ── Zone grid: 2 cols desktop, 1 col mobile ──────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {zones.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

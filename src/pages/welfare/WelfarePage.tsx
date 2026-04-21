// pages/welfare/WelfarePage.tsx
// Route: /welfare
// Design: Header left + two outlined CTA buttons right.
// Top row: 3-column grid (icon inline with title).
// Bottom row: 2-column grid (centred).
// Cards are clickable (link or action).

import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { DonationButton } from '@/shared/components/ui/DonationButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WelfareService {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  href?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const topServices: WelfareService[] = [
  {
    id: 'congratulations',
    title: 'Congratulations',
    description:
      'We celebrate with you! Wedding gifts, new baby welcomes, and milestone birthday acknowledgments.',
    icon: 'mdi:party-popper',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    id: 'wellness',
    title: 'Wellness & Medical Support',
    description:
      'Financial and logistical assistance for members facing critical health challenges or sudden hardships.',
    icon: 'mdi:heart-plus-outline',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-500',
  },
  {
    id: 'bereavement',
    title: 'Bereavement Support',
    description:
      'Providing compassionate support and guidance during times of loss, helping you navigate grief with care and understanding.',
    icon: 'mdi:candle',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-500',
  },
];

const bottomServices: WelfareService[] = [
  {
    id: 'emergency',
    title: 'Emergency & Crisis Support',
    description:
      'Immediate support for urgent situations, connecting you to the help and resources you need when it matters most.',
    icon: 'mdi:hand-extended-outline',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
  },
  {
    id: 'professional',
    title: 'Professional & Employment Support',
    description:
      'Supporting your career journey with access to opportunities, guidance, and resources for professional growth and development.',
    icon: 'mdi:briefcase-outline',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-500',
  },
];

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  horizontal = false,
}: {
  service: WelfareService;
  horizontal?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer flex flex-col gap-4">
      {/* Header: icon + title inline */}
      <div className={`flex items-center gap-4 ${horizontal ? '' : ''}`}>
        <div
          className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon icon={service.icon} className={`w-7 h-7 ${service.iconColor}`} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 leading-snug">{service.title}</h2>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WelfarePage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Welfare"
        description="Our welfare program is dedicated to supporting alumni in times of need and celebrating our collective milestones."
      />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-8 sm:py-10">
          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
            {/* Left: title + description */}
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Welfare</h1>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                "We rise by lifting others." Our welfare program is dedicated to supporting alumni
                in times of need and celebrating our collective milestones. Reach out to the Welfare
                Committee directly if you have any welfare concerns. All communications are treated
                with strict confidentiality.
              </p>
            </div>

            {/* Right: action buttons (stacked) */}
            <div className="flex flex-row sm:flex-col gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  /* open contact modal / mailto */
                }}
                className="border border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
              >
                Contact the Committee
              </button>
              <button
                type="button"
                onClick={() => navigate('/welfare/zones')}
                className="border border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
              >
                Welfare Zones
              </button>
            </div>
          </div>

          {/* ── Top row: 3 columns ───────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {topServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* ── Bottom row: 2 columns (centred) ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:w-[calc(66.67%+10px)] lg:mx-auto xl:w-[calc(66.67%+10px)]">
            {bottomServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>

      <DonationButton href="#donate" />
    </>
  );
}

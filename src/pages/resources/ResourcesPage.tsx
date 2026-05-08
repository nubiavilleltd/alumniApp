// pages/resources/ResourcesPage.tsx
// Route: /resources
// Design: 2×2 grid of category cards with coloured icon badges.
// Each resource link is blue with an external link icon where applicable.

import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { DonationButton } from '@/shared/components/ui/DonationButton';
import { ROUTES } from '@/shared/constants/routes';
import { AppLink } from '@/shared/components/ui/AppLink';

const supportSafetyIcon = '/Resources/support_safety.svg';
const careerGrowthIcon = '/Resources/career_growth.svg';
const legalReferralIcon = '/Resources/aid_referral.svg';
const counsellingIcon = '/Resources/counselling.svg';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResourceLink {
  label: string;
  description: string;
  href?: string;
  external?: boolean;
}

interface ResourceCategory {
  id: string;
  title: string;
  imageSrc: string;
  links: ResourceLink[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories: ResourceCategory[] = [
  {
    id: 'safety',
    title: 'Support & Safety',
    imageSrc: supportSafetyIcon,
    links: [
      {
        label: 'WARIF',
        description:
          'Women at Risk International Foundation - Support for survivors of gender-based violence.',
        href: 'https://warif.org',
        external: true,
      },
      {
        label: 'Lagos State DSVRT',
        description: 'Domestic and Sexual Violence Response Team - Legal and psychosocial support.',
        href: 'https://lagosstate.gov.ng',
        external: true,
      },
    ],
  },
  {
    id: 'career',
    title: 'Career & Growth',
    imageSrc: careerGrowthIcon,
    links: [
      {
        label: 'Networking 101',
        description: 'Guide to building meaningful professional relationships.',
      },
      {
        label: 'Mentorship Program',
        description: 'How to find a mentor or become one within the alumnae network.',
      },
      {
        label: 'Job Vacancies',
        description: 'Exclusive job listings for FGGC Owerri alumnae.',
        href: ROUTES.JOB_VACANCIES,
      },
    ],
  },
  {
    id: 'legal',
    title: 'Legal Aid / Referral',
    imageSrc: legalReferralIcon,
    links: [
      {
        label: 'Legal Aid',
        description:
          'Access reliable legal support and guidance to help you navigate disputes, rights, and formal processes with confidence.',
      },
      {
        label: 'Referral',
        description:
          'Connect with trusted professionals and services through verified referrals within the alumni network.',
      },
    ],
  },
  {
    id: 'counselling',
    title: 'Counselling',
    imageSrc: counsellingIcon,
    // No clickable links — just descriptive paragraphs
    links: [
      {
        label: '',
        description: 'A safe space to talk, reflect, and receive guidance for your wellbeing.',
      },
      {
        label: '',
        description:
          'Confidential support to help you navigate personal, emotional, and professional challenges.',
      },
      {
        label: '',
        description:
          'Access professional counselling and support tailored to your personal and mental wellbeing.',
      },
    ],
  },
];

// ─── Icon Badge ───────────────────────────────────────────────────────────────

function IconBadge({ imageSrc }: { imageSrc: string }) {
  return (
    <img
      src={imageSrc}
      alt=""
      aria-hidden="true"
      className="h-14 w-14 flex-shrink-0 object-contain"
    />
  );
}

// ─── Resource Card ────────────────────────────────────────────────────────────

function ResourceCard({ category }: { category: ResourceCategory }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-7 flex flex-col gap-5">
      {/* Icon */}
      <IconBadge imageSrc={category.imageSrc} />

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>

      {/* Links / descriptions */}
      <div className="space-y-4">
        {category.links.map((link, i) => (
          <div key={i} className="space-y-1">
            {/* {link.label ? (
              link.href ? (
                <Link
                  to={link.href}
                  //   target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-semibold text-sm transition-colors"
                >
                  {link.label}
                  {link.external && (
                    <Icon icon="mdi:open-in-new" className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-semibold text-sm transition-colors text-left"
                >
                  {link.label}
                </button>
              )
            ) : null} */}

            {link.label ? (
              link.href ? (
                <AppLink
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-semibold text-sm transition-colors"
                  endAdornment={
                    link.external ? (
                      <Icon icon="mdi:open-in-new" className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : null
                  }
                >
                  {link.label}
                </AppLink>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-semibold text-sm transition-colors text-left"
                >
                  {link.label}
                </button>
              )
            ) : null}
            <p className="text-gray-500 text-sm leading-relaxed">{link.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <>
      <SEO
        title="Resources"
        description="A collection of tools, links, and articles to support your personal and professional growth, as well as your well-being."
      />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-8 sm:py-10">
          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Resources</h1>
            <p className="text-gray-600 text-base max-w-lg leading-relaxed">
              A collection of tools, links, and articles to support your personal and professional
              growth, as well as your well-being.
            </p>
          </div>

          {/* ── 2×2 grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((cat) => (
              <ResourceCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// shared/components/layout/Footer.tsx
//
// NEW DESIGN — builds on the existing code.
// Three columns on desktop, separated by thin white/20 dividers:
//   Col 1 (left):   Logo · tagline · contact info
//   Col 2 (middle): Quick Links | Community | Legal & Policies sub-columns
//   Col 3 (right):  Social icons stacked vertically
//
// The National Theatre image shows in the upper portion of the footer.
// Content is anchored to the bottom via large top padding (pushes content down).
// Gradient goes transparent → deep navy so text is always readable.
//
// Responsive:
//   Mobile:  full-width stacked sections + horizontal social row at bottom
//   Tablet:  2-col links grid, socials move to bottom row
//   Desktop: full 3-column layout with vertical dividers

import { Icon } from '@iconify/react';
import { getSiteConfig } from '@/data/content';
import { AppLink } from '../ui/AppLink';
import FooterBgImage from '/footer-bg-image.png';
import FooterLogo from '../ui/FooterLogo';

// ─── Social icon resolver ─────────────────────────────────────────────────────
// config.social_links[].icon contains icon names like "facebook", "instagram".
// We map them to the correct iconify identifiers.

const SOCIAL_ICON_MAP: Record<string, string> = {
  facebook: 'mdi:facebook',
  instagram: 'mdi:instagram',
  tiktok: 'ic:baseline-tiktok',
  tiktok_alt: 'simple-icons:tiktok',
  twitter: 'ri:twitter-x-fill',
  x: 'ri:twitter-x-fill',
  linkedin: 'mdi:linkedin',
  youtube: 'mdi:youtube',
  whatsapp: 'mdi:whatsapp',
};

function resolveSocialIcon(iconName: string): string {
  const key = iconName.toLowerCase().replace(/[^a-z]/g, '');
  return SOCIAL_ICON_MAP[key] ?? `mdi:${iconName}`;
}

// ─── Link columns ─────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'Get to Know FGGC Owerri AA', href: '/about' },
  { label: 'Announcements', href: '/news' },
  { label: 'Events', href: '/events' },
  { label: 'Our Projects', href: '/projects' },
  { label: 'Make a Donation', href: '/donation' },
  { label: 'Contact Us', href: '/contact' },
];

const COMMUNITY_LINKS = [
  { label: 'Alumnae Directory', href: '/alumni/profiles' },
  { label: 'Check on your Sister', href: '/alumni/profiles' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Resources', href: '/resources' },
  { label: 'Welfare', href: '/welfare' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Code of Conduct', href: '/code-of-conduct' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function LinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-white font-bold text-sm mb-4 tracking-wide">{heading}</h4>
      <ul className="space-y-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <AppLink
              href={href}
              className="text-white hover:text-white text-sm transition-colors duration-150"
            >
              {label}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  const config = getSiteConfig();
  const currentYear = new Date().getFullYear();

  const socialLinks: { name: string; url: string; icon: string }[] = config.social_links ?? [];

  return (
    <footer className="relative text-white overflow-hidden">
      {/* ── Background image ─────────────────────────────────────────
          Positioned at the top so the building shows in the upper half.
          object-cover + bg-[center_top] keeps the building centred.
      ─────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat"
        style={{ backgroundImage: `url(${FooterBgImage})` }}
        aria-hidden="true"
      />

      <div
        // className="absolute inset-0"
        // style={{
        //   background:
        //     'linear-gradient(to bottom, rgba(13,31,60,0.18) 0%, rgba(13,31,60,0.55) 38%, rgba(13,31,60,0.88) 58%, rgba(13,31,60,0.97) 75%, rgba(13,31,60,1) 100%)',
        // }}
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────────────
          Large top padding pushes content to the bottom half so the
          building image shows above. Bottom padding gives breathing room
          before the copyright strip.
      ─────────────────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <div className="container-custom pt-52 sm:pt-60 lg:pt-72 xl:pt-80 pb-0">
          {/* ── Three main columns ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_auto] lg:items-start gap-10 lg:gap-0 pb-10 lg:pb-14">
            {/* ══ Column 1: Logo + tagline + contact ══════════════════ */}
            <div className="lg:pr-10 xl:pr-14">
              {/* Logo wordmark */}
              <div className="mb-5">
                <FooterLogo />
              </div>

              {/* Tagline */}
              <p className="text-white text-sm leading-relaxed max-w-[340px]">
                Connecting generations of extraordinary women since 1985. A global sisterhood built
                on excellence, integrity, and service to Nigeria and beyond.
              </p>

              {/* Contact details */}
              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:map-marker"
                    className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-white text-sm leading-snug">
                    {config.organization?.address || 'Lagos, Nigeria'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:email-outline" className="w-4 h-4 text-white/60 flex-shrink-0" />
                  <AppLink
                    href={`mailto:${config.contact?.email || 'info@fggcowerrilagos.org'}`}
                    className="text-white hover:text-white text-sm transition-colors"
                  >
                    {config.contact?.email || 'info@fggcowerrilagos.org'}
                  </AppLink>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:phone" className="w-4 h-4 text-white/60 flex-shrink-0" />
                  <AppLink
                    href={`tel:${config.contact?.phone || '+2348000000000'}`}
                    className="text-white hover:text-white text-sm transition-colors"
                  >
                    {config.contact?.phone || '+234 800 000 0000'}
                  </AppLink>
                </div>
              </div>
            </div>

            {/* ── Vertical divider 1 (desktop only) ────────────────── */}
            <div className="hidden lg:block w-px self-stretch bg-white/20 mx-6 xl:mx-10" />

            {/* ══ Column 2: Link groups ════════════════════════════════ */}
            <div className="lg:px-2">
              {/* Mobile/tablet: 2-col grid; desktop: 3-col */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-x-10 xl:gap-x-14">
                <LinkColumn heading="Quick Links" links={QUICK_LINKS} />
                <LinkColumn heading="Community" links={COMMUNITY_LINKS} />
                <div className="col-span-2 sm:col-span-1">
                  <LinkColumn heading="Legal & Policies" links={LEGAL_LINKS} />
                </div>
              </div>
            </div>

            {/* ── Vertical divider 2 (desktop only) ────────────────── */}
            <div className="hidden lg:block w-px self-stretch bg-white/20 mx-6 xl:mx-10" />

            {/* ══ Column 3: Social icons (desktop — stacked vertically) */}
            {socialLinks.length > 0 && (
              <div className="hidden lg:flex flex-col gap-3 items-center justify-start">
                {socialLinks.map((social) => (
                  <AppLink
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    ariaLabel={social.name}
                    className="w-11 h-11 rounded-full border border-white/30 bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-white/50"
                  >
                    <Icon icon={resolveSocialIcon(social.icon)} className="w-5 h-5 text-white" />
                  </AppLink>
                ))}
              </div>
            )}
          </div>

          {/* ── Copyright strip ──────────────────────────────────────── */}
          <div className="border-t border-white/10 py-5">
            <p className="text-white/50 text-xs text-left">
              © {currentYear} FGGC Owerri Alumni Association, Lagos Chapter. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile / tablet social icons ─────────────────────────────
          Shown below the link columns on smaller screens.
          Hidden on desktop (lg+) where they appear in Col 3.
      ─────────────────────────────────────────────────────────────── */}
      {socialLinks.length > 0 && (
        <div className="lg:hidden relative z-10 border-t border-white/10">
          <div className="container-custom py-5">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <AppLink
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel={social.name}
                  className="w-10 h-10 rounded-full border border-white/30 bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <Icon icon={resolveSocialIcon(social.icon)} className="w-5 h-5 text-white" />
                </AppLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

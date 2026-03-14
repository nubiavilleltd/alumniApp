import { Icon } from '@iconify/react';
import { getSiteConfig } from '@/data/content';
import { AppLink } from '../ui/AppLink';

export function Footer() {
  const config = getSiteConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-500 text-white">
      <div className="container-custom py-10">
        {/* Top row: Logo + Contact */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Left: Logo + description */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center overflow-hidden flex-shrink-0 bg-white">
                {config.site.logo ? (
                  <img
                    src={config.site.logo}
                    alt={`${config.site.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Icon icon="mdi:account-group" className="w-5 h-5 text-primary-500" />
                )}
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{config.site.name}</p>
                <p className="text-primary-100 text-xs leading-tight">{config.organization.name}</p>
              </div>
            </div>
            <p className="text-primary-100 text-sm leading-relaxed">{config.site.description}</p>
          </div>

          {/* Right: Contact Us */}
          <div className="min-w-[220px]">
            <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary-100 text-sm">
                <Icon icon="mdi:map-marker" className="w-4 h-4 flex-shrink-0" />
                <span>{config.organization.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:email-outline" className="w-4 h-4 flex-shrink-0 text-primary-100" />
                <AppLink
                  href={`mailto:${config.contact.email}`}
                  className="text-primary-100 hover:text-white transition-colors duration-200"
                >
                  {config.contact.email}
                </AppLink>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:phone" className="w-4 h-4 flex-shrink-0 text-primary-100" />
                <AppLink
                  href={`tel:${config.contact.phone}`}
                  className="text-primary-100 hover:text-white transition-colors duration-200"
                >
                  {config.contact.phone}
                </AppLink>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-500/40" />

        {/* Bottom row: Copyright + Social icons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-primary-100 text-xs text-center md:text-left">
            © {currentYear} FGGC Owerri Alumni Association, Lagos Chapter. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {config.social_links.map((social: { name: string; url: string; icon: string }) => (
              <AppLink
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={social.name}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-md flex items-center justify-center transition-colors duration-200"
              >
                <Icon icon={`mdi:${social.icon}`} className="w-4 h-4 text-white" />
              </AppLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

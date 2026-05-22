import { Crown } from 'lucide-react';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { PROJECT_ROUTES } from '@/features/projects/routes';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ADMIN_ROUTES } from '../routes';

type AdminBannerTab = 'dashboard' | 'members' | 'events' | 'announcements' | 'projects';

type AdminBannerProps = {
  activeTab: AdminBannerTab;
  title: string;
  headingLevel?: 'h1' | 'p';
};

const adminBannerTabs: Array<{ id: AdminBannerTab; label: string; href: string }> = [
  { id: 'dashboard', label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
  { id: 'members', label: 'Members', href: ADMIN_ROUTES.MEMBERS },
  { id: 'events', label: 'Events', href: ADMIN_ROUTES.EVENTS },
  { id: 'announcements', label: 'Announcements', href: ADMIN_ROUTES.ANNOUNCEMENTS },
  { id: 'projects', label: 'Projects', href: ADMIN_ROUTES.PROJECTS },
];

export function AdminBanner({ activeTab, title, headingLevel = 'p' }: AdminBannerProps) {
  const { data: currentUser } = useCurrentUser();
  const TitleTag = headingLevel;

  return (
    <div className="bg-[#f5f4f0]">
      <div className="container-custom pt-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#1e40af]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_50%)]" />

          <div className="container-custom relative z-10 flex flex-col gap-4 py-6 lg:flex-row sm:items-center sm:justify-between sm:py-8">
            {/* Left: Title block */}
            <div className="shrink-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/20 px-3 py-1.5">
                <Crown className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                  Admin Panel
                </span>
              </div>
              <TitleTag className="mb-1 text-3xl font-bold text-white sm:text-4xl">
                {title}
              </TitleTag>
              <p className="text-sm text-white/70">
                Signed in as {currentUser?.fullName ?? 'Admin'}
              </p>
            </div>

            {/* Right: Nav tabs — scrollable on mobile, wrapping on desktop */}
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
              <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-end sm:gap-3">
                {adminBannerTabs.map((tab) => (
                  <AppLink
                    key={tab.id}
                    href={tab.href}
                    className={[
                      'whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:px-6',
                      tab.id === activeTab
                        ? 'border border-white/30 bg-white/20 text-white shadow-lg'
                        : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                  >
                    {tab.label}
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

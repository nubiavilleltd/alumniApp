import { Crown } from 'lucide-react';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { PROJECT_ROUTES } from '@/features/projects/routes';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ADMIN_ROUTES, ADMIN_STORE_ROUTES } from '../routes';

type AdminBannerTab =
  | 'dashboard'
  | 'members'
  | 'events'
  | 'announcements'
  | 'projects'
  | 'pages_content'
  | 'store';

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
  { id: 'pages_content', label: 'Pages Content', href: ADMIN_ROUTES.PAGES_CONTENT },
  { id: 'store', label: 'Store', href: ADMIN_STORE_ROUTES.ROOT },
];

export function AdminBanner({ activeTab, title, headingLevel = 'p' }: AdminBannerProps) {
  const { data: currentUser } = useCurrentUser();
  const TitleTag = headingLevel;

  return (
    <div className="bg-[#F8F8F7]">
      <div className="container-custom pt-5 sm:pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#06131d] via-[#06426d] to-[#087cc8]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_50%)]" />

          <div className="relative z-10 flex flex-col gap-6 px-6 py-7 sm:px-9 sm:py-9 lg:flex-row lg:items-center lg:justify-between">
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

            {/* Right: Nav tabs */}
            <div className="scrollbar-hide -mx-4 min-w-0 overflow-x-auto px-4 scroll-smooth sm:mx-0 sm:px-0 lg:flex-1 [-webkit-overflow-scrolling:touch]">
              <div className="flex w-max gap-2 sm:gap-3 lg:ml-auto">
                {adminBannerTabs.map((tab) => (
                  <AppLink
                    key={tab.id}
                    href={tab.href}
                    className={[
                      'whitespace-nowrap rounded-[14px] px-4 py-2 text-base font-semibold transition-all',
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

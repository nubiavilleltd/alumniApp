import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ADMIN_ROUTES, ADMIN_STORE_ROUTES } from '../routes';
import { AuthSessionUser } from '@/features/authentication/types/auth.types';
import { canManageStore } from '@/shared/permissions/store.permission';
import { canManageEvents } from '@/shared/permissions/event.permission';
import { canManageAnnouncements } from '@/shared/permissions/announcement.permission';
import { canManageProjects } from '@/shared/permissions/project.permission';
import { canManageMembers } from '@/shared/permissions/approval.permission';
import { canManageContent } from '@/shared/permissions/content.permission';

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

const adminBannerTabs: Array<{
  id: AdminBannerTab; label: string; href: string; permission?: (user: AuthSessionUser) => boolean;
}> = [
    { id: 'dashboard', label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
    { id: 'members', label: 'Members', href: ADMIN_ROUTES.MEMBERS, permission:canManageMembers },
    { id: 'events', label: 'Events', href: ADMIN_ROUTES.EVENTS, permission:canManageEvents },
    { id: 'announcements', label: 'Announcements', href: ADMIN_ROUTES.ANNOUNCEMENTS, permission:canManageAnnouncements },
    { id: 'projects', label: 'Projects', href: ADMIN_ROUTES.PROJECTS, permission:canManageProjects },
    { id: 'pages_content', label: 'Pages Content', href: ADMIN_ROUTES.PAGES_CONTENT, permission:canManageContent },
    { id: 'store', label: 'Store', href: ADMIN_STORE_ROUTES.ROOT, permission: canManageStore },
  ];

export function AdminBanner({ activeTab, title, headingLevel = 'p' }: AdminBannerProps) {
  const { data: currentUser } = useCurrentUser();
  const TitleTag = headingLevel;
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

   const visibleTabs = adminBannerTabs.filter(
    (tab) => !tab.permission || (currentUser && tab.permission(currentUser))
  );

  const updateTabsScrollState = () => {
    const container = tabsScrollRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollTabsLeft(container.scrollLeft > 1);
    setCanScrollTabsRight(container.scrollLeft < maxScrollLeft - 1);
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    const container = tabsScrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === 'left' ? -260 : 260,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return undefined;

    updateTabsScrollState();

    const handleScroll = () => updateTabsScrollState();
    const handleResize = () => updateTabsScrollState();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [visibleTabs.length]);

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
            <div className="flex min-w-0 items-center gap-2 lg:flex-1">
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                disabled={!canScrollTabsLeft}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white/10"
                aria-label="Scroll admin tabs left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={tabsScrollRef}
                className="scrollbar-hide -mx-1 min-w-0 flex-1 overflow-x-auto px-1 scroll-smooth [-webkit-overflow-scrolling:touch]"
              >
                <div className="flex w-max gap-2 sm:gap-3 lg:ml-auto">
                  {visibleTabs.map((tab) => (
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

              <button
                type="button"
                onClick={() => scrollTabs('right')}
                disabled={!canScrollTabsRight}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white/10"
                aria-label="Scroll admin tabs right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

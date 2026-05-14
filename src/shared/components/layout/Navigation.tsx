import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { authApi } from '@/features/authentication/services/auth.service';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';
import { EVENT_ROUTES } from '@/features/events/routes';
import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';
import { useMessagesInbox } from '@/features/messages/hooks/useMessages';
import type { MessageThreadSummary } from '@/features/messages/types/messages.types';
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '@/features/user/routes';
import { AppLink } from '../ui/AppLink';
import { useToastStore } from '../ui/Toast';
import HeaderLogo from '../ui/HeaderLogo';

type NavChild = {
  label: string;
  url: string;
};

type NavItem = NavChild & {
  children?: NavChild[];
};

type CurrentUser = {
  fullName?: string;
  email?: string;
  avatarInitials?: string;
  photo?: string | null;
  role?: string;
  memberId?: string;
  id?: string;
};

const secondaryNavItems: NavItem[] = [
  { label: 'Resources', url: ROUTES.RESOURCES },
  { label: 'Welfare', url: ROUTES.WELFARE },
  { label: 'Contact Us', url: ROUTES.CONTACT },
];

const primaryNavItems: NavItem[] = [
  { label: 'About Us', url: ROUTES.ABOUT },
  { label: 'Alumnae Directory', url: ALUMNI_ROUTES.PROFILES },
  {
    label: 'News & Events',
    url: ROUTES.NEWS,
    children: [
      { label: 'Announcements', url: ROUTES.NEWS },
      { label: 'Events', url: EVENT_ROUTES.ROOT },
      { label: 'Our Projects', url: ROUTES.PROJECTS.ROOT },
    ],
  },
  {
    label: 'Marketplace',
    url: MARKETPLACE_ROUTES.ROOT,
    children: [
      { label: 'Marketplace', url: MARKETPLACE_ROUTES.ROOT },
      { label: 'Job Vacancies', url: ROUTES.JOB_VACANCIES },
    ],
  },
];

const authenticatedMenuItems: NavChild[] = [
  { label: 'View Profile', url: USER_ROUTES.PROFILE },
  { label: 'Dashboard', url: USER_ROUTES.DASHBOARD },
  { label: 'Messaging Center', url: ROUTES.MESSAGES },
  { label: 'My Registered Events', url: EVENT_ROUTES.MY_EVENTS },
  { label: 'My Market', url: MARKETPLACE_ROUTES.MY_BUSINESS },
  { label: 'My Job Posts', url: ROUTES.MY_JOB_POSTS },
  { label: 'Settings', url: USER_ROUTES.SETTINGS },
];

const navSurfaceClassName =
  'bg-[linear-gradient(106deg,_rgb(var(--color-primary-500))_0%,_#003a5d_92%)]';
const desktopLinkBaseClassName =
  "relative no-underline font-[600] tracking-[0.1em] text-[#c4d0d9] transition-colors duration-200 hover:text-white focus-visible:text-white after:pointer-events-none after:absolute after:left-0 after:h-[5px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-white/85 after:content-[''] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";
const desktopActiveLinkClassName = 'text-white after:scale-x-100';
const desktopPrimaryLinkClassName = `${desktopLinkBaseClassName} whitespace-nowrap text-sm xl:text-lg 2xl:text-lg after:-bottom-3 xl:after:-bottom-4`;
const desktopSecondaryLinkClassName = `${desktopLinkBaseClassName} text-sm xl:text-base 2xl:text-lg after:-bottom-2`;
const desktopPanelClassName =
  'absolute top-[calc(100%+1rem)] z-[60] overflow-hidden border border-[#d7e6ef] bg-white shadow-[0_1.25rem_2.5rem_rgba(7,17,22,0.14)]';
const desktopDropdownPanelSizeClassName = 'w-[17.5rem] rounded-[0.9rem] py-[0.45rem]';
const desktopDropdownMenuLinkClassName =
  'flex items-center gap-3 px-4 py-[0.8rem] text-left text-[0.92rem] font-bold text-[#4f5864] no-underline transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700';
const desktopMenuActiveLinkClassName = 'bg-primary-50 text-primary-700';
const accountPillClassName =
  'inline-flex min-h-[3.35rem] items-center rounded-full border border-transparent bg-white text-[#0d78cb] no-underline shadow-none transition-opacity duration-200 hover:bg-white/95 hover:text-[#0d78cb]';
const userAccountTriggerClassName =
  'inline-flex min-h-[3.35rem] items-center rounded-full border border-white/25 bg-transparent text-white no-underline shadow-none transition-colors duration-200 hover:border-white/40 hover:bg-white/5';
const mobileSectionClassName =
  'mt-4 grid gap-1.5 border-t border-white/15 pt-4 first:mt-0 first:border-t-0 md:mt-5 md:gap-2 md:pt-5';
const mobileLinkClassName =
  'flex items-center gap-3 rounded-[1rem] px-4 py-3.5 text-[0.95rem] font-bold tracking-[0.03em] leading-[1.3] text-[#d0d9e0] no-underline transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white md:px-5 md:py-4 md:text-base';

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

function getDisplayName(user: CurrentUser) {
  return user.fullName?.trim() || user.email?.split('@')[0] || 'Member';
}

function getInitials(user: CurrentUser) {
  const storedInitials = user.avatarInitials?.trim();
  if (storedInitials) return storedInitials;

  const name = getDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return parts[0]?.slice(0, 2).toUpperCase() || '?';
}

function isPathActive(pathname: string, url: string) {
  if (url === ROUTES.HOME) return pathname === ROUTES.HOME;
  return pathname === url || pathname.startsWith(`${url}/`);
}

function formatUnreadBadgeCount(count: number) {
  if (count > 99) return '99+';
  return count.toString();
}

function UnreadMessagesBadge({ count, className = '' }: { count: number; className?: string }) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1.5 py-0.5 text-[0.68rem] font-extrabold leading-none text-white shadow-[0_4px_10px_rgba(239,68,68,0.35)]',
        className,
      )}
      aria-label={`${count} unread conversation${count === 1 ? '' : 's'}`}
    >
      {formatUnreadBadgeCount(count)}
    </span>
  );
}

function buildMessageFlashTitle(thread: MessageThreadSummary) {
  if (thread.type === 'group' && thread.lastMessageSenderName?.trim()) {
    return `${thread.lastMessageSenderName.trim()} in ${thread.title}`;
  }

  return thread.title;
}

function buildMessageFlashBody(thread: MessageThreadSummary) {
  const preview = thread.lastMessagePreview.trim();
  return preview || 'You have a new unread message.';
}

function BrandMark({ mobile = false }: { mobile?: boolean }) {
  return (
    <AppLink
      href={ROUTES.HOME}
      className={cn(
        'relative isolate flex overflow-hidden bg-white text-primary-500 no-underline',
        mobile
          ? 'min-h-[5.25rem] items-center py-3 sm:min-h-[5.5rem] sm:py-3.5'
          : 'items-center justify-center py-3 xl:py-4 2xl:py-5',
      )}
    >
      <span
        className="absolute inset-0 -z-10 bg-[url('/navbarImage.png')] bg-[length:auto_100%] bg-right bg-no-repeat"
        aria-hidden="true"
      />
      <HeaderLogo
        className={cn(
          'relative z-10 min-w-0',
          mobile ? 'w-full justify-center gap-2.5' : 'max-w-full justify-center gap-3',
        )}
        imageClassName={cn(
          mobile ? 'h-[2.8rem] w-[2.8rem] sm:h-[3rem] sm:w-[3rem]' : 'h-[3.35rem] w-[3.35rem]',
        )}
        wordmarkClassName={cn(
          mobile
            ? 'w-[10.75rem] max-w-[calc(100vw-9.5rem)] sm:w-[12rem] sm:max-w-[calc(100vw-10.5rem)]'
            : 'w-[14.75rem] max-w-full',
        )}
      />
    </AppLink>
  );
}

function DesktopNavLink({ item }: { item: NavItem }) {
  const { pathname } = useLocation();
  const active = isPathActive(pathname, item.url);

  return (
    <AppLink
      href={item.url}
      className={cn(desktopPrimaryLinkClassName, active && desktopActiveLinkClassName)}
    >
      {item.label}
    </AppLink>
  );
}

function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isActive = item.children?.some((child) => isPathActive(pathname, child.url)) ?? false;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={cn(
          desktopPrimaryLinkClassName,
          'inline-flex cursor-pointer items-center gap-[0.45rem] border-0 bg-transparent',
          isActive && desktopActiveLinkClassName,
        )}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <Icon icon="mdi:chevron-down" className="h-5 w-5 flex-none" />
      </button>

      {open && (
        <div
          className={cn(
            desktopPanelClassName,
            desktopDropdownPanelSizeClassName,
            'max-w-[calc(100vw-2rem)]',
            item.label === 'Marketplace' ? 'right-0 left-auto' : 'left-0',
          )}
        >
          {item.children?.map((child) => (
            <AppLink
              key={child.url}
              href={child.url}
              className={cn(
                desktopDropdownMenuLinkClassName,
                isPathActive(pathname, child.url) && 'bg-primary-50 text-primary-700',
              )}
              onClick={() => setOpen(false)}
            >
              <span>{child.label}</span>
            </AppLink>
          ))}
        </div>
      )}
    </div>
  );
}

function UserAvatar({ user, className = '' }: { user: CurrentUser; className?: string }) {
  const displayName = getDisplayName(user);
  const initials = getInitials(user);

  return (
    <span
      className={cn(
        'inline-flex h-[2.65rem] w-[2.65rem] flex-none items-center justify-center overflow-hidden rounded-full border border-white/25 bg-white/10',
        className,
      )}
    >
      {user.photo ? (
        <img src={user.photo} alt={displayName} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-white text-[0.8rem] font-extrabold text-[#0d78cb]">
          {initials}
        </span>
      )}
    </span>
  );
}

function UserDropdown({
  currentUser,
  onLogout,
  isLoggingOut,
  unreadThreadCount,
}: {
  currentUser: CurrentUser;
  onLogout: () => void;
  isLoggingOut: boolean;
  unreadThreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isAdmin = currentUser.role === 'admin';
  const displayName = getDisplayName(currentUser);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const menuItems = isAdmin
    ? [
        {
          label: 'Admin Dashboard',
          url: ADMIN_ROUTES.DASHBOARD,
        },
        ...authenticatedMenuItems,
      ]
    : authenticatedMenuItems;

  return (
    <div ref={ref} className="relative flex-none">
      <button
        type="button"
        className={cn(
          userAccountTriggerClassName,
          'cursor-pointer gap-3 px-[1.2rem] py-[0.35rem] pl-[0.45rem]',
        )}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <UserAvatar user={currentUser} />
        <span className="flex flex-col gap-[0.1rem] text-left text-[0.95rem] leading-[1.05] text-white">
          <span className="font-medium text-[#c9d6df]">Welcome,</span>
          <strong className="max-w-[8.5rem] overflow-hidden text-[1.05rem] font-extrabold text-ellipsis whitespace-nowrap text-white">
            {displayName}
          </strong>
        </span>
        <UnreadMessagesBadge count={unreadThreadCount} className="ml-1 flex-none" />
        <Icon icon="mdi:chevron-down" className="h-5 w-5 flex-none text-[#9eb8ca]" />
      </button>

      {open && (
        <div className={cn(desktopPanelClassName, desktopDropdownPanelSizeClassName, 'right-0')}>
          {menuItems.map((item) => (
            <AppLink
              key={item.url}
              href={item.url}
              className={cn(
                `${desktopDropdownMenuLinkClassName} justify-between`,
                isPathActive(pathname, item.url) && desktopMenuActiveLinkClassName,
              )}
              onClick={() => setOpen(false)}
            >
              <span>{item.label}</span>
              {item.url === ROUTES.MESSAGES ? (
                <UnreadMessagesBadge count={unreadThreadCount} />
              ) : null}
            </AppLink>
          ))}

          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-[0.65rem] border-0 bg-transparent px-4 py-[0.8rem] text-left text-[0.92rem] font-bold text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-55"
            disabled={isLoggingOut}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <Icon icon="mdi:logout" className="h-[1.15rem] w-[1.15rem] flex-none text-red-600" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const { pathname } = useLocation();
  const isActive = item.children?.some((child) => isPathActive(pathname, child.url)) ?? false;
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <div className="grid gap-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          mobileLinkClassName,
          'w-full cursor-pointer justify-between border-0 bg-transparent text-left',
          isActive && 'bg-white/10 text-white',
        )}
      >
        <span>{item.label}</span>
        <Icon
          icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}
          className="pointer-events-none h-[1.15rem] w-[1.15rem] flex-none md:h-5 md:w-5"
        />
      </button>
      <div className={cn('grid gap-1 overflow-hidden', open ? 'mt-1' : 'hidden')}>
        {item.children?.map((child) => (
          <AppLink
            key={child.url}
            href={child.url}
            onClick={onNavigate}
            className={cn(
              mobileLinkClassName,
              'pl-[1.45rem]',
              isPathActive(pathname, child.url) && 'bg-white/10 text-white',
            )}
          >
            <span>{child.label}</span>
          </AppLink>
        ))}
      </div>
    </div>
  );
}

export function Navigation() {
  const { pathname, search } = useLocation();
  const { isAuthenticated, user: storeUser } = useAuth();
  const clearTokens = useTokenStore((state) => state.clearTokens);
  const clearIdentity = useIdentityStore((state) => state.clearIdentity);
  const { data: freshUser } = useCurrentUser();
  const inboxQuery = useMessagesInbox();
  const currentUser = (freshUser ?? storeUser) as CurrentUser | null;
  const authenticatedUser = isAuthenticated && currentUser ? currentUser : null;
  const unreadThreadCount = authenticatedUser ? (inboxQuery.data?.unreadThreadCount ?? 0) : 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const closeMobileMenu = () => setMobileOpen(false);
  const previousThreadStatesRef = useRef<
    Map<string, { unreadCount: number; lastActivityAt: string }>
  >(new Map());
  const hasPrimedMessageFlashRef = useRef(false);
  const isAdmin = authenticatedUser?.role === 'admin';
  const activeMessagesThreadId =
    pathname === ROUTES.MESSAGES ? new URLSearchParams(search).get('threadId') : null;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (
        !mobileMenuRef.current?.contains(event.target as Node) &&
        !mobileButtonRef.current?.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen || typeof window === 'undefined' || window.innerWidth >= 1024) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!authenticatedUser || !inboxQuery.data) {
      previousThreadStatesRef.current = new Map();
      hasPrimedMessageFlashRef.current = false;
      return;
    }

    const nextThreadStates = new Map(
      inboxQuery.data.threads.map((thread) => [
        thread.id,
        {
          unreadCount: thread.unreadCount,
          lastActivityAt: thread.lastActivityAt,
        },
      ]),
    );

    if (!hasPrimedMessageFlashRef.current) {
      previousThreadStatesRef.current = nextThreadStates;
      hasPrimedMessageFlashRef.current = true;
      return;
    }

    inboxQuery.data.threads.forEach((thread) => {
      if (thread.lastMessageIsOwn || thread.unreadCount <= 0) {
        return;
      }

      if (pathname === ROUTES.MESSAGES && activeMessagesThreadId === thread.id) {
        return;
      }

      const previousThreadState = previousThreadStatesRef.current.get(thread.id);
      const isNewUnreadThread = !previousThreadState;
      const hasIncomingUpdate =
        isNewUnreadThread ||
        thread.unreadCount > previousThreadState.unreadCount ||
        thread.lastActivityAt !== previousThreadState.lastActivityAt;

      if (!hasIncomingUpdate) {
        return;
      }

      useToastStore.getState().addToast({
        type: 'info',
        title: buildMessageFlashTitle(thread),
        message: buildMessageFlashBody(thread),
        duration: 3000,
      });
    });

    previousThreadStatesRef.current = nextThreadStates;
  }, [activeMessagesThreadId, authenticatedUser, inboxQuery.data, pathname]);

  // const handleLogout = async () => {
  //   const setLoggingOut = useTokenStore.getState().setLoggingOut;

  //   setIsLoggingOut(true);
  //   setLoggingOut(true); // ✅ NEW: Set global logout flag
  //   setMobileOpen(false);

  //   try {
  //     // Call API logout if authenticated
  //     if (authenticatedUser) {
  //       try {
  //         await authApi.logout();
  //       } catch (error) {
  //         console.log('Failed to call logout API:', error);
  //       }
  //     }

  //     // Clear authentication state
  //     clearTokens();
  //     clearIdentity();

  //     // Small delay to ensure state updates propagate
  //     await new Promise((resolve) => setTimeout(resolve, 50));

  //     // Hard navigate to home
  //     // window.location.href = ROUTES.HOME;

  //     window.location.replace(window.location.origin + ROUTES.HOME);
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     clearTokens();
  //     clearIdentity();
  //     // window.location.href = ROUTES.HOME;

  //     window.location.replace(window.location.origin + ROUTES.HOME);
  //   } finally {
  //     setIsLoggingOut(false);
  //     setLoggingOut(false); // ✅ NEW: Clear global logout flag
  //   }
  // };

  const handleLogout = () => {
    const setLoggingOut = useTokenStore.getState().setLoggingOut;

    // Close mobile menu
    setMobileOpen(false);

    // Set local loading state
    setIsLoggingOut(true);

    // ✅ CRITICAL: Set global logout flag FIRST
    setLoggingOut(true);

    // ✅ Use requestAnimationFrame to ensure the logout flag renders
    // before we start clearing state
    requestAnimationFrame(() => {
      // Call API logout (fire and forget - don't block)
      if (authenticatedUser) {
        authApi.logout().catch(() => {});
      }

      // Clear authentication state
      clearTokens();
      clearIdentity();

      // ✅ Use another RAF to ensure state clears before navigation
      requestAnimationFrame(() => {
        // Hard navigate to home (atomic operation)
        window.location.replace(window.location.origin + ROUTES.HOME);
      });
    });
  };

  const mobileMenuItems = isAdmin
    ? [
        {
          label: 'Admin Dashboard',
          url: ADMIN_ROUTES.DASHBOARD,
        },
        ...authenticatedMenuItems,
      ]
    : authenticatedMenuItems;

  return (
    <nav
      className="relative z-50 bg-[#003c5f] text-white shadow-[0_1px_0_rgba(7,17,22,0.12)]"
      aria-label="Primary navigation"
    >
      <div className="hidden min-h-36 grid-cols-[minmax(20rem,28.5vw)_minmax(0,1fr)] pr-[var(--app-page-inline-padding)] lg:grid xl:min-h-44 2xl:min-h-48 lg:max-[1360px]:grid-cols-[minmax(18rem,31vw)_minmax(0,1fr)]">
        <BrandMark />

        <div className={cn(navSurfaceClassName, 'grid grid-rows-[44%_56%]')}>
          <div className="flex items-center justify-end gap-6 xl:gap-8 2xl:gap-12">
            <div className="flex items-center gap-8 xl:gap-10 2xl:gap-16">
              {secondaryNavItems.map((item) => (
                <AppLink
                  key={item.url}
                  href={item.url}
                  className={cn(
                    desktopSecondaryLinkClassName,
                    isPathActive(pathname, item.url) && desktopActiveLinkClassName,
                  )}
                >
                  {item.label}
                </AppLink>
              ))}
            </div>

            {authenticatedUser ? (
              <UserDropdown
                currentUser={authenticatedUser}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
                unreadThreadCount={unreadThreadCount}
              />
            ) : (
              <AppLink
                href={AUTH_ROUTES.LOGIN}
                className={cn(
                  accountPillClassName,
                  'justify-center px-[1.65rem] py-[0.7rem] text-base font-extrabold tracking-[0.01em]',
                )}
              >
                Sign In
              </AppLink>
            )}
          </div>

          <div className="ml-auto flex w-fit items-center gap-6 pb-3 xl:gap-8 xl:pb-4 2xl:gap-12 2xl:pb-5">
            {primaryNavItems.map((item) =>
              item.children ? (
                <DesktopDropdown key={item.label} item={item} />
              ) : (
                <DesktopNavLink key={item.label} item={item} />
              ),
            )}
          </div>
        </div>
      </div>

      <div className={cn(navSurfaceClassName, 'relative block lg:hidden')}>
        <div className="grid min-h-[5.25rem] grid-cols-[minmax(0,1fr)_auto] items-stretch pr-[var(--app-page-inline-padding)] sm:min-h-[5.5rem]">
          <BrandMark mobile />
          <button
            ref={mobileButtonRef}
            type="button"
            className="relative z-10 inline-flex min-h-[5.25rem] min-w-[4.5rem] cursor-pointer items-center justify-center border-0 bg-transparent px-4 text-white transition-colors duration-200 hover:bg-white/5 focus-visible:bg-white/10 sm:min-h-[5.5rem] sm:min-w-[5rem]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Icon
              icon={mobileOpen ? 'mdi:close' : 'mdi:menu'}
              className="pointer-events-none h-8 w-8 sm:h-9 sm:w-9"
            />
          </button>
        </div>

        <div
          id="mobile-navigation-menu"
          ref={mobileMenuRef}
          className={cn(
            navSurfaceClassName,
            'absolute inset-x-0 top-full z-40 border-t border-white/10 shadow-[0_1.2rem_2.8rem_rgba(4,18,28,0.28)] transition-[opacity,transform,visibility] duration-200',
            mobileOpen
              ? 'visible translate-y-0 opacity-100'
              : 'pointer-events-none invisible -translate-y-2 opacity-0',
          )}
        >
          <div className="max-h-[calc(100dvh-5.25rem)] overflow-y-auto overscroll-contain px-[var(--app-page-inline-padding)] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:max-h-[calc(100dvh-5.5rem)] sm:pt-4">
            <div className={mobileSectionClassName}>
              {secondaryNavItems.map((item) => (
                <AppLink
                  key={item.url}
                  href={item.url}
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileLinkClassName,
                    isPathActive(pathname, item.url) && 'bg-white/10 text-white',
                  )}
                >
                  {item.label}
                </AppLink>
              ))}
            </div>

            <div className={mobileSectionClassName}>
              {primaryNavItems.map((item) =>
                item.children ? (
                  <MobileNavGroup key={item.label} item={item} onNavigate={closeMobileMenu} />
                ) : (
                  <AppLink
                    key={item.url}
                    href={item.url}
                    onClick={closeMobileMenu}
                    className={cn(
                      mobileLinkClassName,
                      isPathActive(pathname, item.url) && 'bg-white/10 text-white',
                    )}
                  >
                    {item.label}
                  </AppLink>
                ),
              )}
            </div>

            {authenticatedUser ? (
              <div className={mobileSectionClassName}>
                <div className="flex items-center gap-3 px-4 pb-3 pt-1 md:px-5">
                  <UserAvatar user={authenticatedUser} />
                  <div className="flex min-w-0 flex-col text-[0.85rem] text-[#c4d0d9] md:text-[0.92rem]">
                    <span>Welcome,</span>
                    <strong className="overflow-hidden whitespace-nowrap text-ellipsis text-base font-bold text-white md:text-[1.05rem]">
                      {getDisplayName(authenticatedUser)}
                    </strong>
                  </div>
                  <UnreadMessagesBadge count={unreadThreadCount} className="ml-auto flex-none" />
                </div>

                {mobileMenuItems.map((item) => (
                  <AppLink
                    key={item.url}
                    href={item.url}
                    onClick={closeMobileMenu}
                    className={cn(
                      mobileLinkClassName,
                      'justify-between',
                      isPathActive(pathname, item.url) && 'bg-white/10 text-white',
                    )}
                  >
                    <span>{item.label}</span>
                    {item.url === ROUTES.MESSAGES ? (
                      <UnreadMessagesBadge count={unreadThreadCount} />
                    ) : null}
                  </AppLink>
                ))}

                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-3 rounded-[1rem] border-0 bg-transparent px-4 py-3.5 text-left text-[0.98rem] font-bold tracking-[0.03em] text-red-200 transition-colors duration-200 hover:bg-white/10 hover:text-red-100 md:px-5 md:py-4 md:text-base"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  <Icon
                    icon="mdi:logout"
                    className="h-[1.15rem] w-[1.15rem] flex-none md:h-5 md:w-5"
                  />
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <div className={mobileSectionClassName}>
                <AppLink
                  href={AUTH_ROUTES.LOGIN}
                  onClick={closeMobileMenu}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-center text-base font-extrabold tracking-[0.06em] text-white no-underline transition-colors duration-200 hover:bg-white/10"
                >
                  Sign In
                </AppLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

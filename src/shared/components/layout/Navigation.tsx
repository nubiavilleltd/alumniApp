import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  "relative no-underline font-bold tracking-[0.1em] text-[#c4d0d9] transition-colors duration-200 hover:text-white focus-visible:text-white after:pointer-events-none after:absolute after:left-0 after:h-[5px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-white/85 after:content-[''] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";
const desktopActiveLinkClassName = 'text-white after:scale-x-100';
const desktopPrimaryLinkClassName = `${desktopLinkBaseClassName} whitespace-nowrap text-[clamp(1.05rem,1.36vw,1.75rem)] after:bottom-[-1.12rem] lg:max-[1360px]:after:bottom-[-0.95rem] xl:after:bottom-[-1.28rem]`;
const desktopSecondaryLinkClassName = `${desktopLinkBaseClassName} text-[clamp(0.95rem,1.18vw,1.35rem)] after:bottom-[-0.55rem]`;
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
  'mt-[0.85rem] grid gap-[0.35rem] border-t border-white/15 pt-[0.85rem] first:mt-0 first:border-t-0';
const mobileLinkClassName =
  'flex items-center gap-[0.65rem] rounded-[0.85rem] px-[0.95rem] py-[0.85rem] text-[0.98rem] font-bold tracking-[0.04em] leading-[1.25] text-[#d0d9e0] no-underline transition-colors duration-200 hover:bg-white/10 hover:text-white';

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
      aria-label={`${count} unread message${count === 1 ? '' : 's'}`}
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
          ? 'min-h-[5.25rem] items-center py-3'
          : 'items-center justify-center py-[clamp(0.8rem,1.4vw,1.25rem)]',
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
        imageClassName={cn(mobile ? 'h-[2.8rem] w-[2.8rem]' : 'h-[3.35rem] w-[3.35rem]')}
        wordmarkClassName={cn(
          mobile ? 'w-[10.75rem] max-w-[calc(100vw-9.25rem)]' : 'w-[14.75rem] max-w-full',
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
  unreadMessageCount,
}: {
  currentUser: CurrentUser;
  onLogout: () => void;
  isLoggingOut: boolean;
  unreadMessageCount: number;
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
        <UnreadMessagesBadge count={unreadMessageCount} className="ml-1 flex-none" />
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
                <UnreadMessagesBadge count={unreadMessageCount} />
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

function MobileNavGroup({ item }: { item: NavItem }) {
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
          className="h-[1.15rem] w-[1.15rem] flex-none"
        />
      </button>
      <div className={cn('grid gap-1 overflow-hidden', open ? 'mt-1' : 'hidden')}>
        {item.children?.map((child) => (
          <AppLink
            key={child.url}
            href={child.url}
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
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { isAuthenticated, user: storeUser } = useAuth();
  const clearTokens = useTokenStore((state) => state.clearTokens);
  const clearIdentity = useIdentityStore((state) => state.clearIdentity);
  const { data: freshUser } = useCurrentUser();
  const inboxQuery = useMessagesInbox();
  const currentUser = (freshUser ?? storeUser) as CurrentUser | null;
  const authenticatedUser = isAuthenticated && currentUser ? currentUser : null;
  const unreadMessageCount = authenticatedUser ? (inboxQuery.data?.unreadCount ?? 0) : 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
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
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        !mobileMenuRef.current?.contains(event.target as Node) &&
        !mobileButtonRef.current?.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };

    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const handleLogout = async () => {
    const setLoggingOut = useTokenStore.getState().setLoggingOut;

    setIsLoggingOut(true);
    setLoggingOut(true); // ✅ NEW: Set global logout flag
    setMobileOpen(false);

    try {
      // Call API logout if authenticated
      if (authenticatedUser) {
        try {
          await authApi.logout();
        } catch (error) {
          console.log('Failed to call logout API:', error);
        }
      }

      // Clear authentication state
      clearTokens();
      clearIdentity();

      // Small delay to ensure state updates propagate
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Hard navigate to home
      window.location.href = ROUTES.HOME;
    } catch (error) {
      console.error('Logout failed:', error);
      clearTokens();
      clearIdentity();
      window.location.href = ROUTES.HOME;
    } finally {
      setIsLoggingOut(false);
      setLoggingOut(false); // ✅ NEW: Clear global logout flag
    }
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
      <div className="hidden min-h-[clamp(8.5rem,11.8vw,11.8rem)] grid-cols-[minmax(20rem,28.5vw)_minmax(0,1fr)] pr-[var(--app-page-inline-padding)] lg:grid lg:max-[1360px]:grid-cols-[minmax(18rem,31vw)_minmax(0,1fr)]">
        <BrandMark />

        <div className={cn(navSurfaceClassName, 'grid grid-rows-[44%_56%]')}>
          <div className="flex items-center justify-end gap-[clamp(1.5rem,3vw,3rem)]">
            <div className="flex items-center gap-[clamp(2rem,4.5vw,4rem)]">
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
                unreadMessageCount={unreadMessageCount}
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

          <div className="flex items-center justify-between gap-[clamp(2.25rem,5vw,6.25rem)] pb-[clamp(0.75rem,1.2vw,1.25rem)] pl-[var(--app-page-inline-padding)] lg:max-[1360px]:gap-[clamp(1.4rem,3vw,2.75rem)]">
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

      <div
        className={cn(navSurfaceClassName, 'block pr-[var(--app-page-inline-padding)] lg:hidden')}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch">
          <BrandMark mobile />
          <button
            ref={mobileButtonRef}
            type="button"
            className="inline-flex w-[4.75rem] cursor-pointer items-center justify-center border-0 bg-transparent text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} className="h-8 w-8" />
          </button>
        </div>

        <div
          ref={mobileMenuRef}
          className={cn(
            'overflow-hidden transition-[max-height,padding] duration-200',
            mobileOpen ? 'max-h-[90vh] overflow-y-auto pb-5 pt-3' : 'max-h-0 px-0 py-0',
          )}
        >
          <div className={mobileSectionClassName}>
            {secondaryNavItems.map((item) => (
              <AppLink
                key={item.url}
                href={item.url}
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
                <MobileNavGroup key={item.label} item={item} />
              ) : (
                <AppLink
                  key={item.url}
                  href={item.url}
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
              <div className="flex items-center gap-3 px-[0.95rem] pb-[0.75rem] pt-[0.5rem]">
                <UserAvatar user={authenticatedUser} />
                <div className="flex min-w-0 flex-col text-[0.85rem] text-[#c4d0d9]">
                  <span>Welcome,</span>
                  <strong className="overflow-hidden whitespace-nowrap text-ellipsis text-base font-bold text-white">
                    {getDisplayName(authenticatedUser)}
                  </strong>
                </div>
                <UnreadMessagesBadge count={unreadMessageCount} className="ml-auto flex-none" />
              </div>

              {mobileMenuItems.map((item) => (
                <AppLink
                  key={item.url}
                  href={item.url}
                  className={cn(
                    mobileLinkClassName,
                    'justify-between',
                    isPathActive(pathname, item.url) && 'bg-white/10 text-white',
                  )}
                >
                  <span>{item.label}</span>
                  {item.url === ROUTES.MESSAGES ? (
                    <UnreadMessagesBadge count={unreadMessageCount} />
                  ) : null}
                </AppLink>
              ))}

              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-[0.65rem] rounded-[0.85rem] border-0 bg-transparent px-[0.95rem] py-[0.85rem] text-left text-[0.98rem] font-bold tracking-[0.04em] text-red-200 transition-colors duration-200 hover:bg-white/10 hover:text-red-100"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                <Icon icon="mdi:logout" className="h-[1.15rem] w-[1.15rem] flex-none" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <div className={mobileSectionClassName}>
              <AppLink
                href={AUTH_ROUTES.LOGIN}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-center text-base font-extrabold tracking-[0.08em] text-white no-underline transition-colors duration-200 hover:bg-white/10"
              >
                Sign In
              </AppLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

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
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '@/features/user/routes';
import { AppLink } from '../ui/AppLink';

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
  { label: 'My Business', url: MARKETPLACE_ROUTES.MY_BUSINESS },
  { label: 'Settings', url: USER_ROUTES.SETTINGS },
];

const navSurfaceClassName =
  'bg-[linear-gradient(106deg,_rgb(var(--color-primary-500))_0%,_#003a5d_92%)]';
const desktopLinkBaseClassName =
  "relative no-underline font-bold tracking-[0.1em] text-[#c4d0d9] transition-colors duration-200 hover:text-white focus-visible:text-white after:pointer-events-none after:absolute after:bottom-[-0.45rem] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-white/85 after:content-[''] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";
const desktopActiveLinkClassName = 'text-white after:scale-x-100';
const desktopPrimaryLinkClassName = `${desktopLinkBaseClassName} whitespace-nowrap text-[clamp(1.05rem,1.36vw,1.75rem)]`;
const desktopSecondaryLinkClassName = `${desktopLinkBaseClassName} text-[clamp(0.95rem,1.18vw,1.35rem)]`;
const desktopPanelClassName =
  'absolute top-[calc(100%+1rem)] z-[60] overflow-hidden border border-[#d7e6ef] bg-white shadow-[0_1.25rem_2.5rem_rgba(7,17,22,0.14)]';
const desktopMenuLinkClassName =
  'flex items-center gap-3 px-6 py-[0.95rem] text-[clamp(1.05rem,1.3vw,1.35rem)] font-bold leading-[1.25] text-[#4f5864] no-underline transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700';
const accountPillClassName =
  'inline-flex min-h-[3.35rem] items-center rounded-full border border-white/25 bg-[#001f38]/20 text-white no-underline transition-colors duration-200 hover:bg-white/10';
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

function BrandMark({ mobile = false }: { mobile?: boolean }) {
  return (
    <AppLink
      href={ROUTES.HOME}
      className={cn(
        'relative isolate flex overflow-hidden bg-white text-primary-500 no-underline',
        mobile
          ? 'min-h-[5.25rem] items-center px-[0.85rem] py-[0.6rem]'
          : 'items-center justify-center px-[clamp(0.9rem,1.8vw,1.6rem)] py-[clamp(0.75rem,1.4vw,1.25rem)]',
      )}
    >
      <span
        className="absolute inset-0 -z-10 bg-[url('/navbarImage.png')] bg-[length:auto_100%] bg-right bg-no-repeat"
        aria-hidden="true"
      />
      <span
        className={cn(
          'flex w-full items-center',
          mobile ? 'max-w-[22rem] gap-[0.65rem]' : 'justify-center gap-[clamp(0.65rem,1.1vw,1rem)]',
        )}
      >
        <img
          src="/logo.png"
          alt=""
          className={cn(
            'h-auto flex-none object-contain',
            mobile
              ? 'h-[2.8rem] w-[2.8rem]'
              : 'h-[clamp(2.75rem,4vw,4.15rem)] w-[clamp(2.75rem,4vw,4.15rem)]',
          )}
        />
        <span className="flex min-w-0 flex-col justify-center">
          <span
            className={cn(
              "[font-family:Georgia,'Times_New_Roman',serif] block whitespace-nowrap font-bold leading-[0.9] tracking-[0.34em] text-primary-500",
              mobile
                ? 'text-[1.55rem] max-[420px]:text-[1.35rem]'
                : 'text-[clamp(1.75rem,2.65vw,3.45rem)]',
            )}
          >
            FGGC
          </span>
          <span
            className={cn(
              "[font-family:Georgia,'Times_New_Roman',serif] mt-[0.35rem] block whitespace-nowrap font-bold leading-none text-primary-500",
              mobile ? 'text-[0.75rem]' : 'text-[clamp(0.85rem,1.1vw,1.35rem)]',
            )}
          >
            Alumnae Association
          </span>
        </span>
        <span
          className={cn(
            'w-px flex-none bg-[rgba(0,119,204,0.6)]',
            mobile
              ? 'mx-[0.35rem] h-[2.75rem] max-[420px]:hidden'
              : 'mx-[clamp(0.8rem,1.5vw,1.35rem)] hidden h-[clamp(3rem,5vw,4.6rem)] min-[1361px]:block',
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "[font-family:'Segoe_Script','Brush_Script_MT',cursive] flex flex-none rotate-[-2deg] flex-col whitespace-nowrap font-bold leading-[1.2] text-primary-500",
            mobile
              ? 'text-[0.85rem] max-[420px]:hidden'
              : 'hidden text-[clamp(0.95rem,1.35vw,1.55rem)] min-[1361px]:flex',
          )}
        >
          <span>Lagos</span>
          <span>Chapter</span>
        </span>
      </span>
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
            'w-[min(19.5rem,calc(100vw-2rem))] rounded-[1.05rem] py-4',
            item.label === 'Marketplace' ? 'right-0 left-auto' : 'left-0',
          )}
        >
          {item.children?.map((child) => (
            <AppLink
              key={child.url}
              href={child.url}
              className={cn(
                desktopMenuLinkClassName,
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
        'inline-flex h-[2.65rem] w-[2.65rem] flex-none items-center justify-center overflow-hidden rounded-full border-2 border-white/15 bg-white',
        className,
      )}
    >
      {user.photo ? (
        <img src={user.photo} alt={displayName} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-primary-50 text-[0.8rem] font-extrabold text-primary-700">
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
}: {
  currentUser: CurrentUser;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
          accountPillClassName,
          'cursor-pointer gap-3 px-[1.2rem] py-[0.35rem] pl-[0.45rem]',
        )}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <UserAvatar user={currentUser} />
        <span className="flex flex-col gap-[0.1rem] text-left text-[0.95rem] leading-[1.05] text-white">
          <span className="font-medium text-[#c4d0d9]">Welcome,</span>
          <strong className="max-w-[8.5rem] overflow-hidden text-[1.05rem] font-extrabold text-ellipsis whitespace-nowrap text-white">
            {displayName}
          </strong>
        </span>
        <Icon icon="mdi:chevron-down" className="h-5 w-5 flex-none" />
      </button>

      {open && (
        <div
          className={cn(desktopPanelClassName, 'right-0 w-[17.5rem] rounded-[0.9rem] py-[0.45rem]')}
        >
          {menuItems.map((item) => (
            <AppLink
              key={item.url}
              href={item.url}
              className="flex items-center gap-[0.65rem] px-4 py-[0.8rem] text-left text-[0.92rem] font-bold text-[#4f5864] transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700"
              onClick={() => setOpen(false)}
            >
              <span>{item.label}</span>
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
  const { pathname } = useLocation();
  const { isAuthenticated, user: storeUser } = useAuth();
  const clearTokens = useTokenStore((state) => state.clearTokens);
  const clearIdentity = useIdentityStore((state) => state.clearIdentity);
  const { data: freshUser } = useCurrentUser();
  const currentUser = (freshUser ?? storeUser) as CurrentUser | null;
  const authenticatedUser = isAuthenticated && currentUser ? currentUser : null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const isAdmin = authenticatedUser?.role === 'admin';

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (authenticatedUser) {
      try {
        await authApi.logout();
      } catch {
        /* Always clear local auth state even if the server session has expired. */
      }
    }
    clearTokens();
    clearIdentity();
    setMobileOpen(false);
    navigate(ROUTES.HOME, { replace: true });
    setIsLoggingOut(false);
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
      <div className="hidden min-h-[clamp(8.5rem,11.8vw,11.8rem)] grid-cols-[minmax(20rem,28.5vw)_minmax(0,1fr)] lg:grid lg:max-[1360px]:grid-cols-[minmax(18rem,31vw)_minmax(0,1fr)]">
        <BrandMark />

        <div className={cn(navSurfaceClassName, 'grid grid-rows-[44%_56%]')}>
          <div className="flex items-center justify-end gap-[clamp(1.5rem,3vw,3rem)] px-[clamp(2rem,4.6vw,5rem)]">
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
              />
            ) : (
              <AppLink
                href={AUTH_ROUTES.LOGIN}
                className={cn(
                  accountPillClassName,
                  'px-[1.65rem] py-[0.7rem] text-base font-bold tracking-[0.08em]',
                )}
              >
                Login
              </AppLink>
            )}
          </div>

          <div className="flex items-center justify-center gap-[clamp(2.25rem,5vw,6.25rem)] px-[clamp(2rem,4vw,4.5rem)] pb-[clamp(0.75rem,1.2vw,1.25rem)] lg:max-[1360px]:gap-[clamp(1.4rem,3vw,2.75rem)]">
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

      <div className={cn(navSurfaceClassName, 'block lg:hidden')}>
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
            mobileOpen ? 'max-h-[90vh] overflow-y-auto px-4 pb-5 pt-3' : 'max-h-0 px-0 py-0',
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
              </div>

              {mobileMenuItems.map((item) => (
                <AppLink key={item.url} href={item.url} className={mobileLinkClassName}>
                  <span>{item.label}</span>
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
                Login
              </AppLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

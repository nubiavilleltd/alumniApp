import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/features/authentication/services/auth.service';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { AppLink } from '../ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';
import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';
import { EVENT_ROUTES } from '@/features/events/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { USER_ROUTES } from '@/features/user/routes';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { useAuth } from '@/features/authentication/hooks/useAuth';

type NavChild = {
  label: string;
  url: string;
  icon?: string;
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
      { label: 'Announcements', url: ROUTES.NEWS, icon: 'mdi:newspaper-variant-outline' },
      { label: 'Events', url: EVENT_ROUTES.ROOT, icon: 'mdi:calendar-month-outline' },
      { label: 'Our Projects', url: ROUTES.PROJECTS.ROOT, icon: 'mdi:folder-star-outline' },
    ],
  },
  {
    label: 'Marketplace',
    url: MARKETPLACE_ROUTES.ROOT,
    children: [
      { label: 'Marketplace', url: MARKETPLACE_ROUTES.ROOT, icon: 'mdi:storefront-outline' },
      { label: 'Job Vacancies', url: ROUTES.JOB_VACANCIES, icon: 'mdi:briefcase-outline' },
    ],
  },
];

const authenticatedMenuItems: NavChild[] = [
  { label: 'View Profile', url: USER_ROUTES.PROFILE, icon: 'mdi:account-outline' },
  { label: 'Dashboard', url: USER_ROUTES.DASHBOARD, icon: 'mdi:view-dashboard-outline' },
  { label: 'Messaging Center', url: ROUTES.MESSAGES, icon: 'mdi:message-outline' },
  {
    label: 'My Registered Events',
    url: EVENT_ROUTES.MY_EVENTS,
    icon: 'mdi:calendar-check-outline',
  },
  { label: 'My Business', url: MARKETPLACE_ROUTES.MY_BUSINESS, icon: 'mdi:store-cog-outline' },
  { label: 'Settings', url: USER_ROUTES.SETTINGS, icon: 'mdi:cog-outline' },
];

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

function BrandMark({ className = '' }: { className?: string }) {
  return (
    <AppLink href={ROUTES.HOME} className={`site-nav__brand ${className}`}>
      <span className="site-nav__brand-art" aria-hidden="true" />
      <span className="site-nav__brand-content">
        <img src="/logo.png" alt="" className="site-nav__crest" />
        <span className="site-nav__brand-name">
          <span className="site-nav__letters">FGGC</span>
          <span className="site-nav__association">Alumnae Association</span>
        </span>
        <span className="site-nav__brand-divider" aria-hidden="true" />
        <span className="site-nav__chapter">
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
      className={`site-nav__primary-link ${active ? 'site-nav__primary-link--active' : ''}`}
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
    <div
      ref={ref}
      className={`site-nav__dropdown ${
        item.label === 'Marketplace' ? 'site-nav__dropdown--right' : ''
      }`}
    >
      <button
        type="button"
        className={`site-nav__primary-link site-nav__dropdown-trigger ${
          isActive ? 'site-nav__primary-link--active' : ''
        }`}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <Icon icon="mdi:chevron-down" className="site-nav__chevron" />
      </button>

      {open && (
        <div className="site-nav__dropdown-menu">
          {item.children?.map((child) => (
            <AppLink
              key={child.url}
              href={child.url}
              className="site-nav__dropdown-link"
              onClick={() => setOpen(false)}
            >
              {child.icon && <Icon icon={child.icon} />}
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
    <span className={`site-nav__avatar ${className}`}>
      {user.photo ? (
        <img src={user.photo} alt={displayName} />
      ) : (
        <span className="site-nav__avatar-fallback">{initials}</span>
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
          icon: 'mdi:shield-account-outline',
        },
        ...authenticatedMenuItems,
      ]
    : authenticatedMenuItems;

  return (
    <div ref={ref} className="site-nav__user">
      <button
        type="button"
        className="site-nav__user-trigger"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <UserAvatar user={currentUser} />
        <span className="site-nav__user-copy">
          <span>Welcome,</span>
          <strong>{displayName}</strong>
        </span>
        <Icon icon="mdi:chevron-down" className="site-nav__user-chevron" />
      </button>

      {open && (
        <div className="site-nav__user-menu">
          {menuItems.map((item) => (
            <AppLink
              key={item.url}
              href={item.url}
              className="site-nav__user-menu-link"
              onClick={() => setOpen(false)}
            >
              <Icon icon={item.icon ?? 'mdi:circle-outline'} />
              <span>{item.label}</span>
            </AppLink>
          ))}

          <button
            type="button"
            className="site-nav__user-menu-link site-nav__user-menu-link--danger"
            disabled={isLoggingOut}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <Icon icon="mdi:logout" />
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

  return (
    <div className="site-nav__mobile-group">
      <p
        className={`site-nav__mobile-group-label ${isActive ? 'site-nav__mobile-link--active' : ''}`}
      >
        {item.label}
      </p>
      <div className="site-nav__mobile-subnav">
        {item.children?.map((child) => (
          <AppLink
            key={child.url}
            href={child.url}
            className={`site-nav__mobile-link site-nav__mobile-link--sub ${
              isPathActive(pathname, child.url) ? 'site-nav__mobile-link--active' : ''
            }`}
          >
            {child.icon && <Icon icon={child.icon} />}
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
          icon: 'mdi:shield-account-outline',
        },
        ...authenticatedMenuItems,
      ]
    : authenticatedMenuItems;

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav__desktop">
        <BrandMark className="site-nav__brand--desktop" />

        <div className="site-nav__body">
          <div className="site-nav__secondary-row">
            <div className="site-nav__secondary-links">
              {secondaryNavItems.map((item) => (
                <AppLink key={item.url} href={item.url} className="site-nav__secondary-link">
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
              <AppLink href={AUTH_ROUTES.LOGIN} className="site-nav__login">
                Login
              </AppLink>
            )}
          </div>

          <div className="site-nav__primary-row">
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

      <div className="site-nav__mobile">
        <div className="site-nav__mobile-bar">
          <BrandMark className="site-nav__brand--mobile" />
          <button
            ref={mobileButtonRef}
            type="button"
            className="site-nav__mobile-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} />
          </button>
        </div>

        <div
          ref={mobileMenuRef}
          className={`site-nav__mobile-menu ${mobileOpen ? 'site-nav__mobile-menu--open' : ''}`}
        >
          <div className="site-nav__mobile-section">
            {secondaryNavItems.map((item) => (
              <AppLink
                key={item.url}
                href={item.url}
                className={`site-nav__mobile-link ${
                  isPathActive(pathname, item.url) ? 'site-nav__mobile-link--active' : ''
                }`}
              >
                {item.label}
              </AppLink>
            ))}
          </div>

          <div className="site-nav__mobile-section">
            {primaryNavItems.map((item) =>
              item.children ? (
                <MobileNavGroup key={item.label} item={item} />
              ) : (
                <AppLink
                  key={item.url}
                  href={item.url}
                  className={`site-nav__mobile-link ${
                    isPathActive(pathname, item.url) ? 'site-nav__mobile-link--active' : ''
                  }`}
                >
                  {item.label}
                </AppLink>
              ),
            )}
          </div>

          {authenticatedUser ? (
            <div className="site-nav__mobile-section site-nav__mobile-account">
              <div className="site-nav__mobile-user">
                <UserAvatar user={authenticatedUser} />
                <div>
                  <span>Welcome,</span>
                  <strong>{getDisplayName(authenticatedUser)}</strong>
                </div>
              </div>

              {mobileMenuItems.map((item) => (
                <AppLink key={item.url} href={item.url} className="site-nav__mobile-link">
                  <Icon icon={item.icon ?? 'mdi:circle-outline'} />
                  <span>{item.label}</span>
                </AppLink>
              ))}

              <button
                type="button"
                className="site-nav__mobile-link site-nav__mobile-link--danger"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                <Icon icon="mdi:logout" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <div className="site-nav__mobile-section">
              <AppLink href={AUTH_ROUTES.LOGIN} className="site-nav__mobile-login">
                Login
              </AppLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

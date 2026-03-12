import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSiteConfig } from '@/data/content';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { AppLink } from '../ui/AppLink';
import Button from '../ui/Button';

interface NavigationItem {
  label: string;
  url: string;
  icon?: string;
}

const navigation: NavigationItem[] = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'About Us',
    url: '/about',
  },
  {
    label: 'Alumnae Directory',
    url: '/alumni/profiles',
  },
  {
    label: 'Alumnae Connect',
    url: '/alumni/profiles',
  },
  {
    label: 'Events',
    url: '/events',
  },
  {
    label: 'Market Place',
    url: '/marketplace',
  },
];

export function Navigation() {
  const config = getSiteConfig();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({});
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const years = Array.from(
    { length: config.years.end - config.years.start + 1 },
    (_, i) => config.years.end - i,
  );

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent): void => {
      const target = event.target as Node;
      const inMenu = mobileMenuRef.current?.contains(target);
      const inButton = mobileButtonRef.current?.contains(target);
      if (!inMenu && !inButton) {
        setMobileMenuOpen(false);
      }
    };

    const onResize = (): void => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', onOutsideClick);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('click', onOutsideClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const toggleMobileSection = (sectionId: string): void => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleLogout = () => {
    clearSession();
    setMobileMenuOpen(false);
    navigate('/', { replace: true });
  };

  return (
    // <nav className="bg-white/95 backdrop-blur border-b border-accent-100 sticky top-0 z-50">
    <nav className="bg-primary-500 backdrop-blur border-b border-accent-100 sticky top-0 z-50 text-white">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <AppLink href="/" className="flex items-center space-x-3 group">
              {/* <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"> */}
              <div className="w-10 h-10 lg:w-10 lg:h-10">
                {config.site.logo ? (
                  <img
                    src={config.site.logo}
                    alt={`${config.site.name} logo`}
                    className="w-full h-full object-cover rounded-full border border-2 border-white duration-300 hover:scale-105"
                  />
                ) : (
                  <Icon icon="mdi:account-group" className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                {/* <h1 className="text-sm lg:text-2xl font-bold text-white group-hover:text-primary-200 transition-colors duration-200"> */}
                <h1 className="text-lg font-bold text-white group-hover:text-primary-200 transition-colors duration-200">
                  {config.site.name}
                </h1>
                <p className="text-xs text-gray-50 hidden sm:block">
                  Federal Government Girls College
                </p>
              </div>
            </AppLink>
          </div>

          <div className="hidden lg:flex items-center space-x-5">
            {navigation.map((item) => (
              <div className="relative group" key={item.label}>
                <AppLink href={item.url} className="nav-link py-2">
                  {item.icon && (
                    <Icon icon={`mdi:${item.icon}`} className="w-4 h-4 mr-2 inline-block" />
                  )}
                  {item.label}
                </AppLink>
              </div>
            ))}

            {currentUser ? (
              <div className="flex items-center gap-3">
                <AppLink
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-3 py-2 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
                    {currentUser.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-accent-900">
                      {currentUser.fullName}
                    </p>
                    <p className="text-xs text-accent-500">Dashboard</p>
                  </div>
                </AppLink>

                <button className="btn btn-outline btn-sm" type="button" onClick={handleLogout}>
                  <Icon icon="mdi:logout" className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <AppLink href="/auth/login">
                {/* <Icon icon="mdi:login" className="mr-2 h-5 w-5" /> */}

                <Button variant="white">Login</Button>
              </AppLink>
            )}
          </div>

          <button
            ref={mobileButtonRef}
            className="lg:hidden p-2 rounded-lg text-accent-600 hover:text-accent-900 hover:bg-accent-100 transition-colors duration-200"
            aria-label="Toggle mobile menu"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <Icon icon="mdi:menu" className="w-6 h-6" />
          </button>
        </div>

        <div ref={mobileMenuRef} className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="py-4 space-y-2 border-t border-accent-100">
            {navigation.map((item) => {
              const sectionId = `mobile-mega-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
              const sectionOpen = !!openMobileSections[sectionId];

              return (
                <div className="space-y-2" key={item.label}>
                  <AppLink
                    href={item.url}
                    className="block px-4 py-3 text-accent-700 hover:text-primary-600 hover:bg-accent-50 rounded-lg transition-colors duration-200"
                  >
                    {item.icon && (
                      <Icon icon={`mdi:${item.icon}`} className="w-4 h-4 mr-3 inline" />
                    )}
                    {item.label}
                  </AppLink>
                </div>
              );
            })}

            {currentUser ? (
              <div className="space-y-3 px-4 pt-4">
                <AppLink
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
                    {currentUser.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-accent-900">{currentUser.fullName}</p>
                    <p className="text-sm text-accent-500">Open dashboard</p>
                  </div>
                </AppLink>

                <button
                  className="btn btn-outline btn-sm w-full justify-center"
                  type="button"
                  onClick={handleLogout}
                >
                  <Icon icon="mdi:logout" className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-4 pt-4">
                <AppLink
                  href="/auth/login"
                  className="btn btn-outline btn-sm w-full justify-center"
                >
                  Login
                </AppLink>
                <AppLink
                  href="/auth/register"
                  className="btn btn-primary btn-sm w-full justify-center"
                >
                  Register
                </AppLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

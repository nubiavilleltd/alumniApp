// shared/components/layout/RootLayout.tsx

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useCallback, useEffect, useState } from 'react';
import { HeroReadinessContext } from '@/features/homepage/components/HeroReadinessContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { DonationButton } from '../ui/DonationButton';
import { ROUTES } from '@/shared/constants/routes';
import { useCartLoader } from '@/features/store/hooks/useCartLoader';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { Breadcrumbs } from '../ui/Breadcrumbs';

// ─── Route label config ──────────────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  about: 'About Us',
  contact: 'Contact Us',
  faqs: 'FAQs',
  welfare: 'Welfare',
  'welfare-zones': 'Welfare Zones',
  marketplace: 'Marketplace',
  resources: 'Resources',
  donation: 'Donation',
  volunteer: 'Volunteer',
  announcements: 'Announcements',
  messages: 'Messages',
  profile: 'Profile',
  store: 'Store',
  admin: 'Admin Dashboard',
  orders: 'Orders',
  items: 'Items',
  create: 'Add Item',
  edit: 'Edit',
  alumni: 'Alumni',
  profiles: 'Profiles',
  auth: 'Authentication',
  login: 'Login',
  register: 'Register',
};

// 👇 Routes that have full-bleed heroes and should NOT show breadcrumbs
const HERO_ROUTES = ['/volunteer', '/about'];

// ─── Breadcrumb builder (pure, module-scope) ─────────────────────────────────
function buildBreadcrumbsFromPath(pathname: string) {
  const crumbs: { label: string; href?: string }[] = [
    { label: 'Home', href: ROUTES.HOME },
  ];

  const segments = pathname.split('/').filter(Boolean);

  segments.forEach((segment, index) => {
    // Skip dynamic IDs
    const isId = /^\d+$/.test(segment) || /^[0-9a-f-]{8,}$/i.test(segment);
    if (isId) return;

    const label =
      ROUTE_LABELS[segment.toLowerCase()] ??
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const href = '/' + segments.slice(0, index + 1).join('/');
    crumbs.push({ label, href });
  });

  // The last crumb is the current page — no link
  if (crumbs.length > 1) {
    delete crumbs[crumbs.length - 1].href;
  }

  return crumbs;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RootLayout() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [homeHeroReady, setHomeHeroReady] = useState(false);
  const markHeroReady = useCallback(() => setHomeHeroReady(true), []);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useCartLoader(isAuthenticated);

  const isHomePage = pathname === ROUTES.HOME;
  const isDonationPage = pathname.includes(ROUTES.DONATION);

  const showBackToHomeButton = !isHomePage;

  // 👇 Hide breadcrumbs on routes with full-bleed heroes
  const hideBreadcrumbs = HERO_ROUTES.some((r) => pathname.startsWith(r));
  const breadcrumbs =
    !isHomePage && !hideBreadcrumbs ? buildBreadcrumbsFromPath(pathname) : [];

  const isRouteOrChild = (route: string): boolean =>
    pathname === route || pathname.startsWith(`${route}/`);

  const isEcommerceRoute =
    isRouteOrChild(ROUTES.ORDER.ROOT) ||
    isRouteOrChild(ROUTES.STORE.ROOT) ||
    isRouteOrChild('admin/orders');

  const showDonationButton = !isHomePage && !isDonationPage;
  const showBackgroundDecorations = !isHomePage || homeHeroReady;
  const showBackgroundVideo = !isEcommerceRoute && showBackgroundDecorations;

  useEffect(() => {
    const onScroll = (): void => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHomePage = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div
      className={`app-root-surface min-h-screen flex flex-col text-gray-900 font-sans antialiased ${showBackgroundVideo ? 'alumni-page-background' : ''}`}
    >
      {showBackgroundVideo && (
        <video
          className="alumni-background-video"
          src="/bg/alumni-bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      )}

      <Navigation />

      <main className="app-main flex-grow">
        {/* 👇 Auto-generated breadcrumbs */}
        {breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} />
          // <div className="container-custom pt-6">
          //   <Breadcrumbs items={breadcrumbs} />
          // </div>
        )}

        <HeroReadinessContext.Provider value={markHeroReady}>
          <Outlet />
        </HeroReadinessContext.Provider>
      </main>

      <Footer />

      <ToastContainer />

      {showBackToHomeButton && (
        <button
          type="button"
          onClick={goToHomePage}
          className="fixed bottom-8 left-8 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white p-3 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Back to home page"
          title="Back to Home"
        >
          <Icon icon="mdi:home" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
        {showDonationButton && <DonationButton />}

        <button
          type="button"
          className={`bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
            showBackToTop
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="Back to top"
          onClick={scrollToTop}
        >
          <Icon icon="mdi:arrow-up" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
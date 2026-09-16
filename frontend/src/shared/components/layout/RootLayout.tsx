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
import { Breadcrumbs, type Crumb } from '../ui/Breadcrumbs';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';
import {
  BreadcrumbProvider,
  useBreadcrumbContext,
} from '@/shared/contexts/BreadcrumbContext';

// ─── Route label config ───────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  // Top-level / public
  about: 'About Us',
  contact: 'Contact Us',
  faqs: 'FAQs',
  welfare: 'Welfare',
  'welfare-zones': 'Welfare Zones',
  'welfare-committee-contact': 'Welfare Committee Contact',
  marketplace: 'Marketplace',
  'my-business': 'My Business',
  resources: 'Resources',
  donation: 'Donation',
  volunteer: 'Volunteer',
  'join-projects': 'Join Projects',
  'social-media-feed': 'Social Media Feed',
  leadership: 'Leadership',
  announcements: 'Announcements',
  messages: 'Messages',
  profile: 'Profile',
  store: 'Store',

  // News / content
  news: 'News',
  'live-news': 'Live News',
  blog: 'Blog',
  blogs: 'Blogs',
  'blog-coming-soon': 'Blog',

  // Events
  events: 'Events',
  'my-events': 'My Events',
  create: 'Create Event',
  edit: 'Edit',
  attendees: 'Attendees',

  // Projects
  projects: 'Projects',

  // Jobs
  'job-vacancies': 'Job Vacancies',
  'my-job-posts': 'My Posts',

  // Store / orders
  product: 'Product',
  cart: 'Cart',
  checkout: 'Checkout',
  orders: 'Orders',
  order: 'Order',

  // User
  user: 'My Account',
  dashboard: 'Dashboard',
  'edit-profile': 'Edit Profile',
  settings: 'Settings',

  // Alumni
  alumni: 'Alumni',
  profiles: 'Profiles',

  // Admin
  admin: 'Admin Dashboard',
  members: 'Members',
  items: 'Items',
  new: 'Add Item',
  registrations: 'Registrations',
  'pages-content': 'Pages Content',
  'event-registrations': 'Registrations',

  // Auth
  auth: 'Authentication',
  login: 'Login',
  register: 'Register',
};

// Routes with full-bleed heroes — no breadcrumbs at all
const HERO_ROUTES = ['/volunteer', '/about', '/join-projects'];

// Routes where the page will provide a dynamic breadcrumb override.
// While we wait for the override, we show a skeleton instead of the
// auto trail, to avoid a flash of incorrect breadcrumb.
// const DYNAMIC_BREADCRUMB_ROUTES: RegExp[] = [
//   /^\/admin\/events\/[^/]+$/,
//   /^\/admin\/orders\/[^/]+$/,
//   /^\/admin\/projects\/[^/]+$/,
//   /^\/events\/[^/]+\/attendees$/,
//   /^\/events\/[^/]+\/edit$/,
//   /^\/projects\/[^/]+$/,
//   /^\/news\/blog\/[^/]+$/,
//   /^\/news\/[^/]+$/,
//   /^\/live-news\/[^/]+$/,
//   /^\/job-vacancies\/[^/]+$/,
//   /^\/alumni\/profiles\/[^/]+$/,
//   /^\/orders\/[^/]+$/,
// ];

// Routes that should show a loading skeleton while waiting for their
// dynamic breadcrumb override. Optional — when empty, dynamic routes
// briefly show the auto-generated trail before the override kicks in.
// Empty is safe: the worst case is a subtle text swap on slow
// connections. Populate only if that swap becomes a visible problem
// in production, and keep it in sync with useBreadcrumbOverride
// callers — a missing pattern here means the skeleton spins forever.
const DYNAMIC_BREADCRUMB_ROUTES: RegExp[] = [];

function isDynamicBreadcrumbRoute(pathname: string): boolean {
  return DYNAMIC_BREADCRUMB_ROUTES.some((pattern) => pattern.test(pathname));
}

// ─── Auto breadcrumb builder (pure, module-scope) ─────────────────────────────

function buildBreadcrumbsFromPath(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: 'Home', href: ROUTES.HOME }];
  const segments = pathname.split('/').filter(Boolean);

  segments.forEach((segment, index) => {
    // Skip dynamic IDs (numeric or UUID-like)
    const isId = /^\d+$/.test(segment) || /^[0-9a-f-]{8,}$/i.test(segment);
    if (isId) return;

    const label =
      ROUTE_LABELS[segment.toLowerCase()] ??
      segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const href = '/' + segments.slice(0, index + 1).join('/');
    crumbs.push({ label, href });
  });

  // The last crumb is the current page — no link
  if (crumbs.length > 1) {
    delete crumbs[crumbs.length - 1].href;
  }

  return crumbs;
}

function collapseBreadcrumbsForMobile(crumbs: Crumb[]): Crumb[] {
  if (crumbs.length <= 2) return crumbs;

  const first = crumbs[0];
  const last = crumbs[crumbs.length - 1];
  return [first, { label: '…' }, last];
}

// ─── Breadcrumb display (consumer of the override context) ────────────────────

function BreadcrumbDisplay({ autoItems }: { autoItems: Crumb[] }) {
  const { state } = useBreadcrumbContext();
  const { isMobile } = useBreakpoint();
  const { pathname } = useLocation();

  const expectsDynamic = isDynamicBreadcrumbRoute(pathname);
  const hasItems = state.pathname === pathname && state.items !== null;

  // Waiting for the dynamic page to provide real items → skeleton
  if (expectsDynamic && !hasItems) {
    return <BreadcrumbsSkeleton />;
  }

  const raw = hasItems ? state.items! : autoItems;
  const items = isMobile ? collapseBreadcrumbsForMobile(raw) : raw;

  if (items.length === 0) return null;

  return <Breadcrumbs items={items} />;
}

// ─── Breadcrumb skeleton (shown while waiting for a dynamic override) ─────────

function BreadcrumbsSkeleton() {
  return (
    <nav className="bg-gray-50 py-3" aria-hidden="true">
      <div className="container-custom">
        <div className="flex items-center gap-2">
          <span className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          <span className="text-gray-300">›</span>
          <span className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </nav>
  );
}

// ─── RootLayout ───────────────────────────────────────────────────────────────

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

  const hideBreadcrumbs = HERO_ROUTES.some((r) => pathname.startsWith(r));
  const autoBreadcrumbs =
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

      <BreadcrumbProvider>
        <main className="app-main flex-grow">
          <BreadcrumbDisplay autoItems={autoBreadcrumbs} />

          <HeroReadinessContext.Provider value={markHeroReady}>
            <Outlet />
          </HeroReadinessContext.Provider>
        </main>
      </BreadcrumbProvider>

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
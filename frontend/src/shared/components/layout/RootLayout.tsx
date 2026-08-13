// shared/components/layout/RootLayout.tsx

import { Outlet, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { DonationButton } from '../ui/DonationButton';
import { ROUTES } from '@/shared/constants/routes';
import { useCartLoader } from '@/features/store/hooks/useCartLoader';
import { useAuth } from '@/features/authentication/hooks/useAuth';

export function RootLayout() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  useCartLoader(isAuthenticated);  

  const isHomePage = pathname === ROUTES.HOME;
  const isDonationPage = pathname.includes(ROUTES.DONATION);

  const isRouteOrChild = (route: string): boolean =>
  pathname === route || pathname.startsWith(`${route}/`);

  const isEcommerceRoute = isRouteOrChild(ROUTES.ORDER.ROOT) || isRouteOrChild(ROUTES.STORE.ROOT) || pathname.includes('admin/orders');


  const showDonationButton = !isHomePage && !isDonationPage;
  const showBackgroundVideo = !isEcommerceRoute;

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

  return (
    <div className={`app-root-surface min-h-screen flex flex-col text-gray-900 font-sans antialiased ${showBackgroundVideo ? 'alumni-page-background' : ''}`}>
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
        <Outlet />
      </main>

      <Footer />

      {/* Toast notifications — rendered above everything else */}
      <ToastContainer />

      {/* Back to Top */}

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

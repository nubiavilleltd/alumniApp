// shared/components/layout/RootLayout.tsx

import { Outlet, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { DonationButton } from '../ui/DonationButton';
import { ROUTES } from '@/shared/constants/routes';

export function RootLayout() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { pathname } = useLocation();

  console.log('pathname', { pathname });

  const isHomePage = pathname === ROUTES.HOME;
  const isDonationPage = pathname.includes(ROUTES.DONATION);

  const showDonationButton = !isHomePage && !isDonationPage;

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
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased">
      <Navigation />

      <main className="flex-grow">
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

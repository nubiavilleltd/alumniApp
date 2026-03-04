import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';

interface LayoutProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  children: ReactNode;
}

export function Layout({ title, description, image, canonical, children }: LayoutProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  usePageMeta({ title, description, image, canonical });

  useEffect(() => {
    const onScroll = (): void => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased">
      <Navigation />

      <main className="flex-grow">{children}</main>

      <Footer />

      <button
        type="button"
        className={`fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
          showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Icon icon="mdi:arrow-up" className="w-6 h-6" />
      </button>
    </div>
  );
}

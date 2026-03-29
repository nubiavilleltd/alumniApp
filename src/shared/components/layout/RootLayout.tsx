// // shared/components/layout/RootLayout.tsx

// import { Outlet } from 'react-router-dom';
// import { Icon } from '@iconify/react';
// import { useEffect, useState } from 'react';
// import { Navigation } from './Navigation';
// import { Footer } from './Footer';

// export function RootLayout() {
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     const onScroll = (): void => {
//       setShowBackToTop(window.pageYOffset > 300);
//     };

//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased">
//       <Navigation />

//       <main className="flex-grow">
//         <Outlet /> {/* Child routes render here */}
//       </main>

//       <Footer />

//       {/* Back to Top Button */}
//       <button
//         type="button"
//         className={`fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
//           showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'
//         }`}
//         aria-label="Back to top"
//         onClick={scrollToTop}
//       >
//         <Icon icon="mdi:arrow-up" className="w-6 h-6" />
//       </button>
//     </div>
//   );
// }

// shared/components/layout/RootLayout.tsx

import { Outlet } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ToastContainer } from '@/shared/components/ui/Toast';

export function RootLayout() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <button
        type="button"
        className={`fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
          showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <Icon icon="mdi:arrow-up" className="w-6 h-6" />
      </button>
    </div>
  );
}

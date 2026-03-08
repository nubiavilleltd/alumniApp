// import { Navigate, Route, Routes } from 'react-router-dom';
// import { HomePage } from './pages/home/HomePage';
// import { AboutPage } from './pages/about/AboutPage';
// import { PrivacyPage } from './pages/legal/PrivacyPage';
// import { TermsPage } from './pages/legal/TermsPage';
// import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
// import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
// import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';
// import { BlogIndexPage } from './features/announcements/pages/BlogIndexPage';
// import { BlogPostPage } from './features/announcements/pages/BlogPostPage';
// import { EventsPage } from './features/events/pages/EventsPage';
// import { EventDetailPage } from './features/events/pages/EventDetailPage';
// import { NotFoundPage } from './pages/errors/NotFoundPage';

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/privacy" element={<PrivacyPage />} />
//       <Route path="/terms" element={<TermsPage />} />

//       <Route path="/alumni" element={<AlumniRedirectPage />} />
//       <Route path="/alumni/profiles" element={<AlumniDirectoryPage />} />
//       <Route path="/alumni/profiles/:slug" element={<AlumniProfilePage />} />

//       <Route path="/blog" element={<BlogIndexPage />} />
//       <Route path="/blog/:slug" element={<BlogPostPage />} />

//       <Route path="/events" element={<EventsPage />} />
//       <Route path="/events/:slug" element={<EventDetailPage />} />

//       <Route path="/home" element={<Navigate to="/" replace />} />
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }

// App.tsx

import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './shared/components/layout/RootLayout';

// Pages
import { HomePage } from './pages/home/HomePage';
import { AboutPage } from './pages/about/AboutPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';

// Alumni
import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';

// Blog
import { BlogIndexPage } from './features/announcements/pages/BlogIndexPage';
import { BlogPostPage } from './features/announcements/pages/BlogPostPage';

// Events
import { EventsPage } from './features/events/pages/EventsPage';
import { EventDetailPage } from './features/events/pages/EventDetailPage';

export default function App() {
  return (
    <Routes>
      {/* All routes wrapped in RootLayout */}
      <Route element={<RootLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Alumni */}
        <Route path="/alumni" element={<AlumniRedirectPage />} />
        <Route path="/alumni/profiles" element={<AlumniDirectoryPage />} />
        <Route path="/alumni/profiles/:slug" element={<AlumniProfilePage />} />

        {/* Blog */}
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* Events */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />

        {/* Redirects */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* 404 - Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

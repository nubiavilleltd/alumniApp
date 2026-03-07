import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { AboutPage } from './pages/about/AboutPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';
import { BlogIndexPage } from './features/announcements/pages/BlogIndexPage';
import { BlogPostPage } from './features/announcements/pages/BlogPostPage';
import { EventsPage } from './features/events/pages/EventsPage';
import { EventDetailPage } from './features/events/pages/EventDetailPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';
// import { AboutPage } from '@/group/home/about/About';
// import { BlogIndexPage } from '@/group/announcements/pages/BlogIndexPage';
// import { BlogPostPage } from '@/group/announcements/pages/BlogPostPage';
// import { AlumniRedirectPage } from '@/group/alumni_directory/pages/AlumniRedirectPage';
// import { EventPage } from '@/group/events/pages/EventPage';
// import { EventsPage } from '@/group/events/pages/EventsPage';
// import { HomePage } from '@/group/home/pages/HomePage';
// import { ProfilePage } from '@/group/alumni_directory/pages/ProfilePage';
// import { ProfilesPage } from '@/group/alumni_directory/pages/ProfilesPage';
// import { NotFoundPage } from '@/group/shared/pages/NotFoundPage';
// import { PrivacyPage } from '@/group/shared/pages/PrivacyPage';
// import { TermsPage } from '@/group/shared/pages/TermsPage';
// import { YearPage } from '@/group/alumni_directory/pages/YearPage';
// import { YearsPage } from '@/group/alumni_directory/pages/YearsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      <Route path="/alumni" element={<AlumniRedirectPage />} />
      <Route path="/alumni/profiles" element={<AlumniDirectoryPage />} />
      <Route path="/alumni/profiles/:slug" element={<AlumniProfilePage />} />

      <Route path="/blog" element={<BlogIndexPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:slug" element={<EventDetailPage />} />

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

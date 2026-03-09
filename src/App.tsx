import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './shared/components/layout/RootLayout';

import { BlogIndexPage } from './features/announcements/pages/BlogIndexPage';
import { BlogPostPage } from './features/announcements/pages/BlogPostPage';
import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';
import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
import { AuthPage } from './features/authentication/pages/AuthPage';
import { UserDashboardPage } from './features/dashboard/pages/UserDashboardPage';
import { EventDetailPage } from './features/events/pages/EventDetailPage';
import { EventsPage } from './features/events/pages/EventsPage';
import { AboutPage } from './pages/about/AboutPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';
import { HomePage } from './pages/home/HomePage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import LeadershipPage from './features/leadership/pages/LeadershipPage';
import MarketPlacePage from './features/marketplace/pages/MarketPlacePage';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/marketplace" element={<MarketPlacePage />} />

        <Route path="/alumni" element={<AlumniRedirectPage />} />
        <Route path="/alumni/profiles" element={<AlumniDirectoryPage />} />
        <Route path="/alumni/profiles/:slug" element={<AlumniProfilePage />} />

        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />

        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<AuthPage mode="login" />} />
        <Route path="/auth/register" element={<AuthPage mode="register" />} />
        <Route path="/auth/forgot-password" element={<AuthPage mode="forgot-password" />} />
        <Route path="/auth/reset-password" element={<AuthPage mode="reset-password" />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

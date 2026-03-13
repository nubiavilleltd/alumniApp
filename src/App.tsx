import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './shared/components/layout/RootLayout';
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
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import UserProfilePage from './features/user/pages/UserProfilePage';
import MyBusinessPage from './features/marketplace/pages/MyBusinessPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/about"
            element={
              <ErrorBoundary>
                <AboutPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/privacy"
            element={
              <ErrorBoundary>
                <PrivacyPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/terms"
            element={
              <ErrorBoundary>
                <TermsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/projects"
            element={
              <ErrorBoundary>
                <ProjectsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/leadership"
            element={
              <ErrorBoundary>
                <LeadershipPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ErrorBoundary>
                <MarketPlacePage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/marketplace/my-business"
            element={
              <ErrorBoundary>
                <MyBusinessPage />
              </ErrorBoundary>
            }
          />

          <Route path="/alumni" element={<AlumniRedirectPage />} />
          <Route
            path="/alumni/profiles"
            element={
              <ErrorBoundary>
                <AlumniDirectoryPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/alumni/profiles/:slug"
            element={
              <ErrorBoundary>
                <AlumniProfilePage />
              </ErrorBoundary>
            }
          />

          <Route
            path="/events"
            element={
              <ErrorBoundary>
                <EventsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/events/:slug"
            element={
              <ErrorBoundary>
                <EventDetailPage />
              </ErrorBoundary>
            }
          />

          {/* Auth pages — no boundary needed, static forms */}
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<AuthPage mode="login" />} />
          <Route path="/auth/register" element={<AuthPage mode="register" />} />
          <Route path="/auth/forgot-password" element={<AuthPage mode="forgot-password" />} />
          <Route path="/auth/reset-password" element={<AuthPage mode="reset-password" />} />

          {/* Users */}

          <Route
            path="/user/profile"
            element={
              <ErrorBoundary>
                <UserProfilePage />
              </ErrorBoundary>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ErrorBoundary>
                <UserDashboardPage />
              </ErrorBoundary>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

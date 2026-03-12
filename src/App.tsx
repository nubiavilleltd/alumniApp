// import { Navigate, Route, Routes } from 'react-router-dom';
// import { RootLayout } from './shared/components/layout/RootLayout';

// import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
// import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';
// import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
// import { AuthPage } from './features/authentication/pages/AuthPage';
// import { UserDashboardPage } from './features/dashboard/pages/UserDashboardPage';
// import { EventDetailPage } from './features/events/pages/EventDetailPage';
// import { EventsPage } from './features/events/pages/EventsPage';
// import { AboutPage } from './pages/about/AboutPage';
// import { NotFoundPage } from './pages/errors/NotFoundPage';
// import { HomePage } from './pages/home/HomePage';
// import { PrivacyPage } from './pages/legal/PrivacyPage';
// import { TermsPage } from './pages/legal/TermsPage';
// import ProjectsPage from './features/projects/pages/ProjectsPage';
// import LeadershipPage from './features/leadership/pages/LeadershipPage';
// import MarketPlacePage from './features/marketplace/pages/MarketPlacePage';

// export default function App() {
//   return (
//     <Routes>
//       <Route element={<RootLayout />}>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/about" element={<AboutPage />} />
//         <Route path="/privacy" element={<PrivacyPage />} />
//         <Route path="/terms" element={<TermsPage />} />
//         <Route path="/projects" element={<ProjectsPage />} />
//         <Route path="/leadership" element={<LeadershipPage />} />
//         <Route path="/marketplace" element={<MarketPlacePage />} />

//         <Route path="/alumni" element={<AlumniRedirectPage />} />
//         <Route path="/alumni/profiles" element={<AlumniDirectoryPage />} />
//         <Route path="/alumni/profiles/:slug" element={<AlumniProfilePage />} />

//         {/* <Route path="/blog" element={<BlogIndexPage />} /> */}
//         {/* <Route path="/blog/:slug" element={<BlogPostPage />} /> */}

//         <Route path="/events" element={<EventsPage />} />
//         <Route path="/events/:slug" element={<EventDetailPage />} />

//         <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
//         <Route path="/auth/login" element={<AuthPage mode="login" />} />
//         <Route path="/auth/register" element={<AuthPage mode="register" />} />
//         <Route path="/auth/forgot-password" element={<AuthPage mode="forgot-password" />} />
//         <Route path="/auth/reset-password" element={<AuthPage mode="reset-password" />} />
//         <Route path="/dashboard" element={<UserDashboardPage />} />

//         <Route path="/home" element={<Navigate to="/" replace />} />
//         <Route path="*" element={<NotFoundPage />} />
//       </Route>
//     </Routes>
//   );
// }

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

export default function App() {
  return (
    // ── App-level safety net — catches anything not caught below ──────────────
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

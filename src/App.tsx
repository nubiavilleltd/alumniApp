import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './shared/components/layout/RootLayout';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
import { ProtectedRoute } from './shared/components/routing/ProtectedRoute';
import { AdminRoute } from './shared/components/routing/AdminRoute';

// ── Public pages ──────────────────────────────────────────────────────────────
import { HomePage } from './pages/home/HomePage';
import { AboutPage } from './pages/about/AboutPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import LeadershipPage from './features/leadership/pages/LeadershipPage';

// ── Auth pages (no guard — public) ───────────────────────────────────────────
import { AuthPage } from './features/authentication/pages/AuthPage';

// ── Alumni (public) ───────────────────────────────────────────────────────────
import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';

// ── Events (public) ───────────────────────────────────────────────────────────
import { EventsPage } from './features/events/pages/EventsPage';
import { EventDetailPage } from './features/events/pages/EventDetailPage';

// ── Marketplace (public browse, protected actions) ────────────────────────────
import MarketPlacePage from './features/marketplace/pages/MarketPlacePage';
import MyBusinessPage from './features/marketplace/pages/MyBusinessPage';

// ── User (protected) ─────────────────────────────────────────────────────────
import { UserDashboardPage } from './features/user/pages/UserDashboardPage';
import UserProfilePage from './features/user/pages/UserProfilePage';

// ── Admin (admin only) ────────────────────────────────────────────────────────
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';

export default function App() {
  return (
    // App-level safety net — catches anything not caught by a page boundary below
    <ErrorBoundary>
      <Routes>
        <Route element={<RootLayout />}>
          {/* ── Public ─────────────────────────────────────────────────── */}
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

          {/* ── Alumni ─────────────────────────────────────────────────── */}
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

          {/* ── Events ─────────────────────────────────────────────────── */}
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

          {/* ── Marketplace ────────────────────────────────────────────── */}
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
              <ProtectedRoute>
                <ErrorBoundary>
                  <MyBusinessPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* ── Auth ───────────────────────────────────────────────────── */}
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<AuthPage mode="login" />} />
          <Route path="/auth/register" element={<AuthPage mode="register" />} />
          <Route path="/auth/forgot-password" element={<AuthPage mode="forgot-password" />} />
          <Route path="/auth/reset-password" element={<AuthPage mode="reset-password" />} />

          {/* ── User (protected) ───────────────────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <UserDashboardPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <UserProfilePage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* ── Admin (admin only) ─────────────────────────────────────── */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <ErrorBoundary>
                  <AdminDashboardPage />
                </ErrorBoundary>
              </AdminRoute>
            }
          />

          {/* ── Redirects & fallback ───────────────────────────────────── */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

// // src/App.tsx

// import { Navigate, Route, Routes } from 'react-router-dom';
// import { RootLayout } from './shared/components/layout/RootLayout';
// import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
// import { ProtectedRoute } from './shared/components/routing/ProtectedRoute';
// import { AdminRoute } from './shared/components/routing/AdminRoute';

// // ── Public pages ──────────────────────────────────────────────────────────────
// import { HomePage } from './pages/home/HomePage';
// import { AboutPage } from './pages/about/AboutPage';
// import { PrivacyPage } from './pages/legal/PrivacyPage';
// import { TermsPage } from './pages/legal/TermsPage';
// import { NotFoundPage } from './pages/errors/NotFoundPage';
// import ProjectsPage from './features/projects/pages/ProjectsPage';
// import LeadershipPage from './features/leadership/pages/LeadershipPage';

// // ── Auth pages (no guard — public) ───────────────────────────────────────────
// import { AuthPage } from './features/authentication/pages/AuthPage';

// // ── Alumni (public) ───────────────────────────────────────────────────────────
// import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
// import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
// import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';

// // ── Events (public) ───────────────────────────────────────────────────────────
// import { EventsPage } from './features/events/pages/EventsPage';
// import { EventDetailPage } from './features/events/pages/EventDetailPage';
// import { MyEventsPage } from './features/events/pages/MyEventsPage';

// // ── Marketplace (public browse, protected actions) ────────────────────────────
// import MarketPlacePage from './features/marketplace/pages/MarketPlacePage';
// import MyBusinessPage from './features/marketplace/pages/MyBusinessPage';

// // ── User (protected) ─────────────────────────────────────────────────────────
// import { UserDashboardPage } from './features/user/pages/UserDashboardPage';
// import UserProfilePage from './features/user/pages/UserProfilePage';
// import ChangePasswordPage from './features/user/pages/ChangePasswordPage';

// // ── Admin (admin only) ────────────────────────────────────────────────────────
// import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';

// // Add these imports
// import CreateEventPage from '@/features/events/pages/CreateEventPage';
// import EditEventPage from '@/features/events/pages/EditEventPage';

// // Add these routes inside the Routes section, after the events routes:

// export default function App() {
//   return (
//     // App-level safety net — catches anything not caught by a page boundary below
//     <ErrorBoundary>
//       <Routes>
//         <Route element={<RootLayout />}>
//           {/* ── Public ─────────────────────────────────────────────────── */}
//           <Route
//             path="/"
//             element={
//               <ErrorBoundary>
//                 <HomePage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/about"
//             element={
//               <ErrorBoundary>
//                 <AboutPage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/privacy"
//             element={
//               <ErrorBoundary>
//                 <PrivacyPage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/terms"
//             element={
//               <ErrorBoundary>
//                 <TermsPage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/projects"
//             element={
//               <ErrorBoundary>
//                 <ProjectsPage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/leadership"
//             element={
//               <ErrorBoundary>
//                 <LeadershipPage />
//               </ErrorBoundary>
//             }
//           />

//           {/* ── Alumni ─────────────────────────────────────────────────── */}
//           <Route path="/alumni" element={<AlumniRedirectPage />} />
//           <Route
//             path="/alumni/profiles"
//             element={
//               <ErrorBoundary>
//                 <AlumniDirectoryPage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/alumni/profiles/:slug"
//             element={
//               <ErrorBoundary>
//                 <AlumniProfilePage />
//               </ErrorBoundary>
//             }
//           />

//           {/* ── Events ─────────────────────────────────────────────────── */}
//           <Route
//             path="/events"
//             element={
//               <ErrorBoundary>
//                 <EventsPage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/events/:slug"
//             element={
//               <ErrorBoundary>
//                 <EventDetailPage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/my-events"
//             element={
//               <ProtectedRoute>
//                 <ErrorBoundary>
//                   <MyEventsPage />
//                 </ErrorBoundary>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/events/create"
//             element={
//               <ProtectedRoute>
//                 <ErrorBoundary>
//                   <CreateEventPage />
//                 </ErrorBoundary>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/events/:id/edit"
//             element={
//               <ProtectedRoute>
//                 <ErrorBoundary>
//                   <EditEventPage />
//                 </ErrorBoundary>
//               </ProtectedRoute>
//             }
//           />

//           {/* ── Marketplace ────────────────────────────────────────────── */}
//           <Route
//             path="/marketplace"
//             element={
//               <ErrorBoundary>
//                 <MarketPlacePage />
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/marketplace/my-business"
//             element={
//               <ProtectedRoute>
//                 <ErrorBoundary>
//                   <MyBusinessPage />
//                 </ErrorBoundary>
//               </ProtectedRoute>
//             }
//           />

//           {/* ── Auth ───────────────────────────────────────────────────── */}
//           <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
//           <Route path="/auth/login" element={<AuthPage mode="login" />} />
//           <Route path="/auth/register" element={<AuthPage mode="register" />} />
//           <Route path="/auth/forgot-password" element={<AuthPage mode="forgot-password" />} />
//           <Route path="/auth/reset-password" element={<AuthPage mode="reset-password" />} />

//           {/* ── User (protected) ───────────────────────────────────────── */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <ErrorBoundary>
//                   <UserDashboardPage />
//                 </ErrorBoundary>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/user/profile"
//             element={
//               <ProtectedRoute>
//                 <ErrorBoundary>
//                   <UserProfilePage />
//                 </ErrorBoundary>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/user/settings"
//             element={
//               <ProtectedRoute>
//                 <ErrorBoundary>
//                   <ChangePasswordPage />
//                 </ErrorBoundary>
//               </ProtectedRoute>
//             }
//           />

//           {/* ── Admin (admin only) ─────────────────────────────────────── */}
//           <Route
//             path="/admin/dashboard"
//             element={
//               <AdminRoute>
//                 <ErrorBoundary>
//                   <AdminDashboardPage />
//                 </ErrorBoundary>
//               </AdminRoute>
//             }
//           />

//           {/* ── Redirects & fallback ───────────────────────────────────── */}
//           <Route path="/home" element={<Navigate to="/" replace />} />
//           <Route path="*" element={<NotFoundPage />} />
//         </Route>
//       </Routes>
//     </ErrorBoundary>
//   );
// }

import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './shared/components/layout/RootLayout';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
import { ProtectedRoute } from './shared/components/routing/ProtectedRoute';
import { AdminRoute } from './shared/components/routing/AdminRoute';

import { ROUTES } from '@/shared/constants/routes';

// Pages
import { HomePage } from './pages/home/HomePage';
import { AboutPage } from './pages/about/AboutPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import LeadershipPage from './features/leadership/pages/LeadershipPage';

import { AuthPage } from './features/authentication/pages/AuthPage';

import { AlumniRedirectPage } from './features/alumni/pages/AlumniRedirectPage';
import { AlumniDirectoryPage } from './features/alumni/pages/AlumniDirectoryPage';
import { AlumniProfilePage } from './features/alumni/pages/AlumniProfilePage';

import { EventsPage } from './features/events/pages/EventsPage';
import { EventDetailPage } from './features/events/pages/EventDetailPage';
import { MyEventsPage } from './features/events/pages/MyEventsPage';
import CreateEventPage from '@/features/events/pages/CreateEventPage';
import EditEventPage from '@/features/events/pages/EditEventPage';

import MarketPlacePage from './features/marketplace/pages/MarketPlacePage';
import MyBusinessPage from './features/marketplace/pages/MyBusinessPage';

import { UserDashboardPage } from './features/user/pages/UserDashboardPage';
import UserProfilePage from './features/user/pages/UserProfilePage';
import ChangePasswordPage from './features/user/pages/ChangePasswordPage';
import { MessagesPage } from './features/messages/pages/MessagesPage';

import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import ProjectDetailsPage from './features/projects/pages/ProjectDetail';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public */}
          <Route
            path={ROUTES.HOME}
            element={
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.ABOUT}
            element={
              <ErrorBoundary>
                <AboutPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.PRIVACY}
            element={
              <ErrorBoundary>
                <PrivacyPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.TERMS}
            element={
              <ErrorBoundary>
                <TermsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.PROJECTS.ROOT}
            element={
              <ErrorBoundary>
                <ProjectsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.PROJECTS.DETAIL_PATH}
            element={
              <ErrorBoundary>
                <ProjectDetailsPage />
              </ErrorBoundary>
            }
          />

          <Route
            path={ROUTES.LEADERSHIP}
            element={
              <ErrorBoundary>
                <LeadershipPage />
              </ErrorBoundary>
            }
          />

          {/* Alumni */}
          <Route path={ROUTES.ALUMNI.ROOT} element={<AlumniRedirectPage />} />
          <Route
            path={ROUTES.ALUMNI.PROFILES}
            element={
              <ErrorBoundary>
                <AlumniDirectoryPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.ALUMNI.PROFILE(':slug')}
            element={
              <ErrorBoundary>
                <AlumniProfilePage />
              </ErrorBoundary>
            }
          />

          {/* Events */}
          <Route
            path={ROUTES.EVENTS.ROOT}
            element={
              <ErrorBoundary>
                <EventsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.EVENTS.DETAIL(':slug')}
            element={
              <ErrorBoundary>
                <EventDetailPage />
              </ErrorBoundary>
            }
          />

          <Route
            path={ROUTES.EVENTS.MY_EVENTS}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MyEventsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.EVENTS.CREATE}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <CreateEventPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.EVENTS.EDIT(':id')}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <EditEventPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* Marketplace */}
          <Route
            path={ROUTES.MARKETPLACE.ROOT}
            element={
              <ErrorBoundary>
                <MarketPlacePage />
              </ErrorBoundary>
            }
          />

          <Route
            path={ROUTES.MARKETPLACE.MY_BUSINESS}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MyBusinessPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path={ROUTES.AUTH.ROOT} element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
          <Route path={ROUTES.AUTH.LOGIN} element={<AuthPage mode="login" />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<AuthPage mode="register" />} />
          <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<AuthPage mode="forgot-password" />} />
          <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<AuthPage mode="reset-password" />} />

          {/* User */}
          <Route
            path={ROUTES.USER.DASHBOARD}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <UserDashboardPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.USER.PROFILE}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <UserProfilePage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.USER.SETTINGS}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ChangePasswordPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MessagesPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={
              <AdminRoute>
                <ErrorBoundary>
                  <AdminDashboardPage />
                </ErrorBoundary>
              </AdminRoute>
            }
          />

          {/* Redirects */}
          <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

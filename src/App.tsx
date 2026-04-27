//src/App.tsx

import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './shared/components/layout/RootLayout';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
import { ProtectedRoute } from './shared/components/routing/ProtectedRoute';
import { AdminRoute } from './shared/components/routing/AdminRoute';

import { ROUTES } from '@/shared/constants/routes';

// Pages
import { HomePage } from './pages/home/HomePage';
import { AboutPage } from './pages/about/AboutPage';
import { ContactUsPage } from './features/contactUs/pages/ContactUsPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import LeadershipPage from './features/leadership/pages/LeadershipPage';
import AnnouncementsPage from './features/announcements/pages/BlogIndexPage';
import BlogPostPage from './features/announcements/pages/BlogPostPage';
import { ANNOUNCEMENT_ROUTES } from './features/announcements/routes';

import { AuthPage } from './features/authentication/pages/AuthPage';
import { RegisterDetailsPage } from './features/authentication/pages/RegisterDetailsPage';
import { RegisterVerificationPage } from './features/authentication/pages/RegisterVerificationPage';
import { RegisterSuccessPage } from './features/authentication/pages/RegisterSuccessPage';

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
import SettingsPage from './features/user/pages/SettingsPage';
import { MessagesPage } from './features/messages/pages/MessagesPage';

import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import ProjectDetailsPage from './features/projects/pages/ProjectDetail';
import { ADMIN_ROUTES } from './features/admin/routes';
import { AdminMembersPage } from './features/admin/pages/AdminMembersPage';
import { AdminEventRegistrationsPage } from './features/events/pages/AdminEventRegistrationsPage';
import { AdminAnnouncementsPage } from './features/announcements/pages/AdminAnnouncementsPage';
import { COMING_SOON_ROUTES } from './config/comingSoonRoutes';
import { ComingSoonRouteHandler } from './pages/errors/ComingSoonRouteHandler';
import { GuestRoute } from './shared/components/routing/GuestRoute';
import EditProfilePage from './features/user/pages/EditProfilePage';
import ResourcesPage from './pages/resources/ResourcesPage';
import WelfarePage from './pages/welfare/WelfarePage';
import WelfareZonesPage from './pages/welfare/WelfareZonesPage';
import JobVacanciesPage from './features/jobVacancies/pages/JobVacanciesPage';
import { DonationPage } from './features/donation/pages/DonationPage';

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
            path={ROUTES.CONTACT}
            element={
              <ErrorBoundary>
                <ContactUsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.NEWS}
            element={
              <ErrorBoundary>
                <AnnouncementsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ANNOUNCEMENT_ROUTES.DETAIL_PATH}
            element={
              <ErrorBoundary>
                <BlogPostPage />
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

          <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
          <Route path={ROUTES.WELFARE} element={<WelfarePage />} />
          <Route path={ROUTES.WELFARE_ZONES} element={<WelfareZonesPage />} />
          <Route path={ROUTES.DONATION} element={<DonationPage />} />
          <Route
            path={ROUTES.JOB_VACANCIES}
            element={
              <ErrorBoundary>
                <JobVacanciesPage />
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
          {/* <Route path={ROUTES.AUTH.LOGIN} element={<AuthPage mode="login" />} /> */}
          <Route
            path={ROUTES.AUTH.LOGIN}
            element={
              <GuestRoute>
                <AuthPage mode="login" />
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.AUTH.REGISTER}
            element={
              <GuestRoute>
                <RegisterDetailsPage />
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.AUTH.REGISTER_VERIFY}
            element={
              <GuestRoute>
                <RegisterVerificationPage />
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.AUTH.REGISTER_SUCCESS}
            element={
              <GuestRoute>
                <RegisterSuccessPage />
              </GuestRoute>
            }
          />
          <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<AuthPage mode="forgot-password" />} />
          <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<AuthPage mode="reset-password" />} />
          <Route
            path={ROUTES.AUTH.RESET_PASSWORD_WITH_CODE(':code')}
            element={<AuthPage mode="reset-password" />}
          />

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
            path={ROUTES.USER.EDIT_PROFILE}
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <EditProfilePage />
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
                  <SettingsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MESSAGES}
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

          <Route
            path={ADMIN_ROUTES.MEMBERS}
            element={
              <AdminRoute>
                <ErrorBoundary>
                  <AdminMembersPage />
                </ErrorBoundary>
              </AdminRoute>
            }
          />

          <Route
            path={ADMIN_ROUTES.EVENT_REGISTRATIONS}
            element={
              <AdminRoute>
                <ErrorBoundary>
                  <AdminEventRegistrationsPage />
                </ErrorBoundary>
              </AdminRoute>
            }
          />

          <Route
            path={ADMIN_ROUTES.ANNOUNCEMENTS}
            element={
              <AdminRoute>
                <ErrorBoundary>
                  <AdminAnnouncementsPage />
                </ErrorBoundary>
              </AdminRoute>
            }
          />

          {/* Redirects */}
          <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />
          {/* Coming Soon routes (dynamic) */}
          {COMING_SOON_ROUTES.map(({ prefix, title }) => (
            <Route
              key={prefix}
              path={`/${prefix}/*`}
              element={
                <ErrorBoundary>
                  <ComingSoonRouteHandler title={title} />
                </ErrorBoundary>
              }
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

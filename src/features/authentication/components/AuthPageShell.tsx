import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { getSiteConfig } from '@/data/content';
import { Layout } from '@/shared/components/layout/Layout';
import type { AuthMode } from '../types/auth.types';
import { AuthModeSwitch } from './AuthModeSwitch';

interface AuthPageShellProps {
  mode: AuthMode;
  children: ReactNode;
}

const contentByMode = {
  login: {
    title: 'Welcome back',
    description:
      'Sign in to access your alumni profile, track approvals, and stay connected with your community.',
    badge: 'Alumni access',
    highlights: [
      'Access your alumni portal from any device',
      'Review your registration status and profile details',
      'Stay ready for API integration without changing the UI flow',
    ],
  },
  register: {
    title: 'Create your alumni account',
    description:
      'Submit your details, verify your email, and wait for an admin to approve your account before access is granted.',
    badge: 'New registration',
    highlights: [
      'Collects core alumni details in one validated step',
      'Separates email verification from account approval',
      'Keeps the UI ready for backend APIs when they arrive',
    ],
  },
  'forgot-password': {
    title: 'Recover your account access',
    description:
      'Request a password reset email, then continue to a secure reset page from the link in that message.',
    badge: 'Password recovery',
    highlights: [
      'Collects only the account email for the recovery request',
      'Simulates the exact reset-link journey a real email would open',
      'Keeps recovery and password update steps clearly separated',
    ],
  },
  'reset-password': {
    title: 'Choose a new password',
    description:
      'Open the reset link, create a new password, and return to sign in with the updated credentials.',
    badge: 'Secure reset',
    highlights: [
      'Validates reset links before showing the password form',
      'Reuses the same password-strength guidance as registration',
      'Keeps the route ready for real token-based backend validation',
    ],
  },
} as const;

export function AuthPageShell({ mode, children }: AuthPageShellProps) {
  const config = getSiteConfig();
  const pageContent = contentByMode[mode];
  const showModeSwitch = mode === 'login' || mode === 'register';
  const pageTitle =
    mode === 'login'
      ? 'Login'
      : mode === 'register'
        ? 'Register'
        : mode === 'forgot-password'
          ? 'Forgot Password'
          : 'Reset Password';

  return (
    <Layout title={pageTitle} description={pageContent.description}>
      <section className="section bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.14),_transparent_28%),linear-gradient(180deg,_#ffffff,_#f1f5f9)]">
        <div className="container-custom">
          <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(140deg,_#020617_0%,_#0f172a_38%,_#1e3a8a_100%)] p-8 text-white shadow-2xl md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.22),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.42),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.03),_rgba(2,6,23,0.2))]" />
              <div className="absolute inset-y-0 right-0 w-[42%] bg-[linear-gradient(270deg,_rgba(255,255,255,0.08),_transparent)]" />

              <div className="relative z-10">
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  {pageContent.badge}
                </span>

                <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight md:text-5xl">
                  {pageContent.title}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
                  {pageContent.description}
                </p>

                <div className="mt-8 grid gap-4">
                  {pageContent.highlights.map((highlight) => (
                    <div
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                      key={highlight}
                    >
                      <div className="rounded-xl bg-white/10 p-2">
                        <Icon icon="mdi:check-decagram" className="h-5 w-5 text-primary-200" />
                      </div>
                      <p className="text-sm leading-6 text-white/85">{highlight}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white/90">Institution</p>
                  <p className="mt-2 text-2xl font-bold">{config.organization.name}</p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    The authentication flow is split into clear frontend states so each step can map
                    directly to real API responses later.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-accent-200 bg-white p-5 shadow-xl md:p-6">
              {showModeSwitch ? <AuthModeSwitch mode={mode} /> : null}
              <div className={showModeSwitch ? 'mt-6' : ''}>{children}</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

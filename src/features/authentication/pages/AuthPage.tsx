import type { AuthMode } from '../types/auth.types';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { LoginForm } from '../components/LoginForm';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  if (mode === 'login') return <LoginForm />;
  if (mode === 'forgot-password') return <ForgotPasswordForm />;
  return <ResetPasswordForm />;
}

// import type { AuthMode } from '../types/auth.types';
// import { AuthPageShell } from '../components/AuthPageShell';
// import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
// import { LoginForm } from '../components/LoginForm';
// import { RegisterForm } from '../components/RegisterForm';
// import { ResetPasswordForm } from '../components/ResetPasswordForm';

// interface AuthPageProps {
//   mode: AuthMode;
// }

// export function AuthPage({ mode }: AuthPageProps) {
//   const content =
//     mode === 'login' ? (
//       <LoginForm />
//     ) : mode === 'register' ? (
//       <RegisterForm />
//     ) : mode === 'forgot-password' ? (
//       <ForgotPasswordForm />
//     ) : (
//       <ResetPasswordForm />
//     );

//   return <AuthPageShell mode={mode}>{content}</AuthPageShell>;
// }






import type { AuthMode } from '../types/auth.types';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { LoginForm }          from '../components/LoginForm';
import { RegisterForm }       from '../components/RegisterForm';
import { ResetPasswordForm }  from '../components/ResetPasswordForm';

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  if (mode === 'login')            return <LoginForm />;
  if (mode === 'register')         return <RegisterForm />;
  if (mode === 'forgot-password')  return <ForgotPasswordForm />;
  return <ResetPasswordForm />;
}

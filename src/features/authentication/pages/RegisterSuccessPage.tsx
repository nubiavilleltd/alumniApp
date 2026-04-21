import { Icon } from '@iconify/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { RegistrationShell } from '../components/RegistrationShell';
import { AUTH_ROUTES } from '../routes';
import { clearRegistrationFlow, loadRegistrationFlow } from '../lib/registrationFlow';

export function RegisterSuccessPage() {
  const navigate = useNavigate();
  const flow = loadRegistrationFlow();

  if (!flow?.completionResponse) {
    return <Navigate to={AUTH_ROUTES.REGISTER} replace />;
  }

  const handleGoToLogin = () => {
    clearRegistrationFlow();
    navigate(AUTH_ROUTES.LOGIN, { replace: true });
  };

  return (
    <RegistrationShell step="success">
      <div className="auth-message-panel">
        <div className="auth-message-panel__icon">
          <Icon icon="mdi:shield-check-outline" />
        </div>
        <div>
          <p className="auth-message-panel__title">Registration completed!</p>
          <p className="auth-message-panel__copy">{flow.completionResponse.message}</p>
        </div>
        <ul className="auth-check-list">
          {[
            { icon: 'mdi:check-circle-outline', text: 'Your email has been verified.' },
            { icon: 'mdi:clock-outline', text: 'Your account is awaiting admin approval.' },
            {
              icon: 'mdi:email-outline',
              text: 'You will be notified once your account is approved.',
            },
          ].map((item) => (
            <li key={item.text}>
              <Icon icon={item.icon} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>

        <Button
          type="button"
          onClick={handleGoToLogin}
          fullWidth
          className="auth-submit-button rounded-full"
        >
          Continue to Login
        </Button>
      </div>
    </RegistrationShell>
  );
}

import { Icon } from '@iconify/react';
import { Navigate, useNavigate } from 'react-router-dom';
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
      <div className="space-y-5 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
          <Icon icon="mdi:shield-check-outline" className="w-8 h-8 text-primary-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-2">Registration completed!</p>
          <p className="text-sm text-gray-500 leading-relaxed">{flow.completionResponse.message}</p>
        </div>
        <ul className="text-left space-y-2.5 text-sm text-gray-500">
          {[
            { icon: 'mdi:check-circle-outline', text: 'Your email has been verified.' },
            { icon: 'mdi:clock-outline', text: 'Your account is awaiting admin approval.' },
            {
              icon: 'mdi:email-outline',
              text: 'You will be notified once your account is approved.',
            },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-2">
              <Icon icon={item.icon} className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>

        <button type="button" onClick={handleGoToLogin} className="btn btn-primary w-full">
          Continue to Login
        </button>
      </div>
    </RegistrationShell>
  );
}

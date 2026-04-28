import type { ReactNode } from 'react';
import { AuthCard } from './AuthCard';
import type { RegistrationStep } from '../lib/registrationFlow';

const progressSteps: RegistrationStep[] = ['details', 'verification', 'success'];

const stepMeta: Record<RegistrationStep, { step: string; label: string }> = {
  details: { step: 'Step 1 of 3', label: 'Account Details' },
  verification: { step: 'Step 2 of 3', label: 'Verify your Email' },
  success: { step: 'Step 3 of 3', label: 'Approval Pending' },
};

interface RegistrationShellProps {
  step: RegistrationStep;
  children: ReactNode;
}

export function RegistrationShell({ step, children }: RegistrationShellProps) {
  const { step: stepNumber, label: stepLabel } = stepMeta[step];
  const activeIndex = progressSteps.indexOf(step);

  return (
    <AuthCard title="Sign" titleAccent="Up" subtitle="Join your sisters" variant="registration">
      <div className="auth-stepper" aria-label={`Registration progress: ${stepNumber}`}>
        <div>
          <p className="auth-stepper__count">{stepNumber}</p>
          <p className="auth-stepper__label">{stepLabel}</p>
        </div>
        <div className="auth-stepper__dots">
          {progressSteps.map((registrationStep, index) => (
            <div
              key={registrationStep}
              className={`auth-stepper__dot ${
                registrationStep === step
                  ? 'auth-stepper__dot--active'
                  : index < activeIndex
                    ? 'auth-stepper__dot--complete'
                    : 'auth-stepper__dot--idle'
              }`}
            />
          ))}
        </div>
      </div>

      <div className={`auth-registration-content auth-registration-content--${step}`}>
        {children}
      </div>
    </AuthCard>
  );
}

import type { ReactNode } from 'react';
import { AuthCard } from './AuthCard';
import type { RegistrationStep } from '../lib/registrationFlow';

const registrationSteps: RegistrationStep[] = ['details', 'verification', 'success'];

const stepMeta: Record<RegistrationStep, { step: string; label: string }> = {
  details: { step: 'Step 1 of 3', label: 'Account Details' },
  verification: { step: 'Step 2 of 3', label: 'Verify Email' },
  success: { step: 'Step 3 of 3', label: 'Approval Pending' },
};

interface RegistrationShellProps {
  step: RegistrationStep;
  children: ReactNode;
}

export function RegistrationShell({ step, children }: RegistrationShellProps) {
  const { step: stepNumber, label: stepLabel } = stepMeta[step];
  const activeIndex = registrationSteps.indexOf(step);

  return (
    <AuthCard title="Sign" titleAccent="Up" subtitle="Join your Sisters">
      <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
        <div>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
            {stepNumber}
          </p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">{stepLabel}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {registrationSteps.map((registrationStep, index) => (
            <div
              key={registrationStep}
              className={`rounded-full transition-all duration-300 ${
                registrationStep === step
                  ? 'w-5 h-2 bg-primary-500'
                  : index < activeIndex
                    ? 'w-2 h-2 bg-primary-300'
                    : 'w-2 h-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {children}
    </AuthCard>
  );
}

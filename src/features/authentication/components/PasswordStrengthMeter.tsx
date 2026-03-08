import { Icon } from '@iconify/react';
import { getPasswordStrength } from '../utils/passwordStrength';

interface PasswordStrengthMeterProps {
  password: string;
}

const meterTone = {
  'Very weak': 'bg-secondary-500',
  Weak: 'bg-secondary-400',
  Fair: 'bg-yellow-400',
  Strong: 'bg-primary-500',
  'Very strong': 'bg-primary-700',
} as const;

const meterWidth = {
  'Very weak': 'w-1/4',
  Weak: 'w-2/4',
  Fair: 'w-3/4',
  Strong: 'w-[88%]',
  'Very strong': 'w-full',
} as const;

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password);

  return (
    <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent-900">Password strength</p>
          <p className="text-xs text-accent-500">
            Use a unique password you do not reuse elsewhere.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent-700">
          {password ? strength.label : 'Not started'}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            password ? `${meterTone[strength.label]} ${meterWidth[strength.label]}` : 'w-0'
          }`}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {strength.criteria.map((criterion) => (
          <div className="flex items-center gap-2 text-sm" key={criterion.label}>
            <Icon
              icon={criterion.met ? 'mdi:check-circle' : 'mdi:circle-outline'}
              className={`h-4 w-4 flex-shrink-0 ${
                criterion.met ? 'text-primary-600' : 'text-accent-400'
              }`}
            />
            <span className={criterion.met ? 'text-accent-700' : 'text-accent-500'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>

      {strength.suggestions.length > 0 && password && (
        <p className="mt-4 text-xs text-accent-500">
          Suggestions: {strength.suggestions.join(', ')}.
        </p>
      )}
    </div>
  );
}

import { AppLink } from '@/shared/components/ui/AppLink';
import type { AuthMode } from '../types/auth.types';

interface AuthModeSwitchProps {
  mode: AuthMode;
}

const tabs = [
  { label: 'Login', href: '/auth/login', mode: 'login' },
  { label: 'Register', href: '/auth/register', mode: 'register' },
] as const;

export function AuthModeSwitch({ mode }: AuthModeSwitchProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-accent-100 p-2">
      {tabs.map((tab) => {
        const isActive = tab.mode === mode;

        return (
          <AppLink
            href={tab.href}
            key={tab.mode}
            className={`rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-accent-600 hover:bg-white/80 hover:text-primary-600'
            }`}
          >
            {tab.label}
          </AppLink>
        );
      })}
    </div>
  );
}

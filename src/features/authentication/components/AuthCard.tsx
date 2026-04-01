import type { ReactNode } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { getSiteConfig } from '@/data/content';
import { ROUTES } from '@/shared/constants/routes';

interface AuthCardProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthCard({ title, titleAccent, subtitle, children }: AuthCardProps) {
  const config = getSiteConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo + site name */}
      <AppLink href={ROUTES.HOME} className="flex items-center gap-3 mb-8 group">
        {config.site.logo ? (
          <img
            src={config.site.logo}
            alt={config.site.name}
            className="w-10 h-10 rounded-full border-2 border-primary-200 group-hover:scale-105 transition-transform"
          />
        ) : null}
        <div className="text-left">
          <p className="text-sm font-bold text-gray-800 leading-tight">{config.site.name}</p>
          <p className="text-xs text-gray-400">Federal Government Girls College</p>
        </div>
      </AppLink>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {title} {titleAccent && <span className="text-primary-500 italic">{titleAccent}</span>}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-gray-500 leading-relaxed">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}

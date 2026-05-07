import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AuthCardProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  children: ReactNode;
  variant?: 'default' | 'registration';
  shellClassName?: string;
  cardClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function AuthCard({
  title,
  titleAccent,
  subtitle,
  children,
  variant = 'default',
  shellClassName,
  cardClassName,
  headerClassName,
  bodyClassName,
}: AuthCardProps) {
  const baseCardClassName =
    variant === 'registration' ? 'auth-card auth-card--registration' : 'auth-card';

  return (
    <div className={twMerge(clsx('auth-page-shell', shellClassName))}>
      <section className={twMerge(clsx(baseCardClassName, cardClassName))}>
        <header className={twMerge(clsx('auth-card__header', headerClassName))}>
          <h1 className="auth-card__title">
            <span>{title}</span>
            {titleAccent && (
              <>
                {' '}
                <span className="auth-card__title-accent">{titleAccent}</span>
              </>
            )}
          </h1>
          {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        </header>

        <div className={twMerge(clsx('auth-card__body', bodyClassName))}>{children}</div>
      </section>
    </div>
  );
}

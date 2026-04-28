import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  children: ReactNode;
  variant?: 'default' | 'registration';
}

export function AuthCard({
  title,
  titleAccent,
  subtitle,
  children,
  variant = 'default',
}: AuthCardProps) {
  const cardClassName =
    variant === 'registration' ? 'auth-card auth-card--registration' : 'auth-card';

  return (
    <div className="auth-page-shell">
      <section className={cardClassName}>
        <header className="auth-card__header">
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

        <div className="auth-card__body">{children}</div>
      </section>
    </div>
  );
}

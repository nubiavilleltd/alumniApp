import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AppLinkProps extends PropsWithChildren {
  href: string;
  className?: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
  endAdornment?: ReactNode;
  onClick?: () => void;
}

function isExternal(href: string): boolean {
  return (
    /^(https?:)?\/\//.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  );
}

export function AppLink({
  href,
  className,
  ariaLabel,
  target,
  rel,
  children,
  endAdornment,
  onClick,
}: AppLinkProps) {
  const content = (
    <>
      {children}
      {endAdornment}
    </>
  );

  if (isExternal(href) || target === '_blank') {
    return (
      <a href={href} className={className} aria-label={ariaLabel} target={target} rel={rel}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={className} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

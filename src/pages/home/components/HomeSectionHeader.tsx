import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';

type HomeSectionHeaderProps = {
  eyebrow: string;
  title: string;
  href: string;
};

export function HomeSectionHeader({ eyebrow, title, href }: HomeSectionHeaderProps) {
  return (
    <header className="home-section-header">
      <div className="home-section-header__copy">
        <p className="home-section-kicker">{eyebrow}</p>
        <h2 className="home-section-title">{title}</h2>
      </div>

      <AppLink href={href} className="home-section-link">
        See All
        <Icon icon="mdi:chevron-right" aria-hidden="true" />
      </AppLink>
    </header>
  );
}

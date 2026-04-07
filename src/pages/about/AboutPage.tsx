import { getSiteConfig } from '@/data/content';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import OurStory from '../home/components/OurStory';
import CoreValues from './CoreValues';
import Leadership from '../home/components/Leadership';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ROUTES } from '@/shared/constants/routes';

export function AboutPage() {
  // const config = getSiteConfig();

  const breadcrumbItems = [{ label: 'Home', href: ROUTES.HOME }, { label: 'About Us' }];

  return (
    <>
      <SEO
        title="About"
        description="Learn about our alumni network, mission, and the team behind the Open Alumns Portal."
      />

      <Breadcrumbs items={breadcrumbItems} />
      <OurStory />
      <CoreValues />
      <Leadership />
    </>
  );
}

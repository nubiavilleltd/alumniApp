import { SEO } from '@/shared/common/SEO';
import { getSiteConfig } from '@/data/content';
import { SectionErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import HeroSection from './components/HeroSection';
import HomeStats from './components/HomeStats';
import OurStory from './components/OurStory';
import OurProjects from './components/OurProjects';
import UpcomingEvents from './components/UpcomingEvents';
import NewsAndStories from './components/NewsAndStories';
import Leadership from './components/Leadership';

export function HomePage() {
  const config = getSiteConfig();
  return (
    <>
      <SEO title={config.site.name} description={config.site.description} />

      {/* Static sections — no boundary needed */}
      <HeroSection />
      <HomeStats />
      <OurStory />

      {/* Dynamic sections — each isolated so one failure doesn't affect others */}
      <SectionErrorBoundary>
        <OurProjects />
      </SectionErrorBoundary>

      <SectionErrorBoundary>
        <UpcomingEvents />
      </SectionErrorBoundary>

      <SectionErrorBoundary>
        <NewsAndStories />
      </SectionErrorBoundary>

      <SectionErrorBoundary>
        <Leadership />
      </SectionErrorBoundary>
    </>
  );
}

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { AdminBanner } from '../components/AdminBanner';
import { BlogContentPanel } from '../components/pages-content/BlogContentPanel';
import { FaqContentPanel } from '../components/pages-content/FaqContentPanel';
import { HomeContentPanel } from '../components/pages-content/HomeContentPanel';
import { PagesContentTabs } from '../components/pages-content/PagesContentTabs';
import type { PagesContentTab } from '../components/pages-content/types';

const pagesContentTabs: PagesContentTab[] = ['home', 'blog', 'faqs'];

function getPagesContentTab(value: string | null): PagesContentTab {
  return pagesContentTabs.includes(value as PagesContentTab) ? (value as PagesContentTab) : 'home';
}

export function AdminPagesContentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getPagesContentTab(searchParams.get('tab'));

  const setActiveTab = (tab: PagesContentTab) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set('tab', tab);
        return nextParams;
      },
      { replace: true },
    );
  };

  const activePanel = useMemo(() => {
    if (activeTab === 'home') return <HomeContentPanel activeTab={activeTab} />;
    if (activeTab === 'blog') return <BlogContentPanel activeTab={activeTab} />;
    return <FaqContentPanel activeTab={activeTab} />;
  }, [activeTab]);

  return (
    <>
      <SEO title="Pages Content" description="Manage page content" />
      <AdminBanner activeTab="pages_content" title="Pages Content" headingLevel="h1" />

      <section className="bg-cms-surface py-8">
        <div className="mx-auto w-full max-w-[1312px] px-4 sm:px-6 lg:px-0">
          <PagesContentTabs activeTab={activeTab} onChange={setActiveTab} />
          <div key={activeTab}>{activePanel}</div>
        </div>
      </section>
    </>
  );
}

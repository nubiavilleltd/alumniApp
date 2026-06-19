import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { SEO } from '@/shared/common/SEO';
import { AdminBanner } from '../components/AdminBanner';

type PagesContentTab = 'home' | 'blog' | 'faqs';

const pagesContentTabs: Array<{ id: PagesContentTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'blog', label: 'Blog' },
  { id: 'faqs', label: 'FAQs' },
];

const homepageImages = ['/alumni-hero-img1.jpg', '/alumni-hero-img4.jpg', '/alumni-hero-img5.jpg'];

function PagesContentTabs({
  activeTab,
  onChange,
}: {
  activeTab: PagesContentTab;
  onChange: (tab: PagesContentTab) => void;
}) {
  return (
    <div className="flex items-end gap-2 overflow-x-auto bg-transparent pl-0">
      {pagesContentTabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'relative flex items-center justify-center px-6 text-center text-xl font-bold tracking-normal transition-all duration-300 ease-out sm:min-w-36 sm:px-8 lg:text-2xl',
              isActive
                ? 'z-10 translate-y-px rounded-t-[2.5rem] bg-white text-[#0077CC]'
                : 'text-cms-tab-inactive hover:-translate-y-0.5 hover:text-cms-tab-active',
            ].join(' ')}
            aria-pressed={isActive}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function DragHandle() {
  return (
    <div className="mx-auto grid w-9 grid-cols-3 gap-1" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <span key={index} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
      ))}
    </div>
  );
}

function HomeContentPanel({ activeTab }: { activeTab: PagesContentTab }) {
  return (
    <div
      className={[
        'animate-slide-up space-y-10 rounded-[1.75rem] bg-white px-5 py-7 shadow-sm sm:px-8 lg:px-10',
        activeTab === 'home' ? 'rounded-tl-none' : '',
      ].join(' ')}
    >
      <section>
        <div className="mb-7 flex flex-col gap-4 border-b border-primary-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xl font-semibold leading-snug text-cms-tab-inactive lg:text-2xl">
            Upload and organise the carousel images displayed on the homepage.
          </p>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-primary-500 px-5 py-2.5 text-base font-bold text-primary-500 transition-all duration-200 hover:bg-primary-50"
          >
            <Plus className="h-5 w-5" />
            Add new image
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {homepageImages.map((image, index) => (
            <article
              key={image}
              className="min-h-[20rem] rounded-xl border border-primary-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <DragHandle />
              <p className="mt-6 text-2xl font-bold text-gray-900">{index + 1}</p>
              <img
                src={image}
                alt=""
                className="mt-8 h-48 w-full rounded-md object-cover sm:h-56 lg:h-64"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-7">
        <p className="text-xl font-semibold leading-snug text-cms-tab-inactive lg:text-2xl">
          Edit the greeting message displayed on the homepage.
        </p>

        <div className="space-y-4">
          <label className="block text-base font-semibold text-gray-500" htmlFor="greeting-title">
            Greeting Title
          </label>
          <input
            id="greeting-title"
            type="text"
            defaultValue="Welcome home"
            className="h-16 w-full max-w-3xl rounded-full border-0 bg-cms-surface px-6 text-base font-medium text-gray-600 outline-none transition-shadow focus:ring-4 focus:ring-primary-100"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-base font-semibold text-gray-500" htmlFor="greeting-message">
            Greeting Message
          </label>
          <textarea
            id="greeting-message"
            rows={4}
            defaultValue="A global sisterhood of Federal Government Girls' College alumnae connected by shared memories, driven by purpose, and committed to lifting the next generation."
            className="w-full resize-none rounded-[1.5rem] border-0 bg-cms-surface px-6 py-5 text-base font-medium leading-relaxed text-gray-600 outline-none transition-shadow focus:ring-4 focus:ring-primary-100"
          />
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="button"
            className="rounded-full bg-primary-500 px-10 py-3 text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-600 hover:shadow-lg"
          >
            Update Homepage
          </button>
        </div>
      </section>
    </div>
  );
}

function PlaceholderPanel({ activeTab, title }: { activeTab: PagesContentTab; title: string }) {
  return (
    <div
      className={[
        'animate-slide-up rounded-[1.75rem] bg-white px-5 py-10 shadow-sm sm:px-8 lg:px-10',
        activeTab === 'home' ? 'rounded-tl-none' : '',
      ].join(' ')}
    >
      <p className="text-xl font-semibold text-cms-tab-inactive">
        {title} content tools coming next.
      </p>
    </div>
  );
}

export function AdminPagesContentPage() {
  const [activeTab, setActiveTab] = useState<PagesContentTab>('home');

  const activePanel = useMemo(() => {
    if (activeTab === 'home') return <HomeContentPanel activeTab={activeTab} />;
    if (activeTab === 'blog') return <PlaceholderPanel activeTab={activeTab} title="Blog" />;
    return <PlaceholderPanel activeTab={activeTab} title="FAQs" />;
  }, [activeTab]);

  return (
    <>
      <SEO title="Pages Content" description="Manage page content" />
      <AdminBanner activeTab="pages_content" title="Pages Content" headingLevel="h1" />

      <section className="bg-cms-surface py-8">
        <div className="container-custom">
          <PagesContentTabs activeTab={activeTab} onChange={setActiveTab} />
          <div key={activeTab}>{activePanel}</div>
        </div>
      </section>
    </>
  );
}

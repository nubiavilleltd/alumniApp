import type { PagesContentTab } from './types';

const pagesContentTabs: Array<{ id: PagesContentTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'blog', label: 'Blog' },
  { id: 'faqs', label: 'FAQs' },
];

export function PagesContentTabs({
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
              'relative flex min-h-[2.5rem] items-center justify-center px-8 py-2 text-center text-[16px] font-semibold tracking-normal transition-all duration-300 ease-out',
              isActive
                ? 'z-10 translate-y-px rounded-t-[1.2rem] bg-white text-cms-tab-active'
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

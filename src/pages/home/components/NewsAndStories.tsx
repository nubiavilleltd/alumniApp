import { AppLink } from '@/shared/components/ui/AppLink';
import { useLatestAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
import type { NewsItem } from '@/features/announcements/types/announcement.types';

// ─── Skeletons ────────────────────────────────────────────────────────────────
function FeaturedSkeleton() {
  return (
    <div className="lg:col-span-3 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-24 mt-2" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex gap-3 items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 animate-pulse">
      <div className="w-20 h-16 flex-shrink-0 rounded-lg bg-gray-200" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-16 mt-1" />
      </div>
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────
function FeaturedCard({ item }: { item: NewsItem }) {
  return (
    <div className="lg:col-span-3 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div className="h-56 bg-gray-100 overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        {item.tag && (
          <span className="inline-block bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 w-fit tracking-wider">
            {item.tag}
          </span>
        )}
        <h3 className="text-gray-900 font-bold text-lg leading-snug mb-3">{item.title}</h3>
        {item.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed flex-1">{item.excerpt}</p>
        )}
        <p className="text-primary-500 text-xs font-semibold mt-4">{item.date}</p>
      </div>
    </div>
  );
}

function SidebarCard({ item }: { item: NewsItem }) {
  return (
    <AppLink
      href={`/news/${item.slug}`}
      className="flex gap-3 items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
    >
      <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div>
        <h4 className="text-gray-800 text-xs font-semibold leading-snug group-hover:text-primary-500 transition-colors">
          {item.title}
        </h4>
        <p className="text-gray-400 text-[11px] mt-1">{item.date}</p>
      </div>
    </AppLink>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function NewsAndStories() {
  const { data: items = [], isLoading } = useLatestAnnouncements(5);

  const featured = items.find((n) => n.featured) ?? items[0];
  const sidebar = items.filter((n) => n.id !== featured?.id);

  return (
    <section className="section">
      <div className="container-custom">
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Latest
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          News &amp; <span className="text-primary-500">Stories</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {isLoading ? (
            <>
              <FeaturedSkeleton />
              <div className="lg:col-span-2 flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SidebarSkeleton key={i} />
                ))}
              </div>
            </>
          ) : (
            <>
              {featured && <FeaturedCard item={featured} />}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {sidebar.map((item) => (
                  <SidebarCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

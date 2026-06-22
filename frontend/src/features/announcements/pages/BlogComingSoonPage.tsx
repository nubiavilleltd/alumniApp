import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock3 } from 'lucide-react';

import { SEO } from '@/shared/common/SEO';

type BlogCategory =
  | 'All'
  | 'Alumnae Stories'
  | 'Community Impact'
  | 'Industry Insights'
  | 'Career & Professional Growth'
  | 'Entrepreneurship & Business'
  | 'Lifestyle & Personal Development'
  | 'Health & Wellness';

type BlogPost = {
  id: number;
  category: Exclude<BlogCategory, 'All'>;
  image: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
};

const categories: BlogCategory[] = [
  'All',
  'Alumnae Stories',
  'Community Impact',
  'Industry Insights',
  'Career & Professional Growth',
  'Entrepreneurship & Business',
  'Lifestyle & Personal Development',
  'Health & Wellness',
];

const posts: BlogPost[] = [
  {
    id: 1,
    category: 'Alumnae Stories',
    image: '/news-1.png',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
  {
    id: 2,
    category: 'Career & Professional Growth',
    image: '/news-2.png',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
  {
    id: 3,
    category: 'Entrepreneurship & Business',
    image: '/news-3.png',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
  {
    id: 4,
    category: 'Entrepreneurship & Business',
    image: '/news-4.png',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
  {
    id: 5,
    category: 'Lifestyle & Personal Development',
    image: '/news-5.png',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
  {
    id: 6,
    category: 'Industry Insights',
    image: '/alumni-hero-img3.jpg',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
  {
    id: 7,
    category: 'Health & Wellness',
    image: '/alumni-hero-img4.jpg',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
  {
    id: 8,
    category: 'Alumnae Stories',
    image: '/alumni-hero-img5.jpg',
    date: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Elementum nullam ultrices risus justo auctor vehicula condimentum ut. Sollicitudin nibh dolor amet eu vel elit...',
  },
];

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#eef2f5] bg-white shadow-[0_1px_2px_rgba(7,17,22,0.04)] transition-colors duration-200 hover:border-primary-100">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#e9edf1]">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <div className="mb-2 flex min-w-0 items-center gap-1.5 text-sm font-semibold leading-none text-[#59626c]">
          <Clock3 className="h-4 w-4 shrink-0" />
          <span className="truncate">{post.date}</span>
          <span className="shrink-0" aria-hidden="true">
            |
          </span>
          <span className="shrink-0">{post.readTime}</span>
        </div>
        <h2 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[#071116]">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-sm font-medium leading-relaxed text-[#59626c]">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}

export function BlogComingSoonPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 6);

  const filteredPosts =
    activeCategory === 'All' ? posts : posts.filter((post) => post.category === activeCategory);

  return (
    <>
      <SEO
        title="Blog"
        description="Discover inspiring stories, career insights, community updates, and valuable resources from our alumnae network."
      />

      <main className="min-h-screen bg-[#F8F8F7] text-[#071116]">
        <section className="container-custom py-8 sm:py-10">
          <header className="mb-8 max-w-2xl">
            <h1 className="mb-2 text-4xl font-extrabold leading-tight text-[#071116]">Blog</h1>
            <p className="max-w-xl text-base font-medium leading-relaxed text-[#4B5563]">
              Discover inspiring stories, career insights, community updates, and valuable
              resources from our alumnae network.
            </p>
          </header>

          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="scrollbar-hide flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth pb-1">
              {visibleCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-10 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 ${
                    activeCategory === category
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-primary-100 bg-white text-[#4B5563] hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {category}
                </button>
              ))}

              {!showAllCategories && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories(true)}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-white px-3 py-2 text-primary-500 transition-colors hover:border-primary-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
                  aria-label="Show all categories"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="shrink-0 lg:ml-auto">
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-semibold text-[#4B5563] shadow-[0_1px_2px_rgba(7,17,22,0.04)] transition-colors hover:border-primary-300 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
              >
                Latest
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

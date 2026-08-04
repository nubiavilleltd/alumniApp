import { useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { formatNewsDate } from '../utils';
import { useLiveNews } from '../hooks/useLiveNews';
import { ROUTES } from '@/shared/constants/routes';

export default function LiveNewsDetailPage() {
  const { id } = useParams<{ id: string; slug: string }>();

  const { data: liveNewsData = [], isLoading } = useLiveNews();
  const item = liveNewsData.find((n) => n.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F7]">
        <div className="container-custom py-8 sm:py-10 animate-pulse space-y-6">
          <div className="h-[400px] w-full rounded-2xl bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-8 w-1/2 rounded bg-gray-200" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8F8F7] flex items-center justify-center">
        <p className="text-gray-500">Article not found.</p>
      </div>
    );
  }

  return (
    <>
      <SEO title={item.title} description={item.excerpt} />
      <div className="min-h-screen bg-[#F8F8F7]">
        <div className="container-custom py-8 sm:py-10">

          <Link
            to={ROUTES.LIVE_NEWS.ROOT}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← Back to Live News
          </Link>

          <article className="overflow-hidden">
         <div className='h-[300px] sm:h-[400px]'>   <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-contain rounded-2xl"
            /></div>
            <div className="py-8">
              <div className="mb-4 flex items-center gap-2 text-gray-800">
                <Clock size={15} />
                <span className="text-sm">{formatNewsDate(item.publishedAt)}</span>
              </div>
              {item.source && (
                <p className="mb-4 text-sm text-gray-500">
                  Source: <span className="font-semibold text-primary-500">{item.source}</span>
                </p>
              )}
              <h1 className="mb-6 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h1>
              <div className="space-y-5 text-gray-800 leading-relaxed text-base">
                {/* <p>{item.excerpt}</p> */}
                {item.body?.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </article>

        </div>
      </div>
    </>
  );
}
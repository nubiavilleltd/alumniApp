import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { SEO } from '@/shared/common/SEO';
import { liveNewsData } from '../mock/liveNewsData';
import { formatNewsDate } from '../utils';


export default function LiveNewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const item = useMemo(
    () => liveNewsData.find((n) => n.id === id),
    [id],
  );

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

          {/* Back button */}
          {/* <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="h-4 w-4" />
            Back to Live News
          </button> */}

          {/* Article card */}
          <article className="overflow-hidden">

            {/* Hero image — full width, no side padding */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-[300px] sm:h-[400px] w-full object-cover rounded-2xl"
            />

            {/* Content */}
            <div className=" py-8">

              {/* Timestamp */}
              <div className="mb-4 flex items-center gap-2 text-gray-800">
                <Clock size={15} />
                <span className="text-sm">{formatNewsDate(item.publishedAt)}</span>
              </div>

              {/* Title */}
              <h1 className="mb-6 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h1>

              {/* Body — excerpt + placeholder paragraphs */}
              <div className="space-y-5 text-gray-600 leading-relaxed text-base">
                <p>{item.excerpt}</p>
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
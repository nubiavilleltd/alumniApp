import { LiveNewsItem } from '../types/livenews.types';
import { Clock } from 'lucide-react';
import { formatNewsDate } from '../utils';
import { useNavigate } from 'react-router-dom';

const EXCERPT_LIMIT = 120; // characters

export function FeaturedNewsCard({ item }: { item: LiveNewsItem }) {
  const navigate = useNavigate();
  const isTruncated = item.excerpt.length > EXCERPT_LIMIT;
  const displayText = isTruncated
    ? item.excerpt.slice(0, EXCERPT_LIMIT).trimEnd()
    : item.excerpt;

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm p-3 flex flex-col gap-2">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-[240px] w-full object-cover rounded-3xl"
      />
      <div className="flex items-center gap-2 text-gray-800">
        <Clock size={15} />
        <span className="text-sm">{formatNewsDate(item.publishedAt)}</span>
      </div>
      <div className="pt-3">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">{item.title}</h2>
        <p className="text-gray-600 leading-relaxed">
          {displayText}
          {isTruncated && (
            <>
              {'... '}
              <button
                onClick={() => navigate(`/live-news/${item.id}`)}
                className="text-primary-500 font-semibold hover:underline"
              >
                Read more
              </button>
            </>
          )}
        </p>
      </div>
    </article>
  );
}
import { LiveNewsItem } from '../types/livenews.types';
import { Clock, Dot } from 'lucide-react';
import { formatNewsDate } from '../utils';
import { Link } from 'react-router-dom';
import { LIVE_NEWS_ROUTES } from '../routes';
import { ROUTES } from '@/shared/constants/routes';
import placeholderImg from '/placeholder-image.png';




// const EXCERPT_LIMIT = 120; // characters

export function FeaturedNewsCard({ item }: { item: LiveNewsItem }) {
  // const isTruncated = item.excerpt.length > EXCERPT_LIMIT;
  // const displayText = isTruncated
  //   ? item.excerpt.slice(0, EXCERPT_LIMIT).trimEnd()
  //   : item.excerpt;

  return (
    <Link to={ROUTES.LIVE_NEWS.DETAIL(item.id, item.slug)} className="block">
      <article className="overflow-hidden rounded-3xl bg-white shadow-sm p-3 flex flex-col gap-2">
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={(e) => {
            e.currentTarget.src = placeholderImg
          }}
          referrerPolicy="no-referrer"
          className="h-[240px] w-full object-cover rounded-3xl"
        />


        <div className="mt-3 flex items-center gap-1 text-gray-800">
          <Clock size={15} />
          <span className="text-xs">{formatNewsDate(item.publishedAt)}</span>
          {item.source && (
            <span className="flex items-center text-xs">
              <Dot /> {item.source}
            </span>
          )}
        </div>

        <div className="pt-3">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">{item.title}</h2>
          <p className="text-gray-600 leading-relaxed">
            {item.excerpt}

          </p>
        </div>
      </article>
    </Link>

  );
}
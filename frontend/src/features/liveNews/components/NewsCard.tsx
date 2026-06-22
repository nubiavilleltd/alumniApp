import { LiveNewsItem } from '../types/livenews.types';
import { formatNewsDate } from "../utils"
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LIVE_NEWS_ROUTES } from '../routes';
import { ROUTES } from '@/shared/constants/routes';



export function NewsCard({
    item,
}: {
    item: LiveNewsItem;
}) {
    return (

        <Link to={ROUTES.LIVE_NEWS.DETAIL(item.id, item.slug)} className="block">
            <article className="flex flex-col sm:flex-row gap-4 rounded-3xl bg-white p-3 shadow-sm">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-[140px] sm:h-[200px] md:h-[140px] w-full sm:w-[160px] rounded-2xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex flex-col justify-between py-1">
                    <div>
                        <h3 className="line-clamp-2 text-base font-bold text-gray-900">
                            {item.title}
                        </h3>
                        {item.source && (
                            <span className="mt-1 inline-block text-xs font-medium text-primary-500">
                                {item.source}
                            </span>
                        )}
                        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                            {item.excerpt}
                        </p>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-gray-800">
                        <Clock size={15} />
                        <span className="text-xs">{formatNewsDate(item.publishedAt)}</span>
                    </div>
                </div>
            </article>
        </Link>

    );
}
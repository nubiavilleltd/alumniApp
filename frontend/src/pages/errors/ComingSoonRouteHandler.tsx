// src/pages/errors/ComingSoonRouteHandler.tsx

import { useLocation } from 'react-router-dom';
import { ComingSoonPage } from '../ComingSoonPage';

interface Props {
  title: string;
}

export function ComingSoonRouteHandler({ title }: Props) {
  const location = useLocation();

  const slug = location.pathname.split('/').pop();

  const formattedSlug = slug && slug !== title.toLowerCase() ? slug.replace(/-/g, ' ') : null;

  return <ComingSoonPage title={formattedSlug ? `${formattedSlug}` : title} />;
}

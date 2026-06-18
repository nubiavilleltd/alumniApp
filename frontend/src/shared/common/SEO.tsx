// import { usePageMeta } from '@/shared/hooks'

import { usePageMeta } from '../hooks/usePageMeta';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile';
}

/**
 * SEO Component - Sets page metadata (title, description, OG tags, etc.)
 *
 * @example
 * <SEO title="About" description="Learn about us" />
 */
export function SEO(props: SEOProps) {
  usePageMeta(props);
  return null;
}

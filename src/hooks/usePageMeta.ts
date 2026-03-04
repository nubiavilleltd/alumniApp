import { useEffect } from 'react';
import { getSiteConfig } from '@/data/content';

interface MetaOptions {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}

function setMeta(attr: 'name' | 'property', key: string, value: string): void {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
}

export function usePageMeta({ title, description, image, canonical }: MetaOptions): void {
  useEffect(() => {
    const config = getSiteConfig();
    const pageTitle =
      title === 'Home' || title === config.site.name
        ? config.site.name
        : config.seo.title_template.replace('%s', title);

    const pageDescription = description ?? config.seo.default_description;
    const imageUrl = new URL(image ?? config.seo.og_image, window.location.origin).toString();
    const pageUrl = canonical ?? window.location.href;

    document.title = pageTitle;

    setMeta('name', 'description', pageDescription);
    setMeta('name', 'keywords', config.seo.keywords.join(', '));
    setMeta('name', 'author', config.seo.author);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDescription);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:site_name', config.site.name);
    setMeta('name', 'twitter:card', config.seo.twitter_card);
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', pageDescription);
    setMeta('name', 'twitter:image', imageUrl);

    if (canonical) {
      let canonicalTag = document.head.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.href = canonical;
    }
  }, [canonical, description, image, title]);
}

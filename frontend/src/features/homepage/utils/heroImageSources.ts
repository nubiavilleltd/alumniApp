import manifest from '../data/hero-images.generated.json';
import type { HomepageCarouselImage } from '../types/homepage.types';

type OptimizedImage = {
  updatedAt: string;
  variants: { src: string; width: number; height: number; bytes: number }[];
};

function canonicalUrl(value: string) {
  try {
    const url = new URL(value);
    url.pathname = url.pathname.replace('/./', '/');
    return url.toString();
  } catch {
    return value;
  }
}

export function heroImageKey(image: HomepageCarouselImage) {
  return JSON.stringify([image.id, image.imageUrl, image.updatedAt ?? '']);
}

export function heroImageSources(image: HomepageCarouselImage) {
  const entry = (manifest as Record<string, OptimizedImage>)[canonicalUrl(image.imageUrl)];
  // Newly uploaded/replaced images work immediately through the original URL.
  // A CMS update must not silently show an old generated asset.
  if (!entry || entry.updatedAt !== (image.updatedAt ?? '') || !entry.variants.length) {
    return { src: image.imageUrl, srcSet: undefined, sizes: undefined };
  }
  const fallback = entry.variants.at(-1)!;
  return {
    src: fallback.src,
    srcSet: entry.variants.map((v) => `${v.src} ${v.width}w`).join(', '),
    // The mobile hero is 62rem tall. Account for object-cover's scale so a
    // narrow phone doesn't receive an image too small for its tall crop.
    sizes: `(max-width: 640px) max(100vw, ${Math.ceil((992 * fallback.width) / fallback.height)}px), 100vw`,
  };
}

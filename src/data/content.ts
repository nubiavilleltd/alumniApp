import yaml from 'js-yaml';
import { marked } from 'marked';
import siteConfigRaw from '../../site.config.yml?raw';
import type { AlumniEntry, BlogEntry, EventEntry, SiteConfig } from '@/types/content';

marked.setOptions({
  gfm: true,
  breaks: true,
});

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: normalized };
  }

  const [, frontmatter, content] = match;
  const parsed = yaml.load(frontmatter);

  return {
    data: (parsed as Record<string, unknown>) ?? {},
    content,
  };
}

function fileSlug(path: string, extension: string): string {
  const file = path.split('/').pop() ?? '';
  return file.replace(new RegExp(`${extension}$`), '');
}

function sortByDateDesc<T extends { data: { date?: string; publishDate?: string } }>(
  items: T[],
  key: 'date' | 'publishDate',
): T[] {
  return [...items].sort(
    (a, b) =>
      new Date((b.data[key] as string) ?? 0).getTime() -
      new Date((a.data[key] as string) ?? 0).getTime(),
  );
}

const siteConfig = yaml.load(siteConfigRaw) as SiteConfig;

const alumniFiles = import.meta.glob('../content/alumni/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const eventFiles = import.meta.glob('../content/events/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const blogFiles = import.meta.glob('../content/blog/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const alumniEntries: AlumniEntry[] = Object.entries(alumniFiles).map(([path, raw]) => {
  const data = yaml.load(raw) as AlumniEntry['data'];
  return {
    slug: data.slug ?? fileSlug(path, '.yaml'),
    data,
  };
});

const eventEntries: EventEntry[] = sortByDateDesc(
  Object.entries(eventFiles).map(([path, raw]) => {
    const data = yaml.load(raw) as EventEntry['data'];
    return {
      slug: data.slug ?? fileSlug(path, '.yaml'),
      data,
    };
  }),
  'date',
);

const blogEntries: BlogEntry[] = sortByDateDesc(
  Object.entries(blogFiles).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const slug = fileSlug(path, '.md');

    return {
      slug,
      data: data as BlogEntry['data'],
      content,
    };
  }),
  'publishDate',
);

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

export function applyConfigColors(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const { colors } = siteConfig;
  const root = document.documentElement;

  Object.entries(colors).forEach(([palette, shadeMap]) => {
    Object.entries(shadeMap).forEach(([shade, value]) => {
      root.style.setProperty(`--color-${palette}-${shade}`, value);
    });
  });
}



export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

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

const siteConfig = yaml.load(siteConfigRaw) as SiteConfig;

// const eventEntries: EventEntry[] = sortByDateDesc(
//   Object.entries(eventFiles).map(([path, raw]) => {
//     const data = yaml.load(raw) as EventEntry['data'];
//     return {
//       slug: data.slug ?? fileSlug(path, '.yaml'),
//       data,
//     };
//   }),
//   'date',
// );

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

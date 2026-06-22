export type PagesContentTab = 'home' | 'blog' | 'faqs';

export type HomepageImage = {
  id: string;
  src: string;
  fileName?: string;
  isHidden: boolean;
  sortOrder: number;
};

export type BlogPostStatus = 'published' | 'draft';

export type BlogPost = {
  id: string;
  category: string;
  status: BlogPostStatus;
  image: string;
  publishedAt: string;
  readTime: string;
  title: string;
  excerpt: string;
};

export type BlogPanelMode = 'list' | 'create';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type DropPosition = 'before' | 'after';

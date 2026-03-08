// export type BlogPostSummary = {
//   id?: string;
//   title: string;
//   slug: string;
//   description: string;
//   publishDate: string;
//   image?: string;
//   category?: string;
//   featured?: boolean;
//   excerpt?: string;
//   readingTime?: number;
// };

// export type BlogPost = BlogPostSummary & {
//   author: string;
//   author_photo?: string;
//   author_bio?: string;
//   tags?: string[];
//   draft?: boolean;
//   content: string;
// };

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  author_photo: string;
  author_bio: string;
  publishDate: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  excerpt: string;
  readingTime: number;
  content: string;
};

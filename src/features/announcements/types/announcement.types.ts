

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  date: string;
  image: string;
  tag?: string;
  excerpt?: string;
  featured?: boolean;
}
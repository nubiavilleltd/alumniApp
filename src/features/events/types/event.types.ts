export type Event = {
  title: string;
  slug: string;
  date: string; // or Date if you plan to convert it
  description: string;
  content: string;
  location: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
  isVirtual:boolean;
  attire:string;
  type?:string
};





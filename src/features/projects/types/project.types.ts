export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  amountRaised: number;
  targetAmount?: number;
  status: 'active' | 'completed';
  sortOrder?: number;
  isFeatured?: number;
  createdAt?: string;
  createdByName?: string;
  chapterName?: string | null;
}

export interface DonatePayload {
  amount: number;
  name: string;
  email: string;
}

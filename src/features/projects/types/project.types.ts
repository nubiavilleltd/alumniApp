// export interface Project {
//   id: string;
//   title: string;
//   description: string;
//   images: string[];
//   amountRaised: number;
//   targetAmount?: number;
//   status: 'active' | 'completed';
//   sortOrder?: number;
//   isFeatured?: number;
//   createdAt?: string;
//   createdByName?: string;
//   chapterName?: string | null;
// }

// export interface DonatePayload {
//   amount: number;
//   name: string;
//   email: string;
// }

// features/projects/types/project.types.ts

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

// ─── Admin payloads ────────────────────────────────────────────────────────────

export interface CreateProjectFormData {
  title: string;
  description: string;
  targetAmount?: number;
  amountRaised?: number;
  status: 'active' | 'completed';
  sortOrder?: number;
  isFeatured?: boolean;
  images: File[];
}

export interface UpdateProjectFormData extends Partial<CreateProjectFormData> {
  // imageAction controls how existing images are handled on update
  imageAction?: 'add' | 'replace';
  // removeImages: array of existing image URLs to delete
  removeImages?: string[];
}

import { Project } from '../types/project.types';

export function mapBackendProject(project: any): Project {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    images: project.images ?? [],
    amountRaised: Number(project.amount_raised ?? 0),
    targetAmount: project.target_amount ? Number(project.target_amount) : undefined,
    status: project.status,
    sortOrder: project.sort_order,
    isFeatured: project.is_featured,
    createdAt: project.created_at,
    createdByName: project.created_by_name,
    chapterName: project.chapter_name,
  };
}

// import { Project } from '../types/project.types';

// export function mapBackendProject(project: any): Project {
//   return {
//     id: project.id,
//     title: project.title,
//     description: project.description,
//     images: project.images ?? [],
//     amountRaised: Number(project.amount_raised ?? 0),
//     targetAmount: project.target_amount ? Number(project.target_amount) : undefined,
//     status: project.status,
//     sortOrder: project.sort_order,
//     isFeatured: project.is_featured,
//     createdAt: project.created_at,
//     createdByName: project.created_by_name,
//     chapterName: project.chapter_name,
//   };
// }

// features/projects/api/adapters/project.adapter.ts
//
// Maps between backend project format and frontend Project type.
// UPDATE THIS FILE when the backend changes — nothing else needs to touch.
//
// Backend → Frontend field map:
//   id            → id
//   amount_raised → amountRaised
//   target_amount → targetAmount
//   sort_order    → sortOrder
//   is_featured   → isFeatured
//   created_by_name → createdByName
//   chapter_name  → chapterName

import { parseImages } from '@/lib/utils/adapters';
import { CreateProjectFormData, Project, UpdateProjectFormData } from '../types/project.types';

// ─── Inbound (backend → frontend) ────────────────────────────────────────────

export function mapBackendProject(raw: unknown): Project {
  const d = raw as Record<string, unknown>;

  return {
    id: String(d.id ?? ''),
    title: String(d.title ?? ''),
    description: String(d.description ?? ''),
    images: parseImages(d.images),
    amountRaised: Number(d.amount_raised ?? 0),
    targetAmount: d.target_amount ? Number(d.target_amount) : undefined,
    status: d.status === 'completed' ? 'completed' : 'active',
    sortOrder: d.sort_order ? Number(d.sort_order) : undefined,
    isFeatured: d.is_featured ? Number(d.is_featured) : 0,
    createdAt: d.created_at ? String(d.created_at) : undefined,
    createdByName: d.created_by_name ? String(d.created_by_name) : undefined,
    chapterName: d.chapter_name ? String(d.chapter_name) : null,
  };
}

export function mapBackendProjectList(rawList: unknown[]): Project[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item) => {
      try {
        return mapBackendProject(item);
      } catch {
        return null;
      }
    })
    .filter((p): p is Project => p !== null);
}

// ─── Outbound (frontend → backend) ───────────────────────────────────────────

/**
 * Build create-project payload.
 * Uses FormData when images are provided, plain JSON otherwise.
 */
export function mapProjectToCreatePayload(
  formData: CreateProjectFormData,
): FormData | Record<string, unknown> {
  const base: Record<string, unknown> = {
    title: formData.title,
    description: formData.description,
    status: formData.status,
  };

  if (formData.targetAmount != null) base.target_amount = String(formData.targetAmount);
  if (formData.amountRaised != null) base.amount_raised = String(formData.amountRaised);
  if (formData.sortOrder != null) base.sort_order = String(formData.sortOrder);
  if (formData.isFeatured != null) base.is_featured = formData.isFeatured ? '1' : '0';

  if (formData.images.length > 0) {
    const fd = new FormData();
    Object.entries(base).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    // Backend expects multiple "images" entries — browser names them images[0], images[1], etc.
    formData.images.forEach((img) => fd.append('images[]', img));
    return fd;
  }

  return base;
}

/**
 * Build update-project payload.
 * Sends to /manage_project with function_type: "update".
 * Handles the three image modes: add, replace, remove specific URLs.
 */
export function mapProjectToUpdatePayload(
  projectId: string,
  formData: UpdateProjectFormData,
): FormData | Record<string, unknown> {
  const base: Record<string, unknown> = {
    id: projectId,
    function_type: 'update',
  };

  if (formData.title != null) base.title = formData.title;
  if (formData.description != null) base.description = formData.description;
  if (formData.status != null) base.status = formData.status;
  if (formData.targetAmount != null) base.target_amount = String(formData.targetAmount);
  if (formData.amountRaised != null) base.amount_raised = String(formData.amountRaised);
  if (formData.sortOrder != null) base.sort_order = String(formData.sortOrder);
  if (formData.isFeatured != null) base.is_featured = formData.isFeatured ? '1' : '0';
  if (formData.imageAction) base.image_action = formData.imageAction;

  // remove_images must be a JSON string of URL array
  if (formData.removeImages?.length) {
    base.remove_images = JSON.stringify(formData.removeImages);
  }

  const hasNewImages = (formData.images?.length ?? 0) > 0;

  if (hasNewImages) {
    const fd = new FormData();
    Object.entries(base).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    formData.images!.forEach((img) => fd.append('images', img));
    console.log('formD', { formData });
    return fd;
  }

  console.log('base', { base });
  return base;
}

/** Build delete-project payload for /manage_project. */
export function mapProjectToDeletePayload(projectId: string): Record<string, unknown> {
  return { id: projectId, function_type: 'delete' };
}

/** Build payload to fetch a single project by ID. */
export function mapGetSingleProjectPayload(id: string): Record<string, unknown> {
  return { id };
}

/** Build paginated fetch payload. */
export function mapGetProjectsPayload(params?: {
  limit?: number;
  offset?: number;
}): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (params?.limit != null) payload.limit = String(params.limit);
  if (params?.offset != null) payload.offset = String(params.offset);
  return payload;
}

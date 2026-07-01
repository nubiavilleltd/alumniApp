import { apiClient } from '@/lib/api/client';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { AdminApiProduct, CreateProductFormData, UpdateProductFormData } from '../types/adminstore.types';

const ENDPOINTS = {
  FETCH: '/product/fetch_products',
  ADD: '/product/add_product',
  EDIT: '/product/edit_product',
  DELETE: '/product/delete_product',
} as const;

// ─── Build FormData for create ────────────────────────────────────────────────

function buildCreatePayload(data: CreateProductFormData): FormData {
  const fd = new FormData();
  fd.append('product_name', data.productName);
  fd.append('category', data.category);
  fd.append('price', data.price);
  fd.append('description', data.description);
  fd.append('has_color', data.hasColor ? '1' : '0');
  fd.append('has_size', data.hasSize ? '1' : '0');

  if (!data.hasColor && !data.hasSize) {
    fd.append('quantity', String(data.quantity ?? 0));
  } else {
    fd.append('quantity', 'null');
    fd.append('variants', JSON.stringify(data.variants));
  }

  data.imageFiles.forEach((file) => fd.append('images[]', file));
  fd.append('spotlight_index', String(data.spotlightIndex));

  return fd;
}

// ─── Build FormData for update ────────────────────────────────────────────────

function buildUpdatePayload(data: UpdateProductFormData): FormData {
  const fd = new FormData();
  fd.append('product_id', data.productId);
  fd.append('product_name', data.productName);
  fd.append('category', data.category);
  fd.append('price', data.price);
  fd.append('description', data.description);
  fd.append('has_color', data.hasColor ? '1' : '0');
  fd.append('has_size', data.hasSize ? '1' : '0');

  if (!data.hasColor && !data.hasSize) {
    fd.append('quantity', String(data.quantity ?? 0));
  } else {
    fd.append('quantity', 'null');
    fd.append('variants', JSON.stringify(data.variants));
  }

  if (data.newImageFiles.length > 0) {
    data.newImageFiles.forEach((file) => fd.append('images[]', file));
  }

  if (data.deleteImageIds.length > 0) {
    fd.append('delete_image_ids', JSON.stringify(data.deleteImageIds.map(Number)));
  }

  // Spotlight: existing image takes priority over new upload index
  if (data.spotlightImageId) {
    fd.append('spotlight_image_id', data.spotlightImageId);
  } else if (data.spotlightIndex !== undefined) {
    fd.append('spotlight_index', String(data.spotlightIndex));
  }

  return fd;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const adminStoreService = {
  async fetchAll(): Promise<AdminApiProduct[]> {
    try {
      const { data } = await apiClient.get(ENDPOINTS.FETCH);
      return (data?.data ?? data?.products ?? []) as AdminApiProduct[];
    } catch (error) {
      throw handleApiError(error, 'Failed to load products.', 'adminStoreService.fetchAll');
    }
  },

  async create(formData: CreateProductFormData): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.ADD, buildCreatePayload(formData));
    } catch (error) {
      throw handleApiError(error, 'Failed to create product.', 'adminStoreService.create');
    }
  },

  async update(formData: UpdateProductFormData): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.EDIT, buildUpdatePayload(formData));
    } catch (error) {
      throw handleApiError(error, 'Failed to update product.', 'adminStoreService.update');
    }
  },

  async delete(productId: string): Promise<void> {
    try {
      const fd = new FormData();
      fd.append('product_id', productId);
      await apiClient.post(ENDPOINTS.DELETE, fd);
    } catch (error) {
      throw handleApiError(error, 'Failed to delete product.', 'adminStoreService.delete');
    }
  },
};
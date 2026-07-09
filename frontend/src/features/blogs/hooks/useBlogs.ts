import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { toast } from '@/shared/components/ui/Toast';
import { blogService } from '../services/blog.service';
import type {
  GetBlogPostsInput,
  ReorderBlogCategoryInput,
  SaveBlogPostInput,
} from '../services/blog.service';
import type { BlogCategory, SaveBlogCategoryInput } from '../types/blog.types';
import { toBooleanActive } from '../api/adapters/blog.adapter';

export const blogKeys = {
  all: ['blogs'] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  adminCategories: () => [...blogKeys.categories(), 'admin'] as const,
  postsRoot: () => [...blogKeys.all, 'posts'] as const,
  posts: (input: GetBlogPostsInput = {}) => [...blogKeys.all, 'posts', input] as const,
  detail: (idOrSlug: string, admin?: boolean) =>
    [...blogKeys.all, 'detail', idOrSlug, admin ? 'admin' : 'public'] as const,
};

function upsertCategory(categories: BlogCategory[] | undefined, category: BlogCategory) {
  const currentCategories = categories ?? [];
  const existingIndex = currentCategories.findIndex((item) => item.id === category.id);

  if (existingIndex < 0) {
    return [...currentCategories, category].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return currentCategories
    .map((item) => (item.id === category.id ? { ...item, ...category } : item))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function removeCategory(categories: BlogCategory[] | undefined, categoryId: string) {
  return (categories ?? []).filter((category) => category.id !== categoryId);
}

function syncCategoryCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  category: BlogCategory,
) {
  queryClient.setQueryData<BlogCategory[]>(blogKeys.adminCategories(), (categories) =>
    upsertCategory(categories, category),
  );
  queryClient.setQueryData<BlogCategory[]>(blogKeys.categories(), (categories) => {
    if (!category.isActive) return removeCategory(categories, category.id);
    return upsertCategory(categories, category);
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: () => blogService.getCategories(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useAdminBlogCategories() {
  const accessToken = useTokenStore((state) => state.accessToken);

  return useQuery({
    queryKey: blogKeys.adminCategories(),
    queryFn: () => blogService.getAdminCategories(),
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 2,
  });
}

export function useBlogPosts(input: GetBlogPostsInput = {}) {
  const accessToken = useTokenStore((state) => state.accessToken);

  return useQuery({
    queryKey: blogKeys.posts(input),
    queryFn: () => blogService.getPosts(input),
    enabled: !input.admin || Boolean(accessToken),
    staleTime: 1000 * 60 * 2,
  });
}

export function useBlogPostDetail(idOrSlug?: string, options?: { admin?: boolean }) {
  const accessToken = useTokenStore((state) => state.accessToken);

  return useQuery({
    queryKey: blogKeys.detail(idOrSlug ?? '', options?.admin),
    queryFn: () => blogService.getPostDetail(idOrSlug ?? '', options),
    enabled: Boolean(idOrSlug) && (!options?.admin || Boolean(accessToken)),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveBlogPostInput) => blogService.createPost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Blog post saved.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveBlogCategoryInput) => blogService.createCategory(input),
    onSuccess: (category) => {
      console.log('[Blog Categories] create mutation success:', { category });
      syncCategoryCaches(queryClient, category);
      toast.success('Blog category saved.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveBlogCategoryInput) => blogService.updateCategory(input),
    onSuccess: (category, input) => {
      const syncedCategory = {
        ...category,
        name: input.name ?? category.name,
        slug: input.slug ?? category.slug,
        sortOrder: input.sortOrder ?? category.sortOrder,
        isActive: toBooleanActive(input.isActive, category.isActive),
      };

      console.log('[Blog Categories] update mutation success:', {
        input,
        category,
        syncedCategory,
      });

      syncCategoryCaches(queryClient, syncedCategory);
      queryClient.invalidateQueries({ queryKey: blogKeys.postsRoot() });
      toast.success('Blog category updated.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteCategory(id),
    onSuccess: (_data, categoryId) => {
      console.log('[Blog Categories] delete mutation success:', { categoryId });
      queryClient.setQueryData<BlogCategory[]>(blogKeys.adminCategories(), (categories) =>
        removeCategory(categories, categoryId),
      );
      queryClient.setQueryData<BlogCategory[]>(blogKeys.categories(), (categories) =>
        removeCategory(categories, categoryId),
      );
      queryClient.invalidateQueries({ queryKey: blogKeys.postsRoot() });
      toast.success('Blog category deleted.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useReorderBlogCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: ReorderBlogCategoryInput[]) => blogService.reorderCategories(categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Blog categories reordered.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveBlogPostInput) => blogService.updatePost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Blog post updated.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Blog post deleted.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

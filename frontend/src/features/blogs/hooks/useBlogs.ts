import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { toast } from '@/shared/components/ui/Toast';
import { blogService } from '../services/blog.service';
import type { GetBlogPostsInput, SaveBlogPostInput } from '../services/blog.service';

export const blogKeys = {
  all: ['blogs'] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  posts: (input: GetBlogPostsInput = {}) => [...blogKeys.all, 'posts', input] as const,
  detail: (idOrSlug: string, admin?: boolean) =>
    [...blogKeys.all, 'detail', idOrSlug, admin ? 'admin' : 'public'] as const,
};

export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: () => blogService.getCategories(),
    staleTime: 1000 * 60 * 10,
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

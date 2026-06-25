import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, Clock3, FileText, LoaderCircle, Plus } from 'lucide-react';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { toast } from '@/shared/components/ui/Toast';
import EmptyState from '@/shared/components/ui/EmptyState';
import {
  eventFormFieldControlClassName,
  eventFormFieldLabelClassName,
  eventFormInputTextClassName,
  eventFormSelectClassName,
  eventFormSelectControlClassName,
  eventFormTextareaClassName,
  eventFormUploadDropzoneClassName,
} from '@/features/events/constants/eventFormStyles';
import {
  useBlogCategories,
  useBlogPostDetail,
  useBlogPosts,
  useCreateBlogPost,
  useDeleteBlogPost,
  useUpdateBlogPost,
} from '@/features/blogs/hooks/useBlogs';
import type {
  BlogCategory,
  BlogPostDetail,
  BlogPostStatus,
  BlogSection,
} from '@/features/blogs/types/blog.types';
import type { BlogPanelMode, PagesContentTab } from './types';

const FALLBACK_BLOG_IMAGE = '/news-1.png';

type BlogFormState = {
  title: string;
  categoryId: string;
  excerpt: string;
  imageFiles: File[];
  imagePreviews: string[];
  sections: BlogSection[];
};

const emptySection: BlogSection = {
  heading: '',
  body: '',
  sortOrder: 0,
};

const emptyFormState: BlogFormState = {
  title: '',
  categoryId: '',
  excerpt: '',
  imageFiles: [],
  imagePreviews: [],
  sections: [emptySection],
};

function formatBlogDate(value?: string | null) {
  if (!value) return 'Not published';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatReadTime(minutes?: number | null) {
  const resolvedMinutes = minutes && minutes > 0 ? minutes : 1;
  return `${resolvedMinutes} min${resolvedMinutes === 1 ? '' : 's'} read`;
}

function createStateFromPost(post?: BlogPostDetail | null): BlogFormState {
  if (!post) return emptyFormState;
  console.log('createStateFromPost', post);
  return {
    title: post.title,
    categoryId: post.categoryId,
    excerpt: post.excerpt,
    imageFiles: [],
    imagePreviews: post.galleryImages.length
      ? post.galleryImages.map((image) => image.imageUrl)
      : post.coverImageUrl
        ? [post.coverImageUrl]
        : [],
    sections: post.sections.length
      ? post.sections.map((section, index) => ({ ...section, sortOrder: index }))
      : [emptySection],
  };
}

function normalizeSections(sections: BlogSection[]) {
  return sections.map((section, index) => ({
    ...section,
    heading: section.heading.trim(),
    body: section.body.trim(),
    sortOrder: index,
  }));
}

function validateBlogForm(formState: BlogFormState) {
  const sections = normalizeSections(formState.sections);

  if (!formState.title.trim()) return 'Please enter a blog title.';
  if (!formState.categoryId) return 'Please select a category.';
  if (!formState.excerpt.trim()) return 'Please enter a short summary.';
  if (sections.length === 0) return 'Please add at least one content section.';
  if (sections.some((section) => !section.heading || !section.body)) {
    return 'Please fill every section heading and body before saving.';
  }

  return null;
}

function BlogPostCard({
  post,
  onEdit,
  onDelete,
  isDeleting,
}: {
  post: BlogPostDetail;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const isPublished = post.status === 'published';

  return (
    <article className="group/card flex min-w-0 flex-col overflow-hidden rounded-[1.45rem] bg-white shadow-[0_1rem_2.2rem_rgba(7,17,22,0.08)]">
      <div className="relative aspect-[448/292] w-full overflow-hidden rounded-[1.35rem] bg-[#d9dde2]">
        <img
          src={post.coverImageUrl || FALLBACK_BLOG_IMAGE}
          alt=""
          className="block h-full w-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.02]"
          loading="lazy"
        />
        <span className="absolute left-[1.35rem] top-[1.45rem] max-w-[calc(100%-2.7rem)] truncate rounded-[12px] bg-cms-tab-active/40 px-2 py-[0.43rem] text-[14px] font-semibold leading-[1.15] text-white">
          {post.categoryName || 'Uncategorized'}
        </span>
        <span
          className={[
            'absolute bottom-[1.35rem] left-[1.35rem] rounded-[0.85rem] px-3 py-1.5 text-[clamp(0.88rem,0.95vw,1.12rem)] font-extrabold leading-none text-white',
            isPublished ? 'bg-success-600' : 'bg-gray-600',
          ].join(' ')}
        >
          {isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-[1.2rem] sm:pb-[1.2rem]">
        <div className="flex min-w-0 items-center gap-2 text-[clamp(0.9rem,0.9vw,1.05rem)] font-medium leading-none text-[#4B5563]">
          <Clock3 className="h-[1.05rem] w-[1.05rem] shrink-0" />
          <span className="truncate">{formatBlogDate(post.publishedAt || post.createdAt)}</span>
          <span aria-hidden="true">|</span>
          <span className="shrink-0">{formatReadTime(post.readTimeMinutes)}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-[clamp(1.08rem,1.1vw,1.3rem)] font-extrabold leading-tight text-[#071116]">
          {post.title}
        </h3>

        <p className="mt-3 overflow-hidden text-[clamp(0.92rem,0.92vw,1.08rem)] font-medium leading-[1.18] tracking-[0.01em] text-[#4B5563] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-8 max-sm:flex-col max-sm:items-stretch">
          <button
            type="button"
            onClick={onEdit}
            disabled={isDeleting}
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-[48px] bg-cms-tab-active px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:w-[134px]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-[48px] border-2 border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:w-[134px]"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}

function BlogPostForm({
  mode,
  post,
  categories,
  isLoadingPost,
  onBack,
}: {
  mode: Extract<BlogPanelMode, 'create' | 'edit'>;
  post?: BlogPostDetail;
  categories: BlogCategory[];
  isLoadingPost: boolean;
  onBack: () => void;
}) {
  const [formState, setFormState] = useState<BlogFormState>(emptyFormState);
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const isSubmitting = createPost.isPending || updatePost.isPending;
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  useEffect(() => {
    setFormState(createStateFromPost(mode === 'edit' ? post : null));
  }, [mode, post]);

  const updateSection = (index: number, values: Partial<BlogSection>) => {
    setFormState((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, ...values } : section,
      ),
    }));
  };

  const addSection = () => {
    setFormState((current) => ({
      ...current,
      sections: [...current.sections, { ...emptySection, sortOrder: current.sections.length }],
    }));
  };

  const removeSection = (index: number) => {
    setFormState((current) => ({
      ...current,
      sections:
        current.sections.length === 1
          ? current.sections
          : current.sections.filter((_, sectionIndex) => sectionIndex !== index),
    }));
  };

  const handleImagesChange = (files: File[], previews: string[]) => {
    setFormState((current) => ({
      ...current,
      imageFiles: files.length > 0 ? files : current.imageFiles,
      imagePreviews: previews,
    }));
  };

  const submitPost = async (status: BlogPostStatus) => {
    const validationMessage = validateBlogForm(formState);

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const payload = {
      ...(mode === 'edit' && post ? { id: post.id } : {}),
      title: formState.title.trim(),
      categoryId: formState.categoryId,
      excerpt: formState.excerpt.trim(),
      status,
      sections: normalizeSections(formState.sections),
      images: formState.imageFiles,
    };
    console.log('Blog form submit payload:', {
      ...payload,
      images: payload.images.map((image) => ({
        name: image.name,
        type: image.type,
        size: image.size,
      })),
    });

    if (mode === 'edit') {
      await updatePost.mutateAsync(payload);
    } else {
      await createPost.mutateAsync(payload);
    }

    onBack();
  };

  if (isLoadingPost) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center text-[#858585]">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        Loading blog post...
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-cms-tab-active transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 p-0"
        aria-label="Back to blog posts"
      >
        <ArrowLeft className="h-9 w-9 p-0" />
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold leading-tight text-[#071116]">
          {mode === 'edit' ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
      </div>

      <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#071116]">Basic Information</h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              id="blog-title"
              label="Blog Title"
              placeholder="Enter the title of the post"
              value={formState.title}
              onChange={(event) =>
                setFormState((current) => ({ ...current, title: event.target.value }))
              }
              labelClassName={eventFormFieldLabelClassName}
              controlClassName={eventFormFieldControlClassName}
              inputClassName={eventFormInputTextClassName}
            />

            <SelectInput
              id="blog-category"
              name="blog-category"
              label="Category"
              options={categoryOptions}
              placeholder="Select the category of the post"
              value={formState.categoryId}
              onChange={(event) =>
                setFormState((current) => ({ ...current, categoryId: event.target.value }))
              }
              labelClassName={eventFormFieldLabelClassName}
              className={eventFormSelectClassName}
              controlClassName={eventFormSelectControlClassName}
              sortOptionsAlphabetically={false}
            />
          </div>

          <TextareaInput
            id="blog-summary"
            label="Short Summary / Excerpt"
            placeholder="Enter a short summary of the post"
            rows={4}
            showCounter={false}
            value={formState.excerpt}
            onChange={(event) =>
              setFormState((current) => ({ ...current, excerpt: event.target.value }))
            }
            labelClassName={eventFormFieldLabelClassName}
            textareaClassName={`${eventFormTextareaClassName} !min-h-[8.5rem]`}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#071116]">Content</h3>

          <ImageUpload
            label="Image Gallery"
            previews={formState.imagePreviews}
            onChange={handleImagesChange}
            hint="Supported formats: PNG, JPG, JPEG or WEBP up to 2mb each"
            maxSizeMB={2}
            labelClassName={eventFormFieldLabelClassName}
            dropzoneClassName={`${eventFormUploadDropzoneClassName} !py-8`}
            idleIcon="mdi:cloud-upload-outline"
            activeIcon="mdi:cloud-upload-outline"
          />

          {formState.sections.map((section, index) => (
            <div key={index} className="space-y-4 rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-[#071116]">Section {index + 1}</h4>
                {formState.sections.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <FormInput
                id={`blog-header-${index}`}
                label={`Header ${index + 1}`}
                placeholder="Enter the header"
                value={section.heading}
                onChange={(event) => updateSection(index, { heading: event.target.value })}
                className="max-w-2xl"
                labelClassName={eventFormFieldLabelClassName}
                controlClassName={eventFormFieldControlClassName}
                inputClassName={eventFormInputTextClassName}
              />

              <TextareaInput
                id={`blog-body-${index}`}
                label={`Body ${index + 1}`}
                placeholder="Enter the content of the body"
                rows={5}
                showCounter={false}
                value={section.body}
                onChange={(event) => updateSection(index, { body: event.target.value })}
                labelClassName={eventFormFieldLabelClassName}
                textareaClassName={`${eventFormTextareaClassName} !min-h-[8.5rem]`}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-1.5 rounded-full border border-cms-tab-active px-3 py-1 text-xs font-semibold text-cms-tab-active transition-colors hover:bg-primary-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add new header and body
          </button>
        </section>

        <div className="flex flex-wrap items-center gap-3 pt-16">
          <button
            type="button"
            onClick={() => void submitPost('draft')}
            disabled={isSubmitting}
            className="rounded-full border border-cms-tab-active px-5 py-2 text-sm font-semibold text-cms-tab-active transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => void submitPost('published')}
            disabled={isSubmitting}
            className="rounded-full bg-cms-tab-active px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function BlogContentPanel({ activeTab }: { activeTab: PagesContentTab }) {
  const [mode, setMode] = useState<BlogPanelMode>('list');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | 'all'>('all');
  const { data: categories = [] } = useBlogCategories();
  // const categories: BlogCategory[] = [
  //   { id: '1', name: 'News', slug: 'news', sortOrder: 1, isActive: true },
  //   { id: '2', name: 'Updates', slug: 'updates', sortOrder: 2, isActive: true },
  //   { id: '3', name: 'Events', slug: 'events', sortOrder: 3, isActive: true },
  // ];
  const {
    data: postsResult,
    isLoading,
    isError,
  } = useBlogPosts({
    status: statusFilter,
    admin: true,
    limit: 100,
  });
  const { data: selectedPost, isLoading: isLoadingSelectedPost } = useBlogPostDetail(
    selectedPostId ?? undefined,
    { admin: true },
  );
  const deletePost = useDeleteBlogPost();
  const posts = useMemo(() => postsResult?.posts ?? [], [postsResult?.posts]);

  const detailedPosts = posts.map((post) => ({
    ...post,
    sections: [],
    galleryImages: [],
  }));

  const closeForm = () => {
    setSelectedPostId(null);
    setMode('list');
  };

  const handleDelete = async (postId: string) => {
    await deletePost.mutateAsync(postId);
  };

  return (
    <div
      className={[
        'animate-slide-up rounded-[1.75rem] bg-white px-5 py-9 shadow-sm sm:px-6 lg:min-h-[1038px]',
        activeTab === 'home' ? 'rounded-tl-none' : '',
      ].join(' ')}
    >
      {mode === 'create' || mode === 'edit' ? (
        <BlogPostForm
          mode={mode}
          post={selectedPost}
          categories={categories}
          isLoadingPost={mode === 'edit' && isLoadingSelectedPost}
          onBack={closeForm}
        />
      ) : (
        <>
          <div className="mb-12 flex items-center justify-between gap-4">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as BlogPostStatus | 'all')}
                className="appearance-none rounded-full bg-white px-4 py-2 pr-9 text-sm font-semibold text-[#858585] shadow-[0_0.5rem_1.2rem_rgba(7,17,22,0.05)] transition-colors hover:text-cms-tab-active focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
                aria-label="Filter blog posts"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858585]" />
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPostId(null);
                setMode('create');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-cms-tab-active px-6 py-2 text-[16px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
            >
              New Post
              <Plus className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[28rem] animate-pulse rounded-[1.45rem] bg-gray-100"
                />
              ))}
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              We could not load blog posts right now.
            </div>
          ) : null}

          {!isLoading && !isError && detailedPosts.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={statusFilter === 'all' ? 'No blog posts yet' : `No ${statusFilter} posts`}
              description={
                statusFilter === 'all'
                  ? 'Create your first blog post to start sharing stories and updates.'
                  : 'Try another filter or create a new blog post.'
              }
              actionLabel="Create Blog Post"
              onAction={() => {
                setSelectedPostId(null);
                setMode('create');
              }}
            />
          ) : null}

          {!isLoading && !isError && detailedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {detailedPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onEdit={() => {
                    setSelectedPostId(post.id);
                    setMode('edit');
                  }}
                  onDelete={() => void handleDelete(post.id)}
                  isDeleting={deletePost.isPending}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

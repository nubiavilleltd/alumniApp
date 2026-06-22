import { useState } from 'react';
import { ArrowLeft, ChevronDown, Clock3, Plus } from 'lucide-react';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import {
  eventFormFieldControlClassName,
  eventFormFieldLabelClassName,
  eventFormInputTextClassName,
  eventFormSelectClassName,
  eventFormSelectControlClassName,
  eventFormTextareaClassName,
  eventFormUploadDropzoneClassName,
} from '@/features/events/constants/eventFormStyles';
import type { BlogPanelMode, BlogPost, PagesContentTab } from './types';

const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    category: 'Alumnae Stories',
    status: 'published',
    image: '/news-1.png',
    publishedAt: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Felis dignissim cras nunc viverra ullamcorper amet dui. Etiam est consequat viverra odio nibh pellentesque nascetur vestibulum. Sit orci pretium...',
  },
  {
    id: 'blog-2',
    category: 'Alumnae Stories',
    status: 'draft',
    image: '/news-1.png',
    publishedAt: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Felis dignissim cras nunc viverra ullamcorper amet dui. Etiam est consequat viverra odio nibh pellentesque nascetur vestibulum. Sit orci pretium...',
  },
  {
    id: 'blog-3',
    category: 'Alumnae Stories',
    status: 'published',
    image: '/news-1.png',
    publishedAt: '11:26 AM Nov 2, 2025',
    readTime: '20 mins read',
    title: 'Habitant Tortor Ultrices Morbi',
    excerpt:
      'Felis dignissim cras nunc viverra ullamcorper amet dui. Etiam est consequat viverra odio nibh pellentesque nascetur vestibulum. Sit orci pretium...',
  },
];

const blogCategoryOptions = [
  { label: 'Alumnae Stories', value: 'alumnae-stories' },
  { label: 'School News', value: 'school-news' },
  { label: 'Community', value: 'community' },
  { label: 'Events', value: 'events' },
];

function BlogPostCard({ post }: { post: BlogPost }) {
  const isPublished = post.status === 'published';

  return (
    <article className="group/card flex min-w-0 flex-col overflow-hidden rounded-[1.45rem] bg-white shadow-[0_1rem_2.2rem_rgba(7,17,22,0.08)]">
      <div className="relative aspect-[448/292] w-full overflow-hidden rounded-[1.35rem] bg-[#d9dde2]">
        <img
          src={post.image}
          alt=""
          className="block h-full w-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.02]"
          loading="lazy"
        />
        <span className="absolute left-[1.35rem] top-[1.45rem] max-w-[calc(100%-2.7rem)] truncate rounded-[12px] bg-cms-tab-active/40 px-2 py-[0.43rem] text-[14px] font-semibold leading-[1.15] text-white">
          {post.category}
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
          <span className="truncate">{post.publishedAt}</span>
          <span aria-hidden="true">|</span>
          <span className="shrink-0">{post.readTime}</span>
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
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-[48px] bg-cms-tab-active px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 sm:h-10 sm:w-[134px]"
          >
            Edit
          </button>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-[48px] border-2 border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 sm:h-10 sm:w-[134px]"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function BlogPostForm({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImagesChange = (_files: File[], previews: string[]) => {
    setImagePreviews(previews);
  };

  return (
    <div className="animate-slide-up">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex h-9 w-9 items-center justify-center rounded-full text-cms-tab-active transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
        aria-label="Back to blog posts"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold leading-tight text-[#071116]">Create New Blog Post</h2>
      </div>

      <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#071116]">Basic Information</h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              id="blog-title"
              label="Blog Title"
              placeholder="Enter the title of the post"
              labelClassName={eventFormFieldLabelClassName}
              controlClassName={eventFormFieldControlClassName}
              inputClassName={eventFormInputTextClassName}
            />

            <SelectInput
              id="blog-category"
              name="blog-category"
              label="Category"
              options={blogCategoryOptions}
              placeholder="Select the category of the post"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
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
            labelClassName={eventFormFieldLabelClassName}
            textareaClassName={`${eventFormTextareaClassName} !min-h-[8.5rem]`}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#071116]">Content</h3>

          <ImageUpload
            label="Image Gallery"
            previews={imagePreviews}
            onChange={handleImagesChange}
            hint="Supported formats: PNG, JPG, JPEG or WEBP up to 2mb each"
            maxSizeMB={2}
            labelClassName={eventFormFieldLabelClassName}
            dropzoneClassName={`${eventFormUploadDropzoneClassName} !py-8`}
            idleIcon="mdi:cloud-upload-outline"
            activeIcon="mdi:cloud-upload-outline"
          />

          <FormInput
            id="blog-header-1"
            label="Header 1"
            placeholder="Enter the header"
            className="max-w-2xl"
            labelClassName={eventFormFieldLabelClassName}
            controlClassName={eventFormFieldControlClassName}
            inputClassName={eventFormInputTextClassName}
          />

          <TextareaInput
            id="blog-body-1"
            label="Body 1"
            placeholder="Enter the content of the body"
            rows={5}
            showCounter={false}
            labelClassName={eventFormFieldLabelClassName}
            textareaClassName={`${eventFormTextareaClassName} !min-h-[8.5rem]`}
          />

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-cms-tab-active px-3 py-1 text-xs font-semibold text-cms-tab-active transition-colors hover:bg-primary-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add new header and body
          </button>
        </section>

        <div className="flex flex-wrap items-center gap-3 pt-16">
          <button
            type="button"
            className="rounded-full border border-cms-tab-active px-5 py-2 text-sm font-semibold text-cms-tab-active transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="rounded-full bg-cms-tab-active px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
}

export function BlogContentPanel({ activeTab }: { activeTab: PagesContentTab }) {
  const [mode, setMode] = useState<BlogPanelMode>('list');

  return (
    <div
      className={[
        'animate-slide-up rounded-[1.75rem] bg-white px-5 py-9 shadow-sm sm:px-6 lg:min-h-[1038px] lg:px-10',
        activeTab === 'home' ? 'rounded-tl-none' : '',
      ].join(' ')}
    >
      {mode === 'create' ? (
        <BlogPostForm onBack={() => setMode('list')} />
      ) : (
        <>
          <div className="mb-12 flex items-center justify-between gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#858585] shadow-[0_0.5rem_1.2rem_rgba(7,17,22,0.05)] transition-colors hover:text-cms-tab-active"
            >
              All
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setMode('create')}
              className="inline-flex items-center gap-1.5 rounded-full bg-cms-tab-active px-6 py-2 text-[16px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
            >
              New Post
            <Plus className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

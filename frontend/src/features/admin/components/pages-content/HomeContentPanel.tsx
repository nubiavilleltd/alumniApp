import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { BaseInput } from '@/shared/components/ui/input/BaseInput';
import { DeleteConfirmModal } from '@/features/events/components/DeleteConfirmModal';
import { DragHandle } from './DragHandle';
import type { HomepageImage, PagesContentTab } from './types';

const initialHomepageImages: HomepageImage[] = [
  { id: 'carousel-1', src: '/alumni-hero-img1.jpg', isHidden: false, sortOrder: 1 },
  { id: 'carousel-2', src: '/alumni-hero-img4.jpg', isHidden: false, sortOrder: 2 },
  { id: 'carousel-3', src: '/alumni-hero-img5.jpg', isHidden: false, sortOrder: 3 },
];

const HOMEPAGE_CONTENT_STORAGE_KEY = 'admin_pages_content_homepage_draft';

type HomepageContentDraft = {
  carouselImages: HomepageImage[];
  greetingTitle: string;
  greetingMessage: string;
};

type ImageUploadIntent = { type: 'add' } | { type: 'replace'; imageId: string };

function normalizeCarouselOrder(images: HomepageImage[]) {
  return images.map((image, index) => ({
    ...image,
    sortOrder: index + 1,
  }));
}

function buildHomepageContentPayload(draft: HomepageContentDraft) {
  return {
    function_type: 'update',
    content_type: 'homepage',
    greeting_title: draft.greetingTitle,
    greeting_message: draft.greetingMessage,
    carousel_images: normalizeCarouselOrder(draft.carouselImages).map((image) => ({
      id: image.id,
      image_url: image.src,
      file_name: image.fileName ?? null,
      sort_order: image.sortOrder,
      is_hidden: image.isHidden ? '1' : '0',
    })),
  };
}

function readStoredHomepageContent(): HomepageContentDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const rawValue = window.localStorage.getItem(HOMEPAGE_CONTENT_STORAGE_KEY);
    if (!rawValue) return null;

    const parsedValue = JSON.parse(rawValue) as Partial<HomepageContentDraft>;
    if (!Array.isArray(parsedValue.carouselImages)) return null;

    return {
      carouselImages: normalizeCarouselOrder(
        parsedValue.carouselImages
          .filter((image): image is HomepageImage => Boolean(image?.id && image?.src))
          .map((image, index) => ({
            ...image,
            isHidden: Boolean(image.isHidden),
            sortOrder: Number(image.sortOrder) || index + 1,
          })),
      ),
      greetingTitle: parsedValue.greetingTitle ?? '',
      greetingMessage: parsedValue.greetingMessage ?? '',
    };
  } catch {
    return null;
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read selected image.'));
    reader.readAsDataURL(file);
  });
}

function createLocalCarouselImage(file: File, src: string, sortOrder: number): HomepageImage {
  return {
    id: `carousel-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    src,
    fileName: file.name,
    isHidden: false,
    sortOrder,
  };
}

function ImageCardActions({
  isHidden,
  onDelete,
  onEdit,
  onToggleHidden,
}: {
  isHidden: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onToggleHidden: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-5 border-t border-gray-200 pt-4 text-gray-500 lg:absolute lg:left-[411px] lg:top-[448px] lg:h-6 lg:w-[173px] lg:gap-6 lg:border-t-0 lg:pt-0">
      <button
        type="button"
        onClick={onToggleHidden}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-cms-tab-active"
        aria-pressed={isHidden}
      >
        <span
          className={[
            'relative h-6 w-10 rounded-full transition-colors',
            isHidden ? 'bg-cms-tab-active/70' : 'bg-[#BDBDBD]',
          ].join(' ')}
        >
          <span
            className={[
              'absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-transform',
              isHidden ? 'left-[14px]' : '-left-1',
            ].join(' ')}
          />
        </span>
        Hide
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="text-gray-500 transition-colors hover:text-cms-tab-active"
        aria-label="Edit carousel image"
      >
        <Pencil className="h-[22px] w-[22px]" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-gray-500 transition-colors hover:text-red-500"
        aria-label="Delete carousel image"
      >
        <Trash2 className="h-[22px] w-[22px]" />
      </button>
    </div>
  );
}

export function HomeContentPanel({ activeTab }: { activeTab: PagesContentTab }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orderedImages, setOrderedImages] = useState<HomepageImage[]>(initialHomepageImages);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dropTargetImageId, setDropTargetImageId] = useState<string | null>(null);
  const [imageUploadIntent, setImageUploadIntent] = useState<ImageUploadIntent | null>(null);
  const [greetingTitle, setGreetingTitle] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [pendingDeleteImage, setPendingDeleteImage] = useState<HomepageImage | null>(null);

  useEffect(() => {
    const storedDraft = readStoredHomepageContent();
    if (!storedDraft) return;

    setOrderedImages(
      storedDraft.carouselImages.length ? storedDraft.carouselImages : initialHomepageImages,
    );
    setGreetingTitle(storedDraft.greetingTitle);
    setGreetingMessage(storedDraft.greetingMessage);
  }, []);

  const moveImage = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    setOrderedImages((currentImages) => {
      const fromIndex = currentImages.findIndex((image) => image.id === fromId);
      const toIndex = currentImages.findIndex((image) => image.id === toId);

      if (fromIndex < 0 || toIndex < 0) return currentImages;

      const nextImages = [...currentImages];
      const [movedImage] = nextImages.splice(fromIndex, 1);
      nextImages.splice(toIndex, 0, movedImage);
      return normalizeCarouselOrder(nextImages);
    });
  };

  const openImagePicker = (intent: ImageUploadIntent) => {
    setImageUploadIntent(intent);
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !imageUploadIntent) return;

    const src = await fileToDataUrl(file);

    if (imageUploadIntent.type === 'add') {
      setOrderedImages((currentImages) =>
        normalizeCarouselOrder([
          ...currentImages,
          createLocalCarouselImage(file, src, currentImages.length + 1),
        ]),
      );
    } else {
      setOrderedImages((currentImages) =>
        normalizeCarouselOrder(
          currentImages.map((image) =>
            image.id === imageUploadIntent.imageId
              ? {
                  ...image,
                  src,
                  fileName: file.name,
                }
              : image,
          ),
        ),
      );
    }

    setImageUploadIntent(null);
    setSaveStatus('');
  };

  const deleteImage = (imageId: string) => {
    setOrderedImages((currentImages) =>
      normalizeCarouselOrder(currentImages.filter((image) => image.id !== imageId)),
    );
    setPendingDeleteImage(null);
    setSaveStatus('');
  };

  const toggleImageHidden = (imageId: string) => {
    setOrderedImages((currentImages) =>
      currentImages.map((image) =>
        image.id === imageId ? { ...image, isHidden: !image.isHidden } : image,
      ),
    );
    setSaveStatus('');
  };

  const saveHomepageContent = () => {
    const draft: HomepageContentDraft = {
      carouselImages: normalizeCarouselOrder(orderedImages),
      greetingTitle,
      greetingMessage,
    };

    window.localStorage.setItem(HOMEPAGE_CONTENT_STORAGE_KEY, JSON.stringify(draft));
    console.log('Mock homepage content payload', buildHomepageContentPayload(draft));
    setOrderedImages(draft.carouselImages);
    setSaveStatus('Homepage content saved locally.');
  };

  return (
    <>
      <div
        className={[
          'animate-slide-up space-y-10 rounded-[1.75rem] bg-white px-5 py-7 shadow-sm sm:px-6 lg:min-h-[1038px] lg:px-6',
          activeTab === 'home' ? 'rounded-tl-none' : '',
        ].join(' ')}
      >
        <section>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[20px] font-medium leading-none tracking-[0.03em] text-cms-tab-inactive">
              Upload and organise the carousel images displayed on the homepage.
            </p>

            <button
              type="button"
              onClick={() => openImagePicker({ type: 'add' })}
              className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-primary-500 px-4 py-[5px] text-base font-semibold text-primary-500 transition-all duration-200 hover:bg-primary-50"
            >
              <Plus className="h-5 w-5" />
              Add new image
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleImageFileChange}
          />

          <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto scroll-smooth pb-3 [-webkit-overflow-scrolling:touch]">
            {orderedImages.map((image, index) => {
              const isDragging = draggedImageId === image.id;
              const isDropTarget = dropTargetImageId === image.id && draggedImageId !== image.id;

              return (
                <article
                  key={image.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', image.id);
                    setDraggedImageId(image.id);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    setDropTargetImageId(image.id);
                  }}
                  onDragLeave={() => {
                    setDropTargetImageId((currentId) =>
                      currentId === image.id ? null : currentId,
                    );
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const sourceImageId =
                      event.dataTransfer.getData('text/plain') || draggedImageId;
                    if (sourceImageId) moveImage(sourceImageId, image.id);
                    setDraggedImageId(null);
                    setDropTargetImageId(null);
                  }}
                  onDragEnd={() => {
                    setDraggedImageId(null);
                    setDropTargetImageId(null);
                  }}
                  className={[
                    'relative flex min-h-[24rem] w-full shrink-0 snap-start flex-col rounded-xl border border-cms-tab-active/25 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:max-w-[38rem] lg:h-[488px] lg:w-[608px] lg:max-w-none lg:p-0',
                    isDragging ? 'scale-[0.98] opacity-60' : '',
                    isDropTarget
                      ? 'border-cms-tab-active shadow-lg ring-2 ring-cms-tab-active/20'
                      : '',
                  ].join(' ')}
                >
                  <div className="mx-auto lg:absolute lg:left-1/2 lg:top-2.5 lg:-translate-x-1/2">
                    <DragHandle />
                  </div>
                  <p className="mt-6 text-xl font-medium leading-none text-gray-950 lg:absolute lg:left-6 lg:top-[43px] lg:mt-0">
                    {index + 1}
                  </p>
                  <img
                    src={image.src}
                    alt=""
                    className={[
                      'mt-8 aspect-[7/4] w-full rounded-[6px] object-cover transition-opacity lg:absolute lg:left-6 lg:top-[88px] lg:mt-0 lg:h-[320px] lg:w-[560px]',
                      image.isHidden ? 'opacity-45 grayscale' : '',
                    ].join(' ')}
                  />
                  <ImageCardActions
                    isHidden={image.isHidden}
                    onDelete={() => setPendingDeleteImage(image)}
                    onEdit={() => openImagePicker({ type: 'replace', imageId: image.id })}
                    onToggleHidden={() => toggleImageHidden(image.id)}
                  />
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-7">
          <p className="text-[20px] font-medium leading-none tracking-[0.03em] text-cms-tab-inactive">
            Edit the greeting message displayed on the homepage.
          </p>

          <BaseInput
            id="greeting-title"
            label="Greeting Title"
            placeholder="Welcome home"
            value={greetingTitle}
            onValueChange={(value) => {
              setGreetingTitle(value);
              setSaveStatus('');
            }}
            className="max-w-3xl gap-3"
            labelClassName="!text-base !font-medium !leading-none !text-[#858585]"
            controlClassName="!min-h-12 !rounded-full !border-0 !bg-cms-surface !shadow-none focus-within:!border-transparent focus-within:!outline focus-within:!outline-3 focus-within:!outline-primary-500/20"
            inputClassName="!h-12 !px-4 !text-base !font-normal !text-gray-900 placeholder:!text-[#858585] placeholder:!opacity-100"
          />

          <TextareaInput
            id="greeting-message"
            label="Greeting Message"
            placeholder="Enter the greeting message"
            value={greetingMessage}
            onChange={(event) => {
              setGreetingMessage(event.target.value);
              setSaveStatus('');
            }}
            rows={4}
            showCounter={false}
            className="gap-3"
            labelClassName="!text-base !font-medium !leading-none !text-[#858585]"
            textareaClassName="!min-h-24 !resize-none !rounded-[1.5rem] !border-0 !bg-cms-surface !px-4 !py-4 !text-base !font-normal !leading-snug !text-gray-900 !shadow-none placeholder:!text-[#858585] placeholder:!opacity-100 focus:!border-transparent focus:!outline focus:!outline-3 focus:!outline-primary-500/20"
          />

          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={saveHomepageContent}
              className="rounded-full bg-primary-500 tracking-[3%] px-8 py-2 text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-600 hover:shadow-lg"
            >
              Update Homepage
            </button>
          </div>
          {saveStatus ? (
            <p className="text-center text-sm font-medium text-success-700">{saveStatus}</p>
          ) : null}
        </section>
      </div>

      {pendingDeleteImage ? (
        <DeleteConfirmModal
          title={`carousel image ${pendingDeleteImage.sortOrder}`}
          heading="Delete Homepage Image?"
          isDeleting={false}
          onConfirm={() => deleteImage(pendingDeleteImage.id)}
          onCancel={() => setPendingDeleteImage(null)}
          description={`Delete carousel image ${pendingDeleteImage.sortOrder}? This removes it from the homepage carousel draft. Use Hide instead if you only want to temporarily remove it from the public homepage.`}
        />
      ) : null}
    </>
  );
}

import { useEffect, useState, type DragEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { eventFormTextareaClassName } from '@/features/events/constants/eventFormStyles';
import {
  faqKeys,
  useAdminFaqs,
  useCreateFaq,
  useDeleteFaq,
  useReorderFaqs,
  useUpdateFaq,
} from '@/features/faqs/hooks/useFaqs';
import {
  buildFaqAnswerWithLinks,
  parseFaqAnswerWithLinks,
  validateFaqLinkUrl,
  type FaqLink,
} from '@/features/faqs/utils/faqLinks';
import { toast } from '@/shared/components/ui/Toast';
import { DragHandle } from './DragHandle';
import type { DropPosition, FaqItem, PagesContentTab } from './types';

type AdminFaqLink = FaqLink & {
  id: string;
};

type AdminFaqItem = FaqItem & {
  isNew?: boolean;
  links: AdminFaqLink[];
};

const initialFaqs: AdminFaqItem[] = [
  {
    id: 'faq-1',
    question: '',
    answer: '',
    links: [],
    isPublished: true,
    isNew: true,
  },
];

function createFaqId() {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createFaqLinkId() {
  return `faq-link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isLocalFaqId(faqId: string) {
  return faqId.startsWith('faq-');
}

function createEmptyFaq(): AdminFaqItem {
  return {
    id: createFaqId(),
    question: '',
    answer: '',
    links: [],
    isPublished: true,
    isNew: true,
  };
}

function toAdminFaqLinks(links: FaqLink[]): AdminFaqLink[] {
  return links.map((link) => ({
    ...link,
    id: createFaqLinkId(),
  }));
}

function reorderFaqs<T extends FaqItem>(
  faqs: T[],
  draggedFaqId: string,
  targetFaqId: string,
  position: DropPosition,
): T[] {
  if (draggedFaqId === targetFaqId) return faqs;

  const draggedFaq = faqs.find((faq) => faq.id === draggedFaqId);
  if (!draggedFaq) return faqs;

  const remainingFaqs = faqs.filter((faq) => faq.id !== draggedFaqId);
  const targetIndex = remainingFaqs.findIndex((faq) => faq.id === targetFaqId);
  if (targetIndex < 0) return faqs;

  const insertionIndex = position === 'before' ? targetIndex : targetIndex + 1;
  const nextFaqs = [...remainingFaqs];
  nextFaqs.splice(insertionIndex, 0, draggedFaq);
  return nextFaqs;
}

export function FaqContentPanel({ activeTab }: { activeTab: PagesContentTab }) {
  const queryClient = useQueryClient();
  const { data: backendFaqs = [], isLoading, isError, error } = useAdminFaqs();
  const createFaq = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const reorderFaqsMutation = useReorderFaqs();
  const deleteFaqMutation = useDeleteFaq();
  const [faqs, setFaqs] = useState<AdminFaqItem[]>(initialFaqs);
  const [activeFaqId, setActiveFaqId] = useState<string | null>(initialFaqs[0]?.id ?? null);
  const [draggedFaqId, setDraggedFaqId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    faqId: string;
    position: DropPosition;
  } | null>(null);
  const [deletedFaqIds, setDeletedFaqIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (backendFaqs.length === 0) {
      setFaqs(initialFaqs);
      setActiveFaqId(initialFaqs[0]?.id ?? null);
      setDeletedFaqIds([]);
      setSaveStatus('');
      return;
    }

    const nextFaqs = backendFaqs.map((faq) => {
      const parsedAnswer = parseFaqAnswerWithLinks(faq.answer);

      return {
        id: faq.id,
        question: faq.question,
        answer: parsedAnswer.answerText,
        links: toAdminFaqLinks(parsedAnswer.links),
        isPublished: faq.isPublished,
      };
    });

    setFaqs(nextFaqs);
    setActiveFaqId(null);
    setDeletedFaqIds([]);
    setSaveStatus('');
  }, [backendFaqs, isLoading]);

  const updateFaq = (faqId: string, updates: Partial<FaqItem>) => {
    setFaqs((currentFaqs) =>
      currentFaqs.map((faq) => (faq.id === faqId ? { ...faq, ...updates } : faq)),
    );
    setSaveStatus('');
  };

  const addFaqLink = (faqId: string) => {
    setFaqs((currentFaqs) =>
      currentFaqs.map((faq) =>
        faq.id === faqId
          ? {
              ...faq,
              links: [...faq.links, { id: createFaqLinkId(), label: '', url: '' }],
            }
          : faq,
      ),
    );
    setSaveStatus('');
  };

  const updateFaqLink = (faqId: string, linkId: string, updates: Partial<FaqLink>) => {
    setFaqs((currentFaqs) =>
      currentFaqs.map((faq) =>
        faq.id === faqId
          ? {
              ...faq,
              links: faq.links.map((link) =>
                link.id === linkId ? { ...link, ...updates } : link,
              ),
            }
          : faq,
      ),
    );
    setSaveStatus('');
  };

  const removeFaqLink = (faqId: string, linkId: string) => {
    setFaqs((currentFaqs) =>
      currentFaqs.map((faq) =>
        faq.id === faqId
          ? {
              ...faq,
              links: faq.links.filter((link) => link.id !== linkId),
            }
          : faq,
      ),
    );
    setSaveStatus('');
  };

  const canAddFaq = faqs.every((faq) => faq.question.trim() && faq.answer.trim());

  const addFaq = () => {
    if (faqs.length > 0 && !canAddFaq) return;

    const nextFaq = createEmptyFaq();

    setFaqs((currentFaqs) => [...currentFaqs, nextFaq]);
    setActiveFaqId(nextFaq.id);
    setDraggedFaqId(null);
    setDropIndicator(null);
  };

  const removeFaq = (faqId: string) => {
    setFaqs((currentFaqs) => {
      const removedFaq = currentFaqs.find((faq) => faq.id === faqId);
      if (!removedFaq) return currentFaqs;

      const canRemoveOnlyFaq =
        currentFaqs.length === 1 &&
        (removedFaq.isNew || isLocalFaqId(removedFaq.id)) &&
        !removedFaq.question.trim() &&
        !removedFaq.answer.trim();

      if (currentFaqs.length === 1 && !canRemoveOnlyFaq) {
        return currentFaqs;
      }

      if (removedFaq && !removedFaq.isNew && !isLocalFaqId(removedFaq.id)) {
        setDeletedFaqIds((currentIds) =>
          currentIds.includes(removedFaq.id) ? currentIds : [...currentIds, removedFaq.id],
        );
      }

      const nextFaqs = currentFaqs.filter((faq) => faq.id !== faqId);

      if (activeFaqId === faqId) {
        setActiveFaqId(nextFaqs[0]?.id ?? null);
      }

      return nextFaqs;
    });
    setSaveStatus('');
  };

  const getDropPosition = (
    event: DragEvent<HTMLDivElement>,
    faqId: string,
  ): DropPosition | null => {
    if (!draggedFaqId || draggedFaqId === faqId) return null;

    const bounds = event.currentTarget.getBoundingClientRect();
    const midpoint = bounds.top + bounds.height / 2;
    return event.clientY < midpoint ? 'before' : 'after';
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, faqId: string) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', faqId);
    setDraggedFaqId(faqId);
    setDropIndicator(null);
  };

  const handleDragEnd = () => {
    setDraggedFaqId(null);
    setDropIndicator(null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, faqId: string) => {
    const position = getDropPosition(event, faqId);
    if (!position) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropIndicator((current) => {
      if (current?.faqId === faqId && current.position === position) return current;
      return { faqId, position };
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, faqId: string) => {
    event.preventDefault();
    const position = getDropPosition(event, faqId);
    const sourceFaqId = event.dataTransfer.getData('text/plain') || draggedFaqId;

    if (sourceFaqId && position) {
      setFaqs((currentFaqs) => reorderFaqs(currentFaqs, sourceFaqId, faqId, position));
    }

    setDraggedFaqId(null);
    setDropIndicator(null);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>, faqId: string) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;

    setDropIndicator((current) => (current?.faqId === faqId ? null : current));
  };

  const isSaving =
    createFaq.isPending ||
    updateFaqMutation.isPending ||
    reorderFaqsMutation.isPending ||
    deleteFaqMutation.isPending;

  const saveFaqs = async () => {
    try {
      setSaveStatus('');
      const cleanFaqs = faqs
        .map((faq) => ({
          ...faq,
          question: faq.question.trim(),
          answer: faq.answer.trim(),
          links: faq.links
            .map((link) => ({
              ...link,
              label: link.label.trim(),
              url: link.url.trim(),
            }))
            .filter((link) => link.label || link.url),
        }))
        .filter((faq) => faq.question && faq.answer);

      if (cleanFaqs.length !== faqs.length) {
        toast.error('Please fill every FAQ question and answer before saving.');
        return;
      }

      if (cleanFaqs.length === 0 && deletedFaqIds.length === 0) {
        toast.info('Add an FAQ before saving.');
        return;
      }

      for (const [faqIndex, faq] of cleanFaqs.entries()) {
        for (const link of faq.links) {
          if (!link.label) {
            toast.error(`Add a label for FAQ ${faqIndex + 1} link.`);
            return;
          }

          const urlError = validateFaqLinkUrl(link.url);
          if (urlError) {
            toast.error(`FAQ ${faqIndex + 1}: ${urlError}`);
            return;
          }
        }
      }

      await Promise.all(deletedFaqIds.map((faqId) => deleteFaqMutation.mutateAsync(faqId)));

      const persistedFaqs = [];

      for (const [index, faq] of cleanFaqs.entries()) {
        if (faq.isNew || isLocalFaqId(faq.id)) {
          const createdFaq = await createFaq.mutateAsync({
            question: faq.question,
            answer: buildFaqAnswerWithLinks(faq.answer, faq.links),
            sortOrder: index,
            isPublished: faq.isPublished,
          });
          persistedFaqs.push({ id: createdFaq.id, sortOrder: index });
          continue;
        }

        await updateFaqMutation.mutateAsync({
          id: faq.id,
          question: faq.question,
          answer: buildFaqAnswerWithLinks(faq.answer, faq.links),
          sortOrder: index,
          isPublished: faq.isPublished,
        });
        persistedFaqs.push({ id: faq.id, sortOrder: index });
      }

      if (persistedFaqs.length > 0) {
        await reorderFaqsMutation.mutateAsync(persistedFaqs);
      }

      await queryClient.invalidateQueries({ queryKey: faqKeys.all });
      setDeletedFaqIds([]);
      setSaveStatus('FAQs updated successfully.');
      toast.success('FAQs updated successfully.');
    } catch (saveError) {
      console.error('FAQ update failed:', saveError);
      setSaveStatus('');
      toast.error('We could not update FAQs. Please try again.');
    }
  };

  return (
    <div
      className={[
        'animate-slide-up rounded-[1.75rem] bg-white px-5 py-9 shadow-sm sm:px-6 lg:min-h-[640px] lg:px-6',
        activeTab === 'home' ? 'rounded-tl-none' : '',
      ].join(' ')}
    >
      <div className="mb-8">
        <p className="text-[20px] font-medium leading-none tracking-[0.03em] text-cms-tab-inactive">
          Create, organize, and publish FAQs.
        </p>
        {isLoading ? (
          <p className="mt-3 text-sm font-medium text-gray-500">Loading FAQs...</p>
        ) : null}
        {isError ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            FAQs could not be loaded. You can still add FAQs and try saving.
            {error instanceof Error ? ` ${error.message}` : ''}
          </p>
        ) : null}
      </div>

      <div className="space-y-5">
        {faqs.map((faq, index) => {
          const isDragging = draggedFaqId === faq.id;
          const showDropBefore =
            dropIndicator?.faqId === faq.id && dropIndicator.position === 'before';
          const showDropAfter =
            dropIndicator?.faqId === faq.id && dropIndicator.position === 'after';
          const isEditing = activeFaqId === faq.id;
          const hasContent = faq.question.trim() || faq.answer.trim();
          const canDeleteFaq =
            faqs.length > 1 ||
            ((faq.isNew || isLocalFaqId(faq.id)) && !faq.question.trim() && !faq.answer.trim());

          return (
            <div
              key={faq.id}
              onDragOver={(event) => handleDragOver(event, faq.id)}
              onDragLeave={(event) => handleDragLeave(event, faq.id)}
              onDrop={(event) => handleDrop(event, faq.id)}
              className={[
                'relative transition-all',
                showDropBefore
                  ? 'before:absolute before:-top-3 before:left-5 before:right-5 before:h-1 before:rounded-full before:bg-cms-tab-active before:content-[""]'
                  : '',
                showDropAfter
                  ? 'after:absolute after:-bottom-3 after:left-5 after:right-5 after:h-1 after:rounded-full after:bg-cms-tab-active after:content-[""]'
                  : '',
              ].join(' ')}
            >
              <article
                className={[
                  'relative overflow-hidden rounded-xl border border-cms-tab-active/25 bg-white px-5 pt-3 transition-all sm:px-8',
                  isEditing ? 'min-h-[339px] pb-20 sm:pb-20' : 'min-h-[216px] pb-5',
                  isDragging ? 'scale-[0.99] opacity-60' : '',
                ].join(' ')}
              >
                {isEditing ? (
                  <div className="absolute inset-y-0 left-0 w-2 bg-cms-tab-active" />
                ) : null}

                <div className="mb-6 flex justify-center">
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => handleDragStart(event, faq.id)}
                    onDragEnd={handleDragEnd}
                    className="inline-flex cursor-grab items-center justify-center rounded-full p-1 transition-colors hover:bg-primary-50 active:cursor-grabbing"
                    aria-label={`Drag FAQ ${index + 1}`}
                  >
                    <DragHandle />
                  </button>
                </div>

                <h3 className="mb-8 text-xl font-semibold leading-none text-[#071116]">
                  FAQ {index + 1}
                </h3>

                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <TextareaInput
                        id={`faq-question-${faq.id}`}
                        label="Question"
                        value={faq.question}
                        onChange={(event) => updateFaq(faq.id, { question: event.target.value })}
                        placeholder="Enter the question"
                        rows={6}
                        showCounter={false}
                        labelClassName="!text-base !font-semibold !text-[#858585]"
                        textareaClassName={`${eventFormTextareaClassName} !min-h-[8.5rem] !rounded-lg !px-4 !py-4 !text-base lg:!h-[136px]`}
                      />

                      <TextareaInput
                        id={`faq-answer-${faq.id}`}
                        label="Answer"
                        value={faq.answer}
                        onChange={(event) => updateFaq(faq.id, { answer: event.target.value })}
                        placeholder="Enter the answer"
                        rows={6}
                        showCounter={false}
                        labelClassName="!text-base !font-semibold !text-[#858585]"
                        textareaClassName={`${eventFormTextareaClassName} !min-h-[8.5rem] !rounded-lg !px-4 !py-4 !text-base lg:!h-[136px]`}
                      />
                    </div>
                    <div className="mt-6 rounded-2xl bg-cms-surface px-4 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-[#071116]">Links</h4>
                          <p className="mt-1 text-xs font-medium text-[#858585]">
                            Add optional buttons that appear below this answer.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addFaqLink(faq.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-cms-tab-active shadow-sm transition-colors hover:bg-primary-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add link
                        </button>
                      </div>

                      {faq.links.length > 0 ? (
                        <div className="mt-4 space-y-3">
                          {faq.links.map((link) => (
                            <div
                              key={link.id}
                              className="grid gap-3 rounded-xl bg-white p-3 shadow-sm lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_2.5rem]"
                            >
                              <label className="space-y-1">
                                <span className="text-xs font-semibold text-[#858585]">
                                  Link label
                                </span>
                                <input
                                  type="text"
                                  value={link.label}
                                  onChange={(event) =>
                                    updateFaqLink(faq.id, link.id, { label: event.target.value })
                                  }
                                  placeholder="Membership form"
                                  className="h-10 w-full rounded-lg border border-transparent bg-cms-surface px-3 text-sm font-medium text-gray-900 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                />
                              </label>
                              <label className="space-y-1">
                                <span className="text-xs font-semibold text-[#858585]">URL</span>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(event) =>
                                    updateFaqLink(faq.id, link.id, { url: event.target.value })
                                  }
                                  placeholder="/contact or https://example.com"
                                  className="h-10 w-full rounded-lg border border-transparent bg-cms-surface px-3 text-sm font-medium text-gray-900 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => removeFaqLink(faq.id, link.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 lg:self-end"
                                aria-label="Remove FAQ link"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-medium text-[#858585]">
                          <Link2 className="h-4 w-4 text-cms-tab-active" />
                          No links added.
                        </div>
                      )}
                    </div>
                    <label className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-[#858585]">
                      <input
                        type="checkbox"
                        checked={faq.isPublished}
                        onChange={(event) =>
                          updateFaq(faq.id, { isPublished: event.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      Published
                    </label>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveFaqId(faq.id)}
                    className="block w-full pb-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-100"
                  >
                    <p className="text-xl font-semibold leading-snug text-[#858585]">
                      {faq.question.trim() || `Question ${index + 1}`}
                    </p>
                    <p className="mt-3 text-lg font-medium leading-snug text-[#858585]">
                      {faq.answer.trim() || (hasContent ? '' : 'Answer preview')}
                    </p>
                    {faq.links.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {faq.links.map((link) => (
                          <span
                            key={link.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-cms-tab-active"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            {link.label.trim() || 'Untitled link'}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {!faq.isPublished ? (
                      <span className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                        Draft
                      </span>
                    ) : null}
                  </button>
                )}

                <div
                  className="absolute bottom-4 right-5 flex items-center justify-end gap-2 sm:right-8"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqId(faq.id)}
                    disabled={isEditing}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                    aria-label={`Edit FAQ ${index + 1}`}
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(faq.id)}
                    disabled={!canDeleteFaq}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                    aria-label={`Delete FAQ ${index + 1}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={addFaq}
          disabled={(faqs.length > 0 && !canAddFaq) || isSaving}
          title={canAddFaq ? 'Add new FAQ' : 'Fill the current FAQ question and answer first'}
          className="inline-flex items-center gap-2 rounded-full border border-cms-tab-active px-4 py-2 text-sm font-semibold text-cms-tab-active transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add new FAQ
        </button>
        <button
          type="button"
          onClick={saveFaqs}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Update FAQs'}
        </button>
      </div>
      {saveStatus ? (
        <p className="mt-4 text-right text-sm font-medium text-success-700">{saveStatus}</p>
      ) : null}
    </div>
  );
}

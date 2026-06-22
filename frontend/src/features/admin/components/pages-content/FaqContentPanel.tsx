import { useState, type DragEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { eventFormTextareaClassName } from '@/features/events/constants/eventFormStyles';
import { DragHandle } from './DragHandle';
import type { DropPosition, FaqItem, PagesContentTab } from './types';

const initialFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: '',
    answer: '',
  },
];

function createFaqId() {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyFaq(): FaqItem {
  return {
    id: createFaqId(),
    question: '',
    answer: '',
  };
}

function reorderFaqs(
  faqs: FaqItem[],
  draggedFaqId: string,
  targetFaqId: string,
  position: DropPosition,
) {
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
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [activeFaqId, setActiveFaqId] = useState(initialFaqs[0]?.id ?? null);
  const [draggedFaqId, setDraggedFaqId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    faqId: string;
    position: DropPosition;
  } | null>(null);

  const updateFaq = (faqId: string, updates: Partial<FaqItem>) => {
    setFaqs((currentFaqs) =>
      currentFaqs.map((faq) => (faq.id === faqId ? { ...faq, ...updates } : faq)),
    );
  };

  const canAddFaq = faqs.every((faq) => faq.question.trim() && faq.answer.trim());

  const addFaq = () => {
    if (!canAddFaq) return;

    const nextFaq = createEmptyFaq();

    setFaqs((currentFaqs) => [...currentFaqs, nextFaq]);
    setActiveFaqId(nextFaq.id);
    setDraggedFaqId(null);
    setDropIndicator(null);
  };

  const removeFaq = (faqId: string) => {
    setFaqs((currentFaqs) => {
      if (currentFaqs.length === 1) return currentFaqs;

      const nextFaqs = currentFaqs.filter((faq) => faq.id !== faqId);

      if (activeFaqId === faqId) {
        setActiveFaqId(nextFaqs[0]?.id ?? null);
      }

      return nextFaqs;
    });
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
                  isEditing ? 'min-h-[339px] pb-5 sm:pb-6 lg:h-[339px]' : 'min-h-[216px] pb-5',
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
                  </button>
                )}

                <div
                  className={[
                    'flex items-center justify-end',
                    isEditing
                      ? 'mt-8 border-t border-gray-200 pt-4'
                      : 'absolute bottom-4 right-5 sm:right-8',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqId(faq.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-primary-50 hover:text-cms-tab-active"
                    aria-label={`Edit FAQ ${index + 1}`}
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(faq.id)}
                    disabled={faqs.length === 1}
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
          disabled={!canAddFaq}
          title={canAddFaq ? 'Add new FAQ' : 'Fill the current FAQ question and answer first'}
          className="inline-flex items-center gap-2 rounded-full border border-cms-tab-active px-4 py-2 text-sm font-semibold text-cms-tab-active transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add new FAQ
        </button>
      </div>
    </div>
  );
}

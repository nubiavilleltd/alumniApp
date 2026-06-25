import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { SEO } from '@/shared/common/SEO';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';
import { usePublishedFaqs } from '../hooks/useFaqs';
import type { Faq } from '../types/faq.types';

function FaqPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#fbfbfa]">
      <section className="container-custom py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl animate-pulse">
          <div className="mb-4 h-12 w-3/4 rounded-full bg-gray-200 sm:h-14" />
          <div className="mb-2 h-7 w-full max-w-3xl rounded-full bg-gray-200" />
          <div className="h-7 w-2/3 rounded-full bg-gray-200" />
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-[6.4rem] animate-pulse rounded-[0.85rem] border border-[#dceffc] bg-white"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function FaqCard({ faq, isOpen, onToggle }: { faq: Faq; isOpen: boolean; onToggle: () => void }) {
  const answerId = `faq-answer-${faq.id}`;

  return (
    <article className="rounded-[0.85rem] border border-[#dceffc] bg-white shadow-[0_1px_2px_rgba(0,119,204,0.03)]">
      <button
        type="button"
        className="flex min-h-[4.5rem] w-full items-center justify-between gap-5 px-6 text-left sm:px-8"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
      >
        <span
          className={[
            'min-w-0 flex-1 text-[1rem] font-bold leading-[1.25] tracking-normal text-[#071116] sm:text-[18px]',
            isOpen ? '' : 'line-clamp-1',
          ].join(' ')}
        >
          {faq.question}
        </span>
        {isOpen ? (
          <Minus className="h-7 w-7 shrink-0 text-[#0077cc]" strokeWidth={2.4} />
        ) : (
          <Plus className="h-7 w-7 shrink-0 text-[#0077cc]" strokeWidth={2.4} />
        )}
      </button>

      {isOpen ? (
        <div id={answerId} className="px-6 pb-7 pt-0 sm:px-8">
          <p className="max-w-3xl text-base font-medium leading-7 text-[#556070]">{faq.answer}</p>
        </div>
      ) : null}
    </article>
  );
}

export function FaqPage() {
  const { data: faqs = [], isLoading, isError } = usePublishedFaqs();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  if (isLoading) {
    return <FaqPageSkeleton />;
  }

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about the alumni portal and alumnae community."
      />

      <main className="min-h-screen bg-[#fbfbfa]">
        <section className="container-custom py-16 sm:py-20 lg:py-24">
          <header className="max-w-4xl">
            <h1 className="m-0 text-[32px] font-bold leading-[1.08] tracking-normal text-[#071116]">
              Frequently Asked Questions
            </h1>
            <p className="mt-2 max-w-[48rem] font-base leading-[1.25] tracking-normal text-[#556070] sm:text-[20px]">
              Find answers to common questions about the platform, features, community programmes,
              and how to stay connected. Can't find what you're looking for?{' '}
              <AppLink href={ROUTES.CONTACT} className="underline underline-offset-4">
                Contact us!
              </AppLink>
            </p>
          </header>

          {isError ? (
            <div className="mt-16 rounded-[0.85rem] border border-[#dceffc] bg-white px-6 py-8 text-[#556070]">
              We could not load FAQs right now. Please try again later.
            </div>
          ) : null}

          {!isError && faqs.length === 0 ? (
            <div className="mt-16 rounded-[0.85rem] border border-[#dceffc] bg-white px-6 py-8 text-[#556070]">
              No FAQs have been published yet.
            </div>
          ) : null}

          {!isError && faqs.length > 0 ? (
            <div className="mt-16 grid items-start gap-4 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-4">
              {faqs.map((faq) => (
                <FaqCard
                  key={faq.id}
                  faq={faq}
                  isOpen={openFaqId === faq.id}
                  onToggle={() => setOpenFaqId((current) => (current === faq.id ? null : faq.id))}
                />
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

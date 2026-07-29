import { BirthdaySlider, CARD_WIDTH_CLASS } from './BirthdaySlider';
import { BirthdayCard } from './BirtthdayCard';
import { Birthday } from '../types/announcement.types';
import { useDismissedBirthdays } from '../hooks/useDismissedBirthdays';
import { BirthdayCardSkeleton } from './BirthdayCardSkeleton';

interface BirthdaySectionProps {
  people: Birthday[];
  isLoading?: boolean;
}

const SKELETON_COUNT = 3;

export function BirthdaySection({ people, isLoading = false }: BirthdaySectionProps) {
  // While loading, pass `undefined` (not `people`, which may just be `[]`
  // at this point) so the hook doesn't seed today's localStorage key with
  // an empty list before the real data has even arrived.
  const { visiblePeople, dismiss } = useDismissedBirthdays(isLoading ? undefined : people);

  if (isLoading) {
    
    return (
      <div className="mb-10 flex gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div key={index} className={`shrink-0 ${CARD_WIDTH_CLASS}`}>
            <BirthdayCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (visiblePeople.length === 0) return null;

  return (
    <div className="mb-10">
      <BirthdaySlider
        items={visiblePeople}
        getKey={(person) => person.userId}
        renderItem={(person) => <BirthdayCard person={person} onDismiss={dismiss} />}
      />
    </div>
  );
}
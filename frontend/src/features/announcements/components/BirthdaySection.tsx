import { useState } from 'react';
import { BirthdaySlider } from './BirthdaySlider';
import { BirthdayCard } from './BirtthdayCard';
import { Birthday } from '../types/announcement.types';
import { useDismissedBirthdays } from '../hooks/useDismissedBirthdays';

interface BirthdaySectionProps {
  people: Birthday[];
}

export function BirthdaySection({ people }: BirthdaySectionProps) {
  // TODO: replace with localStorage-backed dismissal (keyed by today's date)
  const { visiblePeople, dismiss } = useDismissedBirthdays(people);

//   const visiblePeople = people.filter((person) => !dismissedIds.has(person.userId));

//   const handleDismiss = (userId: string) => {
//     setDismissedIds((prev) => new Set(prev).add(userId));
//   };

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
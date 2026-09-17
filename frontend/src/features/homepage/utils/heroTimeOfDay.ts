import { useEffect, useState } from 'react';
import type { HomepageTimeOfDay } from '../types/homepage.types';

const DAY_START_HOUR = 6;
const NIGHT_START_HOUR = 18;

export function getHeroTimeOfDay(date = new Date()): HomepageTimeOfDay {
  const hour = date.getHours();
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? 'day' : 'night';
}

export function useHeroTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<HomepageTimeOfDay>(() => getHeroTimeOfDay());

  useEffect(() => {
    const updateTimeOfDay = () => setTimeOfDay(getHeroTimeOfDay());
    const interval = window.setInterval(updateTimeOfDay, 60_000);

    updateTimeOfDay();
    return () => window.clearInterval(interval);
  }, []);

  return timeOfDay;
}

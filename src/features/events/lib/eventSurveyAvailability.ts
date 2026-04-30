export const EVENT_SURVEY_TAG = 'registration-form-enabled';

const STORAGE_KEY = 'alumniapp.events.surveyAvailability.v1';

export type EventSurveyAvailability = 'enabled' | 'disabled' | 'unknown';

function canUseStorage() {
  return typeof window !== 'undefined';
}

function readAvailabilityMap(): Record<string, boolean> {
  if (!canUseStorage()) return {};

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAvailabilityMap(map: Record<string, boolean>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getStoredEventSurveyAvailability(eventId: string): EventSurveyAvailability {
  if (!eventId) return 'unknown';

  const map = readAvailabilityMap();
  if (!(eventId in map)) {
    return 'unknown';
  }

  return map[eventId] ? 'enabled' : 'disabled';
}

export function setStoredEventSurveyAvailability(eventId: string, hasSurvey: boolean) {
  if (!eventId) return;

  const map = readAvailabilityMap();
  map[eventId] = hasSurvey;
  writeAvailabilityMap(map);
}

export function clearStoredEventSurveyAvailability(eventId: string) {
  if (!eventId) return;

  const map = readAvailabilityMap();
  if (!(eventId in map)) return;
  delete map[eventId];
  writeAvailabilityMap(map);
}

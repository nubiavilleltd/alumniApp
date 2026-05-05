export function capitalizeFirstLetter(word: string): string {
  const normalized = word.trim();
  if (!normalized) return '';

  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

export function toTitleCase(value: string): string {
  const normalized = value.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';

  return normalized
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

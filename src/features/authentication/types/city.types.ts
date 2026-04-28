// features/alumni/types/city.types.ts
// Represents a city as returned from GET /get_cities.

export interface City {
  cityId: number;
  city: string;
  chapterId: number;
  zoneId: number;
  zone: string;
}

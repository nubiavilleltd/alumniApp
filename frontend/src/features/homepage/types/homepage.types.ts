export interface HomepageCarouselImage {
  id: string;
  imageUrl: string;
  fileName: string;
  altText: string;
  sortOrder: number;
  isHidden: boolean;
  showGreetingMessage: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomepageContent {
  greetingTitle: string;
  greetingMessage: string;
  carouselImages: HomepageCarouselImage[];
}

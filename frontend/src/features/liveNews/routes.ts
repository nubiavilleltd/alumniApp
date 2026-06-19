export const LIVE_NEWS_ROUTES = {
  ROOT: '/live-news',
  DETAIL: (id: string) => `/live-news/${id}`,
} as const;

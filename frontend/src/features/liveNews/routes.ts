export const LIVE_NEWS_ROUTES = {
  ROOT: '/live-news',
  DETAIL_PATH: '/live-news/:id/:slug',
  DETAIL: (id: string, slug: string) => `/live-news/${id}/${slug}`,
};
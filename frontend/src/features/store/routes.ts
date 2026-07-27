// routes.ts
export const STORE_ROUTES = {
  ROOT: '/store',
  CART: '/store/cart',
  CHECKOUT: '/store/checkout',
};

// routes.ts (user-facing)
export const ORDER_ROUTES = {
  ROOT: '/orders',
  DETAIL: (id: string) => `/orders/${id}`,
  DETAIL_PATH: '/orders/:id',
};
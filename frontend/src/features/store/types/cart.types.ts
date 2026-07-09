// export interface CartItem {
//   id: string;

//   productId: string;
//   productName: string;

//   image: string;

//   price: number;

//   quantity: number;

//   color?: string;
//   size?: string;
// }



// ─── Server cart types (from fetch_cart response) ─────────────────────────────

export interface ServerCartVariant {
  id: string;
  color: string | null;
  size: string | null;
}

export interface ServerCartImage {
  id: string;
  image_url: string;
}

export interface ServerCartItem {
  cart_item_id: string;
  product_id: string;
  unit_price: string;
  quantity: string;
  subtotal: string;
  product_name: string;
  variant: ServerCartVariant | null;
  image: ServerCartImage | null;
}

export interface ServerCart {
  cart_id: number;
  total_items: number;
  subtotal: string;
  items: ServerCartItem[];
}

// ─── Local cart item (Zustand + UI) ──────────────────────────────────────────

export interface CartItem {
  /** cart_item_id returned by backend after add — undefined until synced */
  cartItemId?: string;
  /** composite local key: productId-variantId or productId-novariant */
  id: string;
  productId: string;
  /** DB variant id — sent as variant_id in add_to_cart */
  variantId?: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

// ─── API payload types ────────────────────────────────────────────────────────

export interface AddToCartPayload {
  product_id: number;
  variant_id?: number;
  quantity: number;
}

export interface UpdateCartPayload {
  cart_item_id: number;
  quantity: number;
}

export interface RemoveFromCartPayload {
  cart_item_id: number;
}
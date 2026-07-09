import { CartItem } from "../types/cart.types";
import { cartService } from "./cart.service";
import { synchronizeGuestCart } from "./cartSync.service";

interface HydrateAuthenticatedCartParams {
  ownerId: string | null;
  currentUserId: string;
  localItems: CartItem[];
  setItems: (items: CartItem[], cartId?: number) => void;
  setOwnerId: (ownerId: string) => void;
}

export async function hydrateAuthenticatedCart({
  ownerId,
  currentUserId,
  localItems,
  setItems,
  setOwnerId,
}: HydrateAuthenticatedCartParams): Promise<void> {
  const { items: serverItems, cartId } = await cartService.fetchCart();

  // Cart belongs to another user.
  if (ownerId && ownerId !== currentUserId) {
    setItems(serverItems, cartId);
    setOwnerId(currentUserId);
    return;
  }

  // Guest has no cart.
  if (localItems.length === 0) {
    setItems(serverItems, cartId);
    setOwnerId(currentUserId);
    return;
  }

  await synchronizeGuestCart({
    localItems,
    serverItems,
  });

  const refreshed = await cartService.fetchCart();

  setItems(refreshed.items, refreshed.cartId);
  setOwnerId(currentUserId);
}
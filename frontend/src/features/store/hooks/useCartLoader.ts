import { useEffect, useRef } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { cartService } from '../services/cart.service';
import type { CartItem } from '../types/cart.types';

/**
 * useCartLoader
 *
 * Mount once in an authenticated shell (e.g. RootLayout or AppShell).
 * Pass `isAuthenticated` from your auth store.
 *
 * On login:  fetches server cart, merges with local (local wins), updates store
 * On logout: clears local cart
 */
export function useCartLoader(isAuthenticated: boolean) {
    const { items: localItems, setItems } = useCartStore();
    const hasFetched = useRef(false);
    const wasAuthenticated = useRef(false);

    useEffect(() => {
        // ── User just logged in ────────────────────────────────────────────────
        if (isAuthenticated && !wasAuthenticated.current) {
            wasAuthenticated.current = true;
            if (hasFetched.current) return;
            hasFetched.current = true;

            const loadAndMerge = async () => {
                try {
                    const { items: serverItems, cartId } = await cartService.fetchCart();

                    if (localItems.length === 0) {
                        setItems(serverItems, cartId);
                        return;
                    }
                    const guestOnlyItems: CartItem[] = [];
                    const duplicateItems: Array<{
                        local: CartItem;
                        server: CartItem;
                    }> = [];

                    for (const local of localItems) {
                        const server = serverItems.find((s) => s.id === local.id);

                        if (server) {
                            duplicateItems.push({
                                local,
                                server,
                            });
                        } else {
                            guestOnlyItems.push(local);
                        }
                    }

                    console.log('Guest-only items', guestOnlyItems);
                    console.log('Duplicate items', duplicateItems);


                    // Upload guest-only items
                    for (const item of guestOnlyItems) {
                        await cartService.addToCart({
                            product_id: parseInt(item.productId, 10),
                            ...(item.variantId
                                ? { variant_id: parseInt(item.variantId, 10) }
                                : {}),
                            quantity: item.quantity,
                        });
                    }

                    for (const { local, server } of duplicateItems) {
                        if (
                            local.quantity !== server.quantity &&
                            server.cartItemId
                        ) {
                            await cartService.updateCart({
                                cart_item_id: Number(server.cartItemId),
                                quantity: local.quantity,
                            });
                        }
                    }


                    // Fetch the authoritative server cart.
                    const refreshed = await cartService.fetchCart();

                    setItems(refreshed.items, refreshed.cartId);
                } catch {
                    // Silently fail — local cart remains usable
                }


            };



            void loadAndMerge();
        }

        // ── User just logged out ───────────────────────────────────────────────
        if (!isAuthenticated) {
            wasAuthenticated.current = false;
            hasFetched.current = false;
        }
    }, [isAuthenticated]);
}

function mergeCartItems(local: CartItem[], server: CartItem[]): CartItem[] {
    const merged = new Map<string, CartItem>();
    for (const item of server) merged.set(item.id, item);
    for (const item of local) {
        const serverVersion = merged.get(item.id);
        merged.set(item.id, {
            ...item,
            cartItemId: serverVersion?.cartItemId ?? item.cartItemId,
        });
    }
    return [...merged.values()];
}
import { useCallback } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { cartService } from '../services/cart.service';
import { toast } from '@/shared/components/ui/Toast';
import type { CartItem } from '../types/cart.types';
import { useAuth } from '@/features/authentication/hooks/useAuth';

/**
 * useCart — the single hook all cart UI uses.
 *
 * Every action:
 * 1. Updates Zustand immediately (optimistic — UI stays instant)
 * 2. Fires the backend API in the background
 * 3. On API success: re-fetches cart to get server-assigned cartItemId
 * 4. On API failure: rolls back + shows error toast
 */
export function useCart() {
    const {
        items,
        syncStatus,
        addItemLocally,
        updateItemLocally,
        removeItemLocally,
        removeManyLocally,
        setItems,
        clearCart: clearCartLocally,
        setSyncStatus,
        setOwnerId,
    } = useCartStore();

    const { isAuthenticated } = useAuth();

    // ── Add ────────────────────────────────────────────────────────────────────
    const addItem = useCallback(
        async (item: CartItem) => {
            if (!isAuthenticated) {
                setOwnerId(null);
            }
            addItemLocally(item);

            // Guest users keep a local cart only.
            if (!isAuthenticated) {
                return;
            }

            setSyncStatus('syncing');

            try {
                await cartService.addToCart({
                    product_id: parseInt(item.productId, 10),
                    ...(item.variantId
                        ? { variant_id: parseInt(item.variantId, 10) }
                        : {}),
                    quantity: item.quantity,
                });

                const { items: serverItems, cartId } = await cartService.fetchCart();

                setItems(serverItems, cartId);
                setSyncStatus('idle');
            } catch (error: any) {
                removeItemLocally(item.id);
                setSyncStatus('error');
                toast.fromError(error);
            }
        },
        [
            isAuthenticated,
            addItemLocally,
            removeItemLocally,
            setItems,
            setSyncStatus,
        ],
    );

    // ── Update quantity ────────────────────────────────────────────────────────
    const updateItem = useCallback(
        async (localId: string, quantity: number) => {
            const existing = items.find((i) => i.id === localId);
            if (!existing) return;

            const previousQty = existing.quantity;
            updateItemLocally(localId, quantity);
            if (!isAuthenticated) {
                return;
            }

            setSyncStatus('syncing');

            if (!existing.cartItemId) {
                // Not yet synced to server — local only
                setSyncStatus('idle');
                return;
            }

            try {
                await cartService.updateCart({
                    cart_item_id: parseInt(existing.cartItemId, 10),
                    quantity,
                });
                setSyncStatus('idle');
            } catch (error: any) {
                updateItemLocally(localId, previousQty);
                setSyncStatus('error');
                toast.fromError(error);
            }
        },
        [items, updateItemLocally, setSyncStatus, isAuthenticated],
    );

    // ── Remove single ──────────────────────────────────────────────────────────
    const removeItem = useCallback(
        async (localId: string) => {
            const existing = items.find((i) => i.id === localId);
            if (!existing) return;

            removeItemLocally(localId);
            if (!isAuthenticated) {
                return;
            }
            setSyncStatus('syncing');

            if (!existing.cartItemId) {
                setSyncStatus('idle');
                return;
            }

            try {
                await cartService.removeFromCart({
                    cart_item_id: parseInt(existing.cartItemId, 10),
                });
                setSyncStatus('idle');
            } catch (error: any) {
                addItemLocally(existing);
                setSyncStatus('error');
                toast.fromError(error);
            }
        },
        [items, removeItemLocally, addItemLocally, setSyncStatus, isAuthenticated],
    );

    // ── Remove many ────────────────────────────────────────────────────────────
    const removeMany = useCallback(
        async (localIds: string[]) => {
            const toRemove = items.filter((i) => localIds.includes(i.id));
            if (toRemove.length === 0) return;

            removeManyLocally(localIds);
            if (!isAuthenticated) {
                return;
            }
            setSyncStatus('syncing');

            try {
                await Promise.all(
                    toRemove
                        .filter((i) => !!i.cartItemId)
                        .map((i) =>
                            cartService.removeFromCart({
                                cart_item_id: parseInt(i.cartItemId!, 10),
                            }),
                        ),
                );
                setSyncStatus('idle');
            } catch (error: any) {
                toRemove.forEach((i) => addItemLocally(i));
                setSyncStatus('error');
                toast.fromError(error);
            }
        },
        [items, removeManyLocally, addItemLocally, setSyncStatus, isAuthenticated],
    );

    // ── Clear ──────────────────────────────────────────────────────────────────
    const clearCart = useCallback(async () => {
        const snapshot = [...items];
        clearCartLocally();
        if (!isAuthenticated) {
            return;
        }
        setSyncStatus('syncing');
        try {
            await cartService.clearCart();
            setSyncStatus('idle');
        } catch (error: any) {
            setItems(snapshot);
            setSyncStatus('error');
            toast.fromError(error);
        }
    }, [items, clearCartLocally, setItems, setSyncStatus, isAuthenticated]);

    return { items, syncStatus, addItem, updateItem, removeItem, removeMany, clearCart };
}
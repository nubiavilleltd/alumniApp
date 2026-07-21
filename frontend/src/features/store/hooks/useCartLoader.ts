import { useEffect, useRef } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { hydrateAuthenticatedCart } from '../services/cartHydration.service';

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
    const { user } = useAuth();
    const {
        items: localItems,
        ownerId,
        setOwnerId,
        setItems,
    } = useCartStore();
    const hasFetched = useRef(false);
    const wasAuthenticated = useRef(false);

    useEffect(() => {
        // ── User just logged in ────────────────────────────────────────────────
        if (isAuthenticated && !wasAuthenticated.current) {
            wasAuthenticated.current = true;
            if (hasFetched.current) return;
            hasFetched.current = true;
            const currentUserId = String(user?.id ?? '');

            const loadAndMerge = async () => {
                try {
                    await hydrateAuthenticatedCart({
                        ownerId,
                        currentUserId,
                        localItems,
                        setItems,
                        setOwnerId,
                    });
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
    }, [isAuthenticated, user]);
}


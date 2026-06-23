import { useMemo } from 'react';
import { SEO } from '@/shared/common/SEO';
import { useCartStore } from '../stores/useCartStore';
import { useProductModalStore } from '../stores/useProductModalStore';

export function CartPage() {
    const { items, removeItem, clearCart } =
        useCartStore();

    const openEdit = useProductModalStore(
        (s) => s.openForEdit,
    );

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0,
            ),
        [items],
    );

    return (
        <>
            <SEO title="Cart" />

            <div className="container-custom py-10">
                <h1 className="text-2xl font-bold mb-6">
                    Your Cart
                </h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.length === 0 ? (
                            <p className="text-gray-500">
                                Cart is empty
                            </p>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border p-4 rounded-lg bg-white"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {item.productName}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {item.color} /{' '}
                                            {item.size}
                                        </p>

                                        <p className="text-sm font-medium">
                                            ₦{item.price}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                openEdit(
                                                    {
                                                        id: item.productId,
                                                        name: item.productName,
                                                        price: item.price,
                                                        hasSizes: true,
                                                        variants: [],
                                                    } as any,
                                                    item,
                                                )
                                            }
                                            className="text-blue-500"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                            className="text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* RIGHT SUMMARY (sticky) */}
                    <div className="lg:sticky lg:top-20 h-fit border rounded-xl p-5 bg-white">
                        <h2 className="font-bold mb-4">
                            Summary
                        </h2>

                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₦{subtotal}</span>
                        </div>

                        <button
                            onClick={clearCart}
                            disabled={items.length === 0}
                            className="w-full mt-4 bg-red-500 text-white py-2 rounded disabled:opacity-50"
                        >
                            Delete Selected Items
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
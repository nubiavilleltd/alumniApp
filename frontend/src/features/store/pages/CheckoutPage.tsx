import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { useCartStore } from '../stores/useCartStore';
import { AddressModal } from '../components/AddressModal';
import { AddressCard } from '../components/AddressCard';
import { useAddresses } from '../hooks/useAddresses';
import { useDeliveryZones } from '../hooks/useDeliveryZones';
// import { useCheckout } from '../hooks/useCheckout';
import { STORE_ROUTES } from '../routes';
import { Info } from 'lucide-react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import type { Address } from '../types/address.types';
import { AUTH_ROUTES } from '@/features/authentication/routes';

// ─── Pickup address (static for now) ─────────────────────────────────────────
const PICKUP_ADDRESS =
    'Shop B6, Lotto Plaza, Opposite Farapark and besides Manbilla Hotel, Majek, Eti-Osa, Manbilla Hotel | Lagos - LEKKI-AJAH (ABIJO)';

export function CheckoutPage() {
    const { items } = useCartStore();
    const navigate = useNavigate();
    const [deliveryMethod, setDeliveryMethod] = useState<
        'pickup' | 'delivery'
    >('pickup');

    const { isAuthenticated } = useAuth();
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const { data: addresses = [], isLoading: addressesLoading, deleteAddress } = useAddresses();

    const { data: zones = [] } = useDeliveryZones();
    // const { checkout, isLoading: checkoutLoading } = useCheckout();



    const groupedOrderItems = useMemo(() => {
        const map = new Map<string, { image: string; price: number; qty: number }>();
        for (const item of items) {
            const existing = map.get(item.productId);
            if (existing) {
                existing.qty += item.quantity;
            } else {
                map.set(item.productId, { image: item.image, price: item.price, qty: item.quantity });
            }
        }
        return [...map.values()];
    }, [items]);

    // Auto-select first address when addresses load
    useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(addresses[0].id);
    }
}, [addresses, selectedAddressId]);

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

    const hasAddress = selectedAddress !== null;




    // Compute shipping fee from zones
   const shippingFee =
    deliveryMethod === 'delivery' && selectedAddress
        ? zones
              .find((z) => z.state === selectedAddress.state)
              ?.areas.find((a) => a.area === selectedAddress.area)
              ?.fee ?? 0
        : 0;


    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

   const total =
    subtotal +
    (deliveryMethod === 'delivery' ? shippingFee : 0);



    // on Pay Now button click:
    const handlePayNow = () => {
        if (!isAuthenticated) {
            navigate(AUTH_ROUTES.LOGIN, {
                state: { from: '/store/checkout' }  // same pattern ProtectedRoute uses
            });
            return;
        }
        // TODO: initiate payment here
    };

    return (
        <>
            <SEO title="Checkout" />

            <div className="min-h-screen bg-[#F8F8F7]">
                <div className="container-custom py-8 sm:py-10">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
                        <div className="lg:col-span-2 flex flex-col gap-4">

                            {/* ── Delivery method cards ────────────────────────────────── */}

                            {/* Self Pickup */}
                            <button
                                onClick={() => setDeliveryMethod('pickup')}
                                className={`w-full text-left p-4 rounded-2xl border-2 bg-white transition-all ${deliveryMethod === 'pickup'
                                    ? 'border-primary-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${deliveryMethod === 'pickup' ? 'border-primary-500' : 'border-gray-400'
                                            }`}
                                    >
                                        {deliveryMethod === 'pickup' && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                                        )}
                                    </span>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Self Pickup</p>
                                        <p className="text-sm text-gray-500 leading-snug mt-0.5">{PICKUP_ADDRESS}</p>
                                    </div>
                                </div>
                            </button>


                            <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                {/* Door Delivery */}
                            <button
                                onClick={() => setDeliveryMethod('delivery')}
                                className={`w-full text-left p-4 rounded-2xl border-2 bg-white transition-all ${deliveryMethod === 'delivery'
                                    ? 'border-primary-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        {/* Radio circle */}
                                        <span
                                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${deliveryMethod === 'delivery'
                                                ? 'border-primary-500'
                                                : 'border-gray-400'
                                                }`}
                                        >
                                            {deliveryMethod === 'delivery' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                                            )}
                                        </span>

                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Door Delivery</p>
                                           <p className="text-xs text-gray-400 mt-0.5">
                                                    Order will be delivered in 3 to 5 working days
                                                </p>
                                        </div>
                                    </div>

                                    {/* Add/Change address button — only when door delivery is active */}
                                    {deliveryMethod === 'delivery' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingAddress(null);
                                                setAddressModalOpen(true);
                                            }}
                                            className="shrink-0 text-sm font-semibold text-primary-500 border border-primary-500 rounded-full px-4 py-1.5 hover:bg-primary-50 transition-colors"
                                        >
                                            Add Shipping Address
                                        </button>
                                    )}
                                </div>
                            </button>

                            {/* Address list */}
                            {deliveryMethod === 'delivery' && (
                                <div className="mt-3 flex flex-col gap-2">
                                    {addressesLoading ? (
                                        <p className="text-xs text-gray-400 animate-pulse">Loading addresses...</p>
                                    ) : (
                                        addresses.map((addr) => (
                                            <AddressCard
                                                key={addr.id}
                                                address={addr}
                                                isSelected={selectedAddressId === addr.id}
                                                onSelect={() => setSelectedAddressId(addr.id)}
                                                onEdit={() => { setEditingAddress(addr); setAddressModalOpen(true); }}
                                                onDelete={() => deleteAddress.mutate(addr.id)}
                                                isDeleting={deleteAddress.isPending}
                                            />
                                        ))
                                    )}
                                    {/* Add Shipping Address — always visible for delivery */}
                                  
                                </div>
                            )}


                            </div>

                            

                            
                            {/* ── Order Summary tiles ──────────────────────────────────── */}
                            {items.length > 0 && (
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-4 text-sm">Order Summary</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {groupedOrderItems.map((g, i) => (
                                            <div key={i} className="border border-gray-200 rounded-xl p-2 flex flex-col items-center gap-1 w-[110px]">
                                                <img src={g.image} alt="" className="w-full h-[80px] object-cover rounded-lg bg-gray-50" />
                                                <p className="text-xs font-bold text-gray-800">₦{g.price.toLocaleString()}</p>
                                                <p className="text-xs text-gray-400">×{g.qty}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT COLUMN: sticky summary ────────────────────────────── */}
                        <div className="lg:sticky lg:top-20 h-fit">
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5">Summary</h2>

                                <div className="flex flex-col gap-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            ₦{subtotal.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping Fee</span>
                                        <span className="font-medium text-gray-900">
                                            {deliveryMethod === 'pickup'
                                                ? '—'
                                                : shippingFee > 0
                                                    ? `₦${shippingFee.toLocaleString()}`
                                                    : hasAddress
                                                        ? '₦0'
                                                        : '—'}
                                        </span>
                                    </div>

                                    <hr className="border-gray-100 my-1" />

                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total Amount</span>
                                        <span className="font-bold text-gray-900 text-lg">
                                            ₦{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Pay Now */}
                                <button
                                    onClick={handlePayNow}
                                    disabled={
                                        items.length === 0 ||
                                        (deliveryMethod === 'delivery' && !hasAddress)
                                    }
                                    className="mt-5 w-full py-3.5 rounded-full bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Pay Now
                                </button>

                                <p className='mt-3 text-xs flex items-center text-gray-600 gap-1'><Info size={15} /> There are no refunds on purchases</p>

                                {deliveryMethod === 'delivery' && !hasAddress && (
                                    <p className="text-xs text-gray-400 text-center mt-2">
                                        Please add a shipping address to continue
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address modal */}
            <AddressModal
                isOpen={addressModalOpen}
                onClose={() => { setAddressModalOpen(false); setEditingAddress(null); }}
                editAddress={editingAddress}
            />
        </>
    );
}
// import { useState } from 'react';
// import { SEO } from '@/shared/common/SEO';
// import { useCartStore } from '../stores/useCartStore';

// export function CheckoutPage() {
//     const { items } = useCartStore();

//     const [method, setMethod] =
//         useState<'pickup' | 'delivery'>('pickup');

//     const [address, setAddress] = useState<any>(null);

//     const shippingFee =
//         method === 'delivery' ? 2500 : 0;

//     const total =
//         items.reduce(
//             (s, i) => s + i.price * i.quantity,
//             0,
//         ) + shippingFee;

//     return (
//         <>
//             <SEO title="Checkout" />

//             <div className="container-custom py-10">
//                 <h1 className="text-2xl font-bold mb-6">
//                     Checkout
//                 </h1>

//                 {/* DELIVERY METHOD */}
//                 <div className="space-y-3 mb-6">
//                     <button
//                         onClick={() =>
//                             setMethod('pickup')
//                         }
//                         className={`p-3 border rounded w-full ${
//                             method === 'pickup'
//                                 ? 'border-primary-500'
//                                 : ''
//                         }`}
//                     >
//                         Self Pickup
//                     </button>

//                     <button
//                         onClick={() =>
//                             setMethod('delivery')
//                         }
//                         className={`p-3 border rounded w-full ${
//                             method === 'delivery'
//                                 ? 'border-primary-500'
//                                 : ''
//                         }`}
//                     >
//                         Door Delivery
//                     </button>
//                 </div>

//                 {/* ADDRESS */}
//                 {method === 'delivery' && (
//                     <div className="mb-6">
//                         <button className="border p-3 w-full rounded">
//                             {address
//                                 ? 'Change Address'
//                                 : 'Add Shipping Address'}
//                         </button>
//                     </div>
//                 )}

//                 {/* SUMMARY */}
//                 <div className="border p-5 rounded-lg">
//                     <p>Subtotal: ₦{total}</p>
//                     <p>
//                         Shipping:{' '}
//                         {method === 'pickup'
//                             ? '-'
//                             : `₦${shippingFee}`}
//                     </p>

//                     <hr className="my-2" />

//                     <p className="font-bold">
//                         Total: ₦{total}
//                     </p>

//                     <button className="w-full mt-4 bg-primary-500 text-white py-2 rounded">
//                         Pay Now
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// }










import { useState } from 'react';
import { SEO } from '@/shared/common/SEO';
import { useCartStore } from '../stores/useCartStore';
import { useCheckoutStore } from '../stores/useCheckoutStore';
import { AddressModal } from '../components/AddressModal';

export function CheckoutPage() {
  const { items } = useCartStore();

  const {
    deliveryMethod,
    setDeliveryMethod,
    shippingAddress,
  } = useCheckoutStore();

  const [openAddress, setOpenAddress] =
    useState(false);

  const shippingFee =
    deliveryMethod === 'delivery' ? 2500 : 0;

  const total =
    items.reduce(
      (s, i) => s + i.price * i.quantity,
      0,
    ) + shippingFee;

  return (
    <>
      <SEO title="Checkout" />

      <div className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-6">
          Checkout
        </h1>

        {/* DELIVERY METHOD */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() =>
              setDeliveryMethod('pickup')
            }
            className={`p-3 border rounded w-full ${
              deliveryMethod === 'pickup'
                ? 'border-primary-500'
                : ''
            }`}
          >
            Self Pickup
          </button>

          <button
            onClick={() =>
              setDeliveryMethod('delivery')
            }
            className={`p-3 border rounded w-full ${
              deliveryMethod === 'delivery'
                ? 'border-primary-500'
                : ''
            }`}
          >
            Door Delivery
          </button>
        </div>

        {/* ADDRESS SECTION */}
        {deliveryMethod === 'delivery' && (
          <div className="mb-6">
            <button
              onClick={() =>
                setOpenAddress(true)
              }
              className="border p-3 w-full rounded"
            >
              {shippingAddress
                ? 'Change Address'
                : 'Add Shipping Address'}
            </button>

            {shippingAddress && (
              <div className="mt-2 text-sm text-gray-600">
                {shippingAddress.firstName}{' '}
                {shippingAddress.lastName} -{' '}
                {shippingAddress.address}
              </div>
            )}
          </div>
        )}

        {/* SUMMARY */}
        <div className="border p-5 rounded-lg">
          <p>Subtotal: ₦{total}</p>

          <p>
            Shipping:{' '}
            {deliveryMethod === 'pickup'
              ? '-'
              : `₦${shippingFee}`}
          </p>

          <hr className="my-2" />

          <p className="font-bold">
            Total: ₦{total}
          </p>

          <button className="w-full mt-4 bg-primary-500 text-white py-2 rounded">
            Pay Now
          </button>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      <AddressModal
        isOpen={openAddress}
        onClose={() => setOpenAddress(false)}
      />
    </>
  );
}
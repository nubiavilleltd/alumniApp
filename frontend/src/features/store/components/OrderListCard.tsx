// // /feature/store/components/orders/OrderListCard.tsx

// import { Order } from '../types/order.types';
// import { Copy } from 'lucide-react';
// import { OrderStatusBadge } from './OrderStatusBadge';

// interface OrderListCardProps {
//   /** The order data */
//   order: Order;
//   /** Variant: 'user' for order history, 'admin' for order management */
//   variant: 'user' | 'admin';
//   /** Action button to render (e.g., "View Details" link) */
//   action?: React.ReactNode;
//   /** Called when "Add to Cart" is clicked (user variant only) */
//   onAddToCart?: (order: Order) => void;
// }

// export function OrderListCard({
//   order,
//   variant,
//   action,
//   onAddToCart,
// }: OrderListCardProps) {

//   const isAdmin = variant === 'admin';
//   const isUser = variant === 'user';

//   // Format date
//   const formattedDate = new Date(order.placedAt).toLocaleDateString('en-GB', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });

//   // Get relative date for user view
//   const getRelativeDate = (date: string) => {
//     const now = new Date();
//     const placed = new Date(date);
//     const diffDays = Math.floor((now.getTime() - placed.getTime()) / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return formattedDate;
//   };

//   // Get display date based on variant
//   const displayDate = isUser ? getRelativeDate(order.placedAt) : formattedDate;

//   // Get customer name for admin
//   const customerName = `${order.firstName} ${order.lastName}`;

//   // Get first 3 items for admin thumbnail grid
//   const displayItems = order.items.slice(0, 3);
//   const remainingItems = order.items.length - 3;

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
//       {/* Header Row */}
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           <OrderStatusBadge status={order.status} />
//           <span className="text-sm text-gray-400">•</span>
//           <span className="text-sm text-gray-500">{displayDate}</span>
//         </div>
//         {action && (
//           <div className="text-sm text-primary-600 hover:text-primary-700">
//             {action}
//           </div>
//         )}
//       </div>

//       {/* Admin: Customer Info */}
//       {isAdmin && (
//         <div className="text-sm text-gray-600 mb-2">
//           <span className="font-medium">Customer:</span> {customerName}
//           <span className="mx-2 text-gray-300">•</span>
//           <span className="text-gray-500">{order.userId}</span>
//         </div>
//       )}

//       {/* Order Number */}
//       <div className="text-xs text-gray-400 mb-3">
//         Order Number: {order.orderNumber}
//       </div>

//       {/* Content - Different layouts for user vs admin */}
//       {isUser ? (
//         // User Layout: Product list with "Add to Cart"
//         <div className="space-y-3">
//           {order.items.map((item) => (
//             <div key={item.id} className="flex items-start gap-3">
//               {/* Product Image */}
//               <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
//                 <img
//                   src={item.image}
//                   alt={item.productName}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
              
//               {/* Product Info */}
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-800 truncate">
//                   {item.productName}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   ₱{item.price.toLocaleString()} × {item.quantity}
//                 </p>
//                 {item.color && item.size && (
//                   <p className="text-xs text-gray-400">
//                     {item.color}/{item.size}
//                   </p>
//                 )}
//               </div>

//               {/* Total & Add to Cart (only on first item) */}
//               {order.items.indexOf(item) === 0 && (
//                 <div className="flex flex-col items-end gap-1">
//                   <p className="text-sm font-semibold text-gray-800">
//                     Total: ₱{order.total.toLocaleString()}
//                   </p>
//                   {onAddToCart && (
//                     <button
//                       type="button"
//                       onClick={() => onAddToCart(order)}
//                       className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-full transition-colors"
//                     >
//                       Add to Cart
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         // Admin Layout: Thumbnail grid with total
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             {displayItems.map((item, index) => (
//               <div
//                 key={item.id}
//                 className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
//                 style={{ marginLeft: index > 0 ? '-8px' : '0' }}
//               >
//                 <img
//                   src={item.image}
//                   alt={item.productName}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//             {remainingItems > 0 && (
//               <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
//                 +{remainingItems}
//               </div>
//             )}
//           </div>
//           <p className="text-sm font-semibold text-gray-800">
//             Total: ₱{order.total.toLocaleString()}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }




import React from 'react'
import { Order } from '../types/order.types'
import { OrderStatusBadge } from './OrderStatusBadge'
import OrderItemCard from './OrderItemCard'
import CopyButton from '@/shared/components/ui/CopyButton'

type OrderListCardProps = {
    variant?: 'user' | 'admin';
    order: Order
    action?: React.ReactNode
}

export default function OrderListCard({ order, action, variant="user" }: OrderListCardProps) {
    const isAdmin = variant === 'admin';
  const isUser = variant === 'user';
    const formattedDate = new Date(order.placedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })


    return (
        <div className="bg-white rounded-2xl p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{formattedDate}</span>
                    {order.customerFullName && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-700">{order.customerFullName}</span>
                        </>
                    )}
                    {order.customerEmail && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500">{order.customerEmail}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    <div className='flex gap-1'>          <span className="text-sm text-gray-500">
                        Order Number: <span className="text-gray-700">{order.orderNumber || ""}</span>
                    </span>

                        <CopyButton value={order.orderNumber}/>
                    </div>
          
                    {action}
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-5">
                    {order.items.map((item) => (
                        <OrderItemCard key={item.id} orderItem={item} />
                    ))}
                </div>
                <p className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                    Total: ₦{order.total.toLocaleString()}
                </p>
            </div>
        </div>
    )
}

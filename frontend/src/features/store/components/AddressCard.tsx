// import { Pencil, Trash2 } from 'lucide-react';
// import type { Address } from '../types/address.types';

// interface Props {
//   address: Address;
//   isSelected: boolean;
//   onSelect: () => void;
//   onEdit: () => void;
//   onDelete: () => void;
//   isDeleting?: boolean;
// }

// export function AddressCard({
//   address,
//   isSelected,
//   onSelect,
//   onEdit,
//   onDelete,
//   isDeleting,
// }: Props) {
//   return (
//     <button
//       type="button"
//       onClick={onSelect}
//       className={`w-full text-left p-4 rounded-xl border transition-all relative ${
//         isSelected ? 'border-primary-900 bg-primary-50/30' : 'border-gray-200 hover:border-gray-300'
//       }`}
//     >
//       <p className="font-semibold text-gray-800 text-sm pr-16">
//         {address.firstName} {address.lastName}
//       </p>
//       <p className="text-xs text-gray-500 mt-0.5 pr-16">
//         {[address.address, address.landmark, address.area, address.state, address.phone]
//           .filter(Boolean)
//           .join(' | ')}
//       </p>

//       {/* Edit / Delete */}
//       <div className="absolute top-1 right-3 flex flex-col gap-1">
//         <button
//           type="button"
//           onClick={(e) => { e.stopPropagation(); onEdit(); }}
//           disabled={isDeleting}
//           className="p-1.5 text-primary-500 hover:text-primary-600 transition-colors"
//           aria-label="Edit address"
//         >
//           <Pencil size={14} />
//         </button>
//         <button
//           type="button"
//           onClick={(e) => { e.stopPropagation(); onDelete(); }}
//           disabled={isDeleting}
//           className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
//           aria-label="Delete address"
//         >
//           <Trash2 size={14} />
//         </button>
//       </div>
//     </button>
//   );
// }







// import { Pencil, Trash2 } from 'lucide-react';
// import type { Address } from '../types/address.types';

// interface Props {
//   address: Address;
//   isSelected: boolean;
//   onSelect: () => void;
//   onEdit: () => void;
//   onDelete: () => void;
//   isDeleting?: boolean;
// }

// export function AddressCard({
//   address,
//   isSelected,
//   onSelect,
//   onEdit,
//   onDelete,
//   isDeleting,
// }: Props) {
//   return (
//     <div
//       onClick={onSelect}
//       className={`w-full text-left p-4 rounded-xl border transition-all relative cursor-pointer ${
//         isSelected ? 'border-primary-900 bg-primary-50/30' : 'border-gray-200 hover:border-gray-300'
//       }`}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => {
//         if (e.key === 'Enter' || e.key === ' ') {
//           e.preventDefault();
//           onSelect();
//         }
//       }}
//     >
//       <p className="font-semibold text-gray-800 text-sm pr-16">
//         {address.firstName} {address.lastName}
//       </p>
//       <p className="text-xs text-gray-500 mt-0.5 pr-16">
//         {[address.address, address.landmark, address.area, address.state, address.phone]
//           .filter(Boolean)
//           .join(' | ')}
//       </p>

//       {/* Edit / Delete */}
//       <div className="absolute top-1 right-3 flex flex-col gap-1">
//         <button
//           type="button"
//           onClick={(e) => { 
//             e.stopPropagation(); 
//             onEdit(); 
//           }}
//           disabled={isDeleting}
//           className="p-1.5 text-primary-500 hover:text-primary-600 transition-colors"
//           aria-label="Edit address"
//         >
//           <Pencil size={14} />
//         </button>
//         <button
//           type="button"
//           onClick={(e) => { 
//             e.stopPropagation(); 
//             onDelete(); 
//           }}
//           disabled={isDeleting}
//           className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
//           aria-label="Delete address"
//         >
//           <Trash2 size={14} />
//         </button>
//       </div>
//     </div>
//   );
// }










// /feature/store/components/orders/AddressCard.tsx
import { MapPin } from 'lucide-react';
import { Order } from '../types/order.types';

interface AddressCardProps {
  order: Order;
}

export default function AddressCard({ order }: AddressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-1">
      <MapPin className="text-gray-400 mb-2" size={20} />
      <p className="text-gray-900 font-medium">{order.firstName} {order.lastName}</p>
      <p className="text-gray-900 leading-relaxed">
        {[order.address, order.landmark].filter(Boolean).join(', ')}, {order.area}, {order.state}
      </p>
      <p className="text-gray-900">{order.phone}</p>
    </div>
  );
}
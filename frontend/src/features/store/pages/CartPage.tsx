
// import { useMemo, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Pencil, Trash2, ShoppingCart } from 'lucide-react';
// import { SEO } from '@/shared/common/SEO';
// import { useCartStore } from '../stores/useCartStore';
// import { useProductModalStore } from '../stores/useProductModalStore';
// import { StoreCartButton } from '../components/StoreCartButton';
// import { useCartCount } from '../hooks/useCartCount';
// import { STORE_ROUTES } from '../routes';

// // ─── Confirmation dialog (lightweight, no extra dependency) ──────────────────
// interface ConfirmDialogProps {
//   isOpen: boolean;
//   count: number;
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// function ConfirmDialog({ isOpen, count, onConfirm, onCancel }: ConfirmDialogProps) {
//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
//       onClick={onCancel}
//     >
//       <div
//         className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="text-lg font-bold text-gray-900 mb-2">Delete items?</h3>
//         <p className="text-sm text-gray-500 mb-6">
//           {count === 1
//             ? 'This item will be removed from your cart.'
//             : `${count} selected items will be removed from your cart.`}{' '}
//           This action cannot be undone.
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
//           >
//             Delete
//           </button>
//           <button
//             onClick={onCancel}
//             className="flex-1 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-300 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── CartPage ─────────────────────────────────────────────────────────────────
// export function CartPage() {
//   const { items, removeItem, removeMany, updateItem } = useCartStore();
//   const openEdit = useProductModalStore((s) => s.openForEdit);
//   const cartCount = useCartCount();
//   const navigate = useNavigate();

//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [confirmDelete, setConfirmDelete] = useState<'bulk' | string | null>(null);

//   // ── Selection helpers ──────────────────────────────────────────────────────
//   const allSelected = items.length > 0 && selectedIds.size === items.length;
//   const someSelected = selectedIds.size > 0;

//   const toggleAll = () => {
//     if (allSelected) {
//       setSelectedIds(new Set());
//     } else {
//       setSelectedIds(new Set(items.map((i) => i.id)));
//     }
//   };

//   const toggleItem = (id: string) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   // ── Delete actions ─────────────────────────────────────────────────────────
//   const handleDeleteSelected = () => {
//     removeMany([...selectedIds]);
//     setSelectedIds(new Set());
//     setConfirmDelete(null);
//   };

//   const handleDeleteOne = (id: string) => {
//     removeItem(id);
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       next.delete(id);
//       return next;
//     });
//     setConfirmDelete(null);
//   };

//   // ── Quantity change directly from cart ────────────────────────────────────
//   const handleQtyChange = (id: string, qty: number) => {
//     if (qty < 1) return;
//     updateItem(id, { quantity: qty });
//   };

//   // ── Summary ────────────────────────────────────────────────────────────────
//   const { itemsTotal, breakdown } = useMemo(() => {
//     const breakdown = items.map((i) => ({
//       id: i.id,
//       name: i.productName,
//       qty: i.quantity,
//       lineTotal: i.price * i.quantity,
//     }));
//     return {
//       itemsTotal: breakdown.reduce((s, b) => s + b.qty, 0),
//       breakdown,
//     };
//   }, [items]);

//   const subtotal = useMemo(
//     () => items.reduce((s, i) => s + i.price * i.quantity, 0),
//     [items],
//   );

//   // ── Open edit modal ────────────────────────────────────────────────────────
//   const handleEdit = (itemId: string) => {
//     const cartItem = items.find((i) => i.id === itemId);
//     if (!cartItem) return;
//     // We reconstruct a minimal Product object — replace with store lookup when API is ready
//     openEdit(
//       {
//         id: cartItem.productId,
//         name: cartItem.productName,
//         category: '',
//         price: cartItem.price,
//         image: cartItem.image,
//         hasSizes: !!cartItem.size,
//         variants: [
//           {
//             color: cartItem.color ?? 'Default',
//             images: [cartItem.image],
//             sizes: [{ size: cartItem.size ?? 'One Size', stock: 99 }],
//           },
//         ],
//       },
//       cartItem,
//     );
//   };

//   // ── Confirm dialog resolved payload ───────────────────────────────────────
//   const confirmCount =
//     confirmDelete === 'bulk' ? selectedIds.size : confirmDelete ? 1 : 0;

//   const handleConfirm = () => {
//     if (confirmDelete === 'bulk') {
//       handleDeleteSelected();
//     } else if (typeof confirmDelete === 'string') {
//       handleDeleteOne(confirmDelete);
//     }
//   };

//   return (
//     <>
//       <SEO title="Cart" />

//       <div className="min-h-screen bg-[#F8F8F7]">
//         <div className="container-custom py-8 sm:py-10">

//           {/* ── Page header ───────────────────────────────────────────────── */}
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">
//               Cart{items.length > 0 ? ` (${items.length})` : ''}
//             </h1>
//             <div className="flex items-center gap-3">
//               <Link
//                 to={STORE_ROUTES.ROOT}
//                 className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-500 border border-primary-300 rounded-full px-4 py-2 hover:bg-primary-50 transition-colors"
//               >
//                 Continue Shopping
//               </Link>
//               <StoreCartButton count={cartCount} />
//             </div>
//           </div>

//           {/* ── Select-all + bulk delete bar ─────────────────────────────── */}
//           {items.length > 0 && (
//             <div className="flex items-center gap-3 mb-4">
//               <label className="flex items-center gap-2 cursor-pointer select-none">
//                 <input
//                   type="checkbox"
//                   checked={allSelected}
//                   onChange={toggleAll}
//                   className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
//                 />
//                 <span className="text-sm text-gray-600">Select all items</span>
//               </label>
//               <span className="text-gray-300">|</span>
//               <button
//                 disabled={!someSelected}
//                 onClick={() => setConfirmDelete('bulk')}
//                 className="text-sm font-semibold text-primary-500 border border-primary-300 rounded-full px-4 py-1.5 hover:bg-primary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 Delete Selected Items
//               </button>
//             </div>
//           )}

//           {/* ── Main grid ─────────────────────────────────────────────────── */}
//           <div className="grid lg:grid-cols-3 gap-6">

//             {/* LEFT: item list */}
//             <div className="lg:col-span-2 flex flex-col gap-4">
//               {items.length === 0 ? (
//                 <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
//                   <ShoppingCart className="mx-auto mb-3 text-gray-300" size={40} />
//                   <p className="text-gray-500 font-medium">Your cart is empty</p>
//                   <Link
//                     to={STORE_ROUTES.ROOT}
//                     className="inline-block mt-4 text-sm font-semibold text-primary-500 hover:underline"
//                   >
//                     Browse the store
//                   </Link>
//                 </div>
//               ) : (
//                 items.map((item) => (
//                   <div
//                     key={item.id}
//                     className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4"
//                   >
//                     {/* Checkbox */}
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.has(item.id)}
//                       onChange={() => toggleItem(item.id)}
//                       className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 shrink-0"
//                     />

//                     {/* Thumbnail */}
//                     <img
//                       src={item.image}
//                       alt={item.productName}
//                       className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover rounded-xl bg-gray-50 shrink-0"
//                     />

//                     {/* Info */}
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-gray-800 text-sm sm:text-base leading-snug">
//                         {item.productName}
//                       </p>
//                       <p className="font-bold text-gray-900 mt-0.5">
//                         ₦{item.price.toLocaleString()}
//                       </p>
//                       {(item.color || item.size) && (
//                         <p className="text-xs text-gray-400 mt-0.5">
//                           {[item.color, item.size].filter(Boolean).join('/')}
//                         </p>
//                       )}

//                       {/* Quantity stepper */}
//                       <div className="flex items-center gap-2 mt-3">
//                         <button
//                           onClick={() => handleQtyChange(item.id, item.quantity - 1)}
//                           disabled={item.quantity <= 1}
//                           className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-40 transition-colors text-base font-medium"
//                         >
//                           −
//                         </button>
//                         <span className="w-8 text-center text-sm font-semibold text-gray-800">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() => handleQtyChange(item.id, item.quantity + 1)}
//                           className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-colors text-base font-medium"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex flex-col items-end gap-2 shrink-0">
//                       <button
//                         onClick={() => handleEdit(item.id)}
//                         className="text-primary-400 hover:text-primary-600 transition-colors p-1"
//                         title="Edit item"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                       <button
//                         onClick={() => setConfirmDelete(item.id)}
//                         className="text-red-400 hover:text-red-600 transition-colors p-1"
//                         title="Remove item"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* RIGHT: sticky summary */}
//             <div className="lg:sticky lg:top-20 h-fit">
//               <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//                 <h2 className="font-bold text-gray-900 text-lg mb-4">Summary</h2>

//                 <div className="flex flex-col gap-2 text-sm">
//                   <div className="flex justify-between text-gray-500 mb-1">
//                     <span>Items Total</span>
//                     <span className="font-medium text-gray-800">{itemsTotal}</span>
//                   </div>

//                   {breakdown.map((b) => (
//                     <div key={b.id} className="flex justify-between text-gray-500">
//                       <span className="truncate max-w-[160px]">
//                         {b.name} ×{b.qty}
//                       </span>
//                       <span className="font-medium text-gray-800 shrink-0">
//                         ₦{b.lineTotal.toLocaleString()}
//                       </span>
//                     </div>
//                   ))}

//                   <hr className="border-gray-100 my-2" />

//                   <div className="flex justify-between">
//                     <span className="font-bold text-gray-900">Total Amount</span>
//                     <span className="font-bold text-gray-900 text-lg">
//                       ₦{subtotal.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 <Link
//                   to={`${STORE_ROUTES.ROOT}/checkout`}
//                   className={`block mt-5 w-full py-3.5 rounded-full bg-primary-500 text-white font-semibold text-sm text-center hover:bg-primary-600 active:scale-95 transition-all ${
//                     items.length === 0 ? 'pointer-events-none opacity-50' : ''
//                   }`}
//                 >
//                   Checkout
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete confirmation dialog */}
//       <ConfirmDialog
//         isOpen={confirmDelete !== null}
//         count={confirmCount}
//         onConfirm={handleConfirm}
//         onCancel={() => setConfirmDelete(null)}
//       />
//     </>
//   );
// }












import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, ShoppingCart } from 'lucide-react';
import { SEO } from '@/shared/common/SEO';
import { useCartStore } from '../stores/useCartStore';
import { useProductModalStore } from '../stores/useProductModalStore';
import { useProducts } from '../hooks/useProducts';
import { StoreCartButton } from '../components/StoreCartButton';
import { useCartCount } from '../hooks/useCartCount';
import { STORE_ROUTES } from '../routes';
import { ProductDetailsModal } from '../components/ProductDetailsModal';

// ─── Confirmation dialog ──────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ isOpen, count, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete items?</h3>
        <p className="text-sm text-gray-500 mb-6">
          {count === 1
            ? 'This item will be removed from your cart.'
            : `${count} selected items will be removed from your cart.`}{' '}
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CartPage ─────────────────────────────────────────────────────────────────
export function CartPage() {
  const { items, removeItem, removeMany, updateItem } = useCartStore();
  const openEdit = useProductModalStore((s) => s.openForEdit);
  const cartCount = useCartCount();
  const { products } = useProducts();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<'bulk' | string | null>(null);

  // ── Selection ──────────────────────────────────────────────────────────────
  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(items.map((i) => i.id)));
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteSelected = () => {
    removeMany([...selectedIds]);
    setSelectedIds(new Set());
    setConfirmDelete(null);
  };

  const handleDeleteOne = (id: string) => {
    removeItem(id);
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setConfirmDelete(null);
  };

  const confirmCount = confirmDelete === 'bulk' ? selectedIds.size : confirmDelete ? 1 : 0;
  const handleConfirm = () => {
    if (confirmDelete === 'bulk') handleDeleteSelected();
    else if (typeof confirmDelete === 'string') handleDeleteOne(confirmDelete);
  };

  // ── Quantity stepper in cart ───────────────────────────────────────────────
  const handleQtyChange = (id: string, qty: number) => {
    if (qty < 1) return;
    updateItem(id, { quantity: qty });
  };

  // ── Edit: look up full product from products list ─────────────────────────
  const handleEdit = (itemId: string) => {
    const cartItem = items.find((i) => i.id === itemId);
    if (!cartItem) return;
    const fullProduct = products.find((p) => p.id === cartItem.productId);
    if (!fullProduct) return;
    openEdit(fullProduct, cartItem);
  };

  // ── Summary: group by productId, show total qty per product ───────────────
  const { itemsTotal, groupedBreakdown, subtotal } = useMemo(() => {
    const groupMap = new Map<string, { name: string; qty: number; lineTotal: number }>();
    let total = 0;

    for (const item of items) {
      total += item.quantity;
      const existing = groupMap.get(item.productId);
      if (existing) {
        existing.qty += item.quantity;
        existing.lineTotal += item.price * item.quantity;
      } else {
        groupMap.set(item.productId, {
          name: item.productName,
          qty: item.quantity,
          lineTotal: item.price * item.quantity,
        });
      }
    }

    return {
      itemsTotal: total,
      groupedBreakdown: [...groupMap.values()],
      subtotal: [...groupMap.values()].reduce((s, b) => s + b.lineTotal, 0),
    };
  }, [items]);

  return (
    <>
      <SEO title="Cart" />

      <div className="min-h-screen bg-[#F8F8F7]">
        <div className="container-custom py-8 sm:py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Cart{items.length > 0 ? ` (${items.length})` : ''}
            </h1>
            <div className="flex items-center gap-3">
              <Link
                to={STORE_ROUTES.ROOT}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-500 border border-primary-300 rounded-full px-4 py-2 hover:bg-primary-50 transition-colors"
              >
                Continue Shopping
              </Link>
              <StoreCartButton count={cartCount} />
            </div>
          </div>

          {/* Select-all bar */}
          {items.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
                />
                <span className="text-sm text-gray-600">Select all items</span>
              </label>
              <span className="text-gray-300">|</span>
              <button
                disabled={!someSelected}
                onClick={() => setConfirmDelete('bulk')}
                className="text-sm font-semibold text-primary-500 border border-primary-300 rounded-full px-4 py-1.5 hover:bg-primary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete Selected Items
              </button>
            </div>
          )}

          {/* Grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT: item list */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                  <ShoppingCart className="mx-auto mb-3 text-gray-300" size={40} />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <Link
                    to={STORE_ROUTES.ROOT}
                    className="inline-block mt-4 text-sm font-semibold text-primary-500 hover:underline"
                  >
                    Browse the store
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 shrink-0"
                    />

                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover rounded-xl bg-gray-50 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base leading-snug">
                        {item.productName}
                      </p>
                      <p className="font-bold text-gray-900 mt-0.5">
                        ₦{item.price.toLocaleString()}
                      </p>
                      {(item.color || item.size) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[item.color, item.size].filter(Boolean).join('/')}
                        </p>
                      )}

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-40 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-primary-400 hover:text-primary-600 transition-colors p-1"
                        title="Edit item"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT: sticky summary */}
            <div className="lg:sticky lg:top-20 h-fit">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Summary</h2>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-gray-500 mb-1">
                    <span>Items Total</span>
                    <span className="font-medium text-gray-800">{itemsTotal}</span>
                  </div>

                  {/* Grouped by product — all variants of same product counted together */}
                  {groupedBreakdown.map((b, i) => (
                    <div key={i} className="flex justify-between text-gray-500">
                      <span className="truncate max-w-[160px]">
                        {b.name} ×{b.qty}
                      </span>
                      <span className="font-medium text-gray-800 shrink-0">
                        ₦{b.lineTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <hr className="border-gray-100 my-2" />

                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-bold text-gray-900 text-lg">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  to={`${STORE_ROUTES.ROOT}/checkout`}
                  className={`block mt-5 w-full py-3.5 rounded-full bg-primary-500 text-white font-semibold text-sm text-center hover:bg-primary-600 active:scale-95 transition-all ${
                    items.length === 0 ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      <ConfirmDialog
        isOpen={confirmDelete !== null}
        count={confirmCount}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Product modal (edit mode from cart) */}
      <ProductDetailsModal />
    </>
  );
}
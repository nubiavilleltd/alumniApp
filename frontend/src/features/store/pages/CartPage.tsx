import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { SEO } from '@/shared/common/SEO';
import { useCart } from '../hooks/useCart';
import { useCartStore } from '../stores/useCartStore';
import { useProductModalStore } from '../stores/useProductModalStore';
import { useProducts } from '../hooks/useProducts';
import { StoreCartButton } from '../components/StoreCartButton';
import { useCartCount } from '../hooks/useCartCount';
import { STORE_ROUTES } from '../routes';
import { ProductDetailsModal } from '../components/ProductDetailsModal';

import { useAuth } from '@/features/authentication/hooks/useAuth';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { toast } from '@/shared/components/ui/Toast';

// ─── Confirm dialog ───────────────────────────────────────────────────────────

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

// ─── Per-item qty stepper ─────────────────────────────────────────────────────

interface CartQtyStepperProps {
  itemId: string;
  quantity: number;
  stockCap: number;
  onUpdate: (id: string, qty: number) => void;
}

function CartQtyStepper({ itemId, quantity, stockCap, onUpdate }: CartQtyStepperProps) {
  const [inputVal, setInputVal] = useState(String(quantity));

  useEffect(() => {
    setInputVal(String(quantity));
  }, [quantity]);

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 1) {
      onUpdate(itemId, 1);
      setInputVal('1');
    } else {
      const clamped = Math.min(parsed, stockCap);
      onUpdate(itemId, clamped);
      setInputVal(String(clamped));
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={() => onUpdate(itemId, Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={15} />
      </button>
      <input
        type="number"
        min={1}
        max={stockCap}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit(inputVal);
        }}
        className="w-10 h-8 text-center border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onUpdate(itemId, Math.min(stockCap, quantity + 1))}
        disabled={quantity >= stockCap}
        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

// ─── CartPage ─────────────────────────────────────────────────────────────────

export function CartPage() {
  const { items, syncStatus, updateItem, removeItem, removeMany } = useCart();
  const storeItems = useCartStore((s) => s.items);
  const openEdit = useProductModalStore((s) => s.openForEdit);
  const cartCount = useCartCount();
  const { products } = useProducts();
  const { isAuthenticated } = useAuth();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<'bulk' | string | null>(null);

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(items.map((i) => i.id)));

  const toggleItem = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleDeleteSelected = async () => {
    try {
      await removeMany([...selectedIds]);
      toast.success('Selected items removed from cart');
      setSelectedIds(new Set());
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove selected items from cart');
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      await removeItem(id);
      toast.success('Item removed from cart');
      setSelectedIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove item from cart');
    }
  };

  const confirmCount = confirmDelete === 'bulk' ? selectedIds.size : confirmDelete ? 1 : 0;
  const handleConfirm = () => {
    if (confirmDelete === 'bulk') void handleDeleteSelected();
    else if (typeof confirmDelete === 'string') void handleDeleteOne(confirmDelete);
  };

  const getRawStock = (item: (typeof items)[0]): number => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return 99;
    const variant = product.variants.find((v) => v.color === item.color) ?? product.variants[0];
    if (!product.hasSizes) return variant?.sizes[0]?.stock ?? 99;
    return variant?.sizes.find((s) => s.size === item.size)?.stock ?? 99;
  };

  const hasOverstockedItems = items.some((item) => item.quantity > getRawStock(item));

  const handleEdit = (itemId: string) => {
    const cartItem = items.find((i) => i.id === itemId);
    if (!cartItem) return;
    const fullProduct = products.find((p) => p.id === cartItem.productId);
    if (!fullProduct) return;
    openEdit(fullProduct, cartItem);
  };

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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Cart{items.length > 0 ? ` (${items.length})` : ''}
              </h1>
              {syncStatus === 'syncing' && (
                <span className="text-xs text-gray-400 font-medium animate-pulse">Saving...</span>
              )}
              {syncStatus === 'error' && (
                <span className="text-xs text-red-400 font-medium">Sync failed</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={STORE_ROUTES.ROOT}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-500 border border-primary-500 rounded-full px-4 py-2 hover:bg-primary-50 transition-colors"
              >
                Continue Shopping
              </Link>
              <StoreCartButton count={cartCount} />
            </div>
          </div>

          {/* Overstock warning */}
          {hasOverstockedItems && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              ⚠️ Some items exceed available stock. Please reduce their quantity before checking
              out.
            </div>
          )}

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
                className="text-sm font-semibold text-primary-500 border border-primary-500 rounded-full px-4 py-1.5 hover:bg-primary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete Selected Items
              </button>
            </div>
          )}

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
                items.map((item) => {
                  const stockCap = getRawStock(item);
                  const isOverStock = item.quantity > stockCap;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border p-4 flex flex-col ${isOverStock ? 'border-amber-300' : 'border-gray-100'}`}
                    >
                      <div className="flex items-start gap-2">
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
                          {isOverStock && (
                            <p className="text-xs text-amber-600 mt-1">
                              Only {stockCap} available — please reduce quantity
                            </p>
                          )}
                        </div>
                        <div className="flex items-end gap-2 shrink-0">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-primary-500 hover:text-primary-600 transition-colors p-1"
                            title="Edit item"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(item.id)}
                            className="text-red-500 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <CartQtyStepper
                          itemId={item.id}
                          quantity={item.quantity}
                          stockCap={stockCap}
                          onUpdate={(id, qty) => void updateItem(id, qty)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* RIGHT: sticky summary */}
            <div className="lg:sticky lg:top-20 h-fit">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Summary</h2>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between font-medium text-gray-800 mb-1">
                    <span>Items Total</span>
                    <span className="font-medium text-gray-800">{itemsTotal}</span>
                  </div>
                  {groupedBreakdown.map((b, i) => (
                    <div key={i} className="flex justify-between text-gray-500 gap-2">
                      <div className="flex gap-2 font-medium text-gray-800 shrink-0 whitespace-nowrap">
                        <span className="truncate min-w-0">{b.name}</span>
                        <span>×{b.qty}</span>
                      </div>
                      <span className="font-medium text-gray-800 shrink-0 whitespace-nowrap">
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
                  to={isAuthenticated ? `${STORE_ROUTES.ROOT}/checkout` : AUTH_ROUTES.LOGIN}
                  state={!isAuthenticated ? { from: `${STORE_ROUTES.ROOT}/checkout` } : undefined}
                  className={`block mt-5 w-full py-3.5 rounded-full bg-primary-500 text-white font-semibold text-sm text-center hover:bg-primary-600 active:scale-95 transition-all ${
                    items.length === 0 || hasOverstockedItems
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }`}
                >
                  Checkout
                </Link>
                {hasOverstockedItems && (
                  <p className="text-xs text-amber-600 text-center mt-2">
                    Resolve stock issues above to proceed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        count={confirmCount}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
      <ProductDetailsModal />
    </>
  );
}

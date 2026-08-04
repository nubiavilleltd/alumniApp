import clsx from "clsx";

// /feature/store/components/orders/OrderSummaryCard.tsx
interface OrderSummaryCardProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  className?:string;
}

export default function OrderSummaryCard({ subtotal, shippingFee, total, className }: OrderSummaryCardProps) {
  return (
    <div className={clsx("bg-white rounded-2xl p-6 flex flex-col gap-3", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-gray-900">Subtotal</span>
        <span className="text-gray-900">₦{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-gray-900">Shipping Fee</span>
        <span className="text-gray-900">₦{shippingFee.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-base pt-2 border-t border-gray-100">
        <span className="font-bold text-gray-900">Total Amount</span>
        <span className="font-bold text-gray-900">₦{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
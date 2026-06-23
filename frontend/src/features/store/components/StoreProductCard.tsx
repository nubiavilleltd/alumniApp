import { Product } from '../types/store.types';

interface Props {
  product: Product;
}

export function StoreProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image area - fixed height ensures all cards are equal */}
      <div className="relative h-[200px] sm:h-[240px] lg:h-[280px]">
        <span className="absolute top-3 left-3 z-10 bg-[#3393E6] text-white text-xs font-medium px-3 py-1 rounded-full">
          {product.category}
        </span>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info row */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-[#374151] leading-snug">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-[#111827] whitespace-nowrap">
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
import { Pencil, Trash2 } from 'lucide-react';
import { AdminApiProduct } from '../types/adminstore.types';

interface Props {
  product: AdminApiProduct;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function AdminStoreProductCard({ product, onEdit, onDelete, isDeleting }: Props) {
  const spotlightImage =
    product.images.find((img) => img.is_spotlight)?.image_url ??
    product.images[0]?.image_url ??
    '';

  const price = parseFloat(product.price);

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative h-[200px] sm:h-[220px]">
        <span className="absolute top-3 left-3 z-10 bg-[#3393E6] text-white text-xs font-medium px-3 py-1 rounded-full">
          {product.category}
        </span>
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          <button
            onClick={onEdit}
            disabled={isDeleting}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary-500 hover:bg-primary-50 hover:text-primary-600 transition-colors shadow-sm disabled:opacity-50"
            title="Edit product"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm disabled:opacity-50"
            title="Delete product"
          >
            <Trash2 size={14} />
          </button>
        </div>
        {spotlightImage ? (
          <img
            src={spotlightImage}
            alt={product.product_name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-[#374151] leading-snug line-clamp-2">
          {product.product_name}
        </h3>
        <p className="text-lg font-bold text-[#111827] whitespace-nowrap">
          ₦{price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
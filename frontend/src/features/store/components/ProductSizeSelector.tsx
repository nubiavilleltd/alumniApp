import type { ProductSize } from '../types/product.types';

interface Props {
  sizes: ProductSize[];
  selected: string;
  onChange: (size: string) => void;
}

export function ProductSizeSelector({ sizes, selected, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-2">
        Size: <span className="font-bold">{selected}</span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((s) => {
          const isOutOfStock = s.stock <= 0;
          const isSelected = s.size === selected;

          return (
            <button
              key={s.size}
              disabled={isOutOfStock}
              onClick={() => !isOutOfStock && onChange(s.size)}
              className={[
                'min-w-[44px] h-[44px] px-3 rounded-lg text-sm font-medium transition-all',
                isOutOfStock
                  ? 'border-2 border-dashed border-gray-300 text-gray-300 cursor-not-allowed'
                  : isSelected
                    ? 'border-2 border-primary-500 bg-primary-500 text-white shadow-sm'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-500',
              ].join(' ')}
            >
              {s.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
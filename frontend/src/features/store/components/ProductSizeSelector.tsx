import type { ProductSize } from '../types/product.types';

interface Props {
  sizes: ProductSize[];
  selected: string;
  onChange: (size: string) => void;
}

// const sizeToTextMap: Record<string, string> =  {
//     "S": "Small",
//     "M": "Medium",
//     "L": "Large",
//     "XL": "Extra Large",
// }

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
                'min-w-[30px] h-[30px] px-5 rounded-lg text-sm font-medium transition-all',
                isOutOfStock
                  ? 'border border-dashed border-gray-300 text-gray-300 cursor-not-allowed'
                  : isSelected
                    ? 'border border-primary-500 text-primary-500 shadow-sm'
                    : 'border border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-500',
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
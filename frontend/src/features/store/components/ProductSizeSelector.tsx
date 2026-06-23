import type { ProductSize } from '../types/product.types';

interface Props {
  sizes: ProductSize[];
  selected: string;
  onChange: (size: string) => void;
}

export function ProductSizeSelector({
  sizes,
  selected,
  onChange,
}: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {sizes.map((s) => {
        const disabled = s.stock <= 0;

        return (
          <button
            key={s.size}
            disabled={disabled}
            onClick={() => onChange(s.size)}
            className={`px-3 py-1 rounded border text-sm transition ${
              disabled
                ? 'opacity-40 border-dashed cursor-not-allowed'
                : selected === s.size
                ? 'bg-primary-500 text-white border-primary-500'
                : 'border-gray-300'
            }`}
          >
            {s.size}
          </button>
        );
      })}
    </div>
  );
}
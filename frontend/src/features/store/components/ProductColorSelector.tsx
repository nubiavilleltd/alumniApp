import type { ProductVariant } from '../types/product.types';

interface Props {
  variants: ProductVariant[];
  selected: string;
  onChange: (color: string) => void;
}

export function ProductColorSelector({
  variants,
  selected,
  onChange,
}: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {variants.map((v) => (
        <button
          key={v.color}
          onClick={() => onChange(v.color)}
          className={`px-3 py-1 rounded-full border text-sm ${
            selected === v.color
              ? 'bg-primary-500 text-white border-primary-500'
              : 'border-gray-300'
          }`}
        >
          {v.color}
        </button>
      ))}
    </div>
  );
}
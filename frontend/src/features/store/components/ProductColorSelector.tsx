import type { ProductVariant } from '../types/product.types';

interface Props {
  variants: ProductVariant[];
  selected: string;
  onChange: (color: string) => void;
}

export function ProductColorSelector({ variants, selected, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-2">
        Colour: <span className="font-bold">{selected}</span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => {
          const isSelected = v.color === selected;
          const thumbnail = v.images[0];

          return (
            <button
              key={v.color}
              onClick={() => onChange(v.color)}
              title={v.color}
              className={`w-[56px] h-[56px] rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 opacity-75 hover:opacity-100 hover:border-gray-400'
              }`}
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={v.color}
                  className="w-full h-full object-cover"
                />
              ) : (
                // Fallback: colour swatch circle
                <span
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: v.colorHex ?? '#ccc' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
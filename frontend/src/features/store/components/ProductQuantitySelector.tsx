interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function ProductQuantitySelector({
  value,
  max,
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="px-3 py-1 border rounded"
      >
        -
      </button>

      <input
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v <= max) onChange(v);
        }}
        className="w-14 text-center border rounded"
      />

      <button
        onClick={() =>
          onChange(Math.min(max, value + 1))
        }
        className="px-3 py-1 border rounded"
      >
        +
      </button>
    </div>
  );
}
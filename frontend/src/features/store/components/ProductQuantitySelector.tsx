// interface Props {
//   value: number;
//   max: number;
//   onChange: (value: number) => void;
// }

// export function ProductQuantitySelector({
//   value,
//   max,
//   onChange,
// }: Props) {
//   return (
//     <div className="flex items-center gap-2">
//       <button
//         onClick={() => onChange(Math.max(1, value - 1))}
//         className="px-3 py-1 border rounded"
//       >
//         -
//       </button>

//       <input
//         value={value}
//         onChange={(e) => {
//           const v = Number(e.target.value);
//           if (v <= max) onChange(v);
//         }}
//         className="w-14 text-center border rounded"
//       />

//       <button
//         onClick={() =>
//           onChange(Math.min(max, value + 1))
//         }
//         className="px-3 py-1 border rounded"
//       >
//         +
//       </button>
//     </div>
//   );
// }







interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function ProductQuantitySelector({ value, max, onChange }: Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(1);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onChange(Math.max(1, Math.min(parsed, max)));
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-2">Quantity</p>
      <div className="flex items-center gap-3">
        {/* Decrement */}
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-400 hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          −
        </button>

        {/* Current value input */}
        <input
          type="number"
          min={1}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="w-14 h-9 text-center border-2 border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* Increment */}
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-400 hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          +
        </button>
      </div>

      {/* Stock count hint */}
      {max > 0 && max <= 15 && (
        <p className="text-xs text-gray-500 mt-1.5">Only {max} left</p>
      )}
      {max === 0 && (
        <p className="text-xs text-red-500 mt-1.5">Out of stock</p>
      )}
    </div>
  );
}
import { Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  value: number;
  max: number;
  rawStock?: number;
  onChange: (value: number) => void;
}

export function ProductQuantitySelector({ value, max, rawStock, onChange }: Props) {
  const stockForHint = rawStock ?? max;

  // Local string state so the user can freely type without being interrupted
  const [inputVal, setInputVal] = useState(String(value));

  // Keep local state in sync when value changes externally (e.g. colour/size switch)
  useEffect(() => {
    setInputVal(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 1) {
      onChange(1);
      setInputVal('1');
    } else {
      const clamped = Math.min(parsed, max);
      onChange(clamped);
      setInputVal(String(clamped));
    }
  };

  const decrement = () => {
    const next = Math.max(1, value - 1);
    onChange(next);
    setInputVal(String(next));
  };

  const increment = () => {
    const next = Math.min(max, value + 1);
    onChange(next);
    setInputVal(String(next));
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-2">Quantity</p>
      <div className="flex items-center gap-3">
        {/* Decrement */}
        <button
          onClick={decrement}
          disabled={value <= 1}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-400 hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        ><Minus /></button>

        {/* Input — free typing, committed on blur or Enter */}
        <input
          type="number"
          min={1}
          max={max}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(inputVal); }}
          className="w-14 h-9 text-center border-2 border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* Increment */}
        <button
          onClick={increment}
          disabled={value >= max}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-400 hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        ><Plus /></button>
      </div>

      {stockForHint > 0 && (
        <p className="text-xs text-gray-500 mt-1.5">Only {stockForHint} left</p>
      )}
    </div>
  );
}
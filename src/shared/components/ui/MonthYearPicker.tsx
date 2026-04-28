import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
};

export function MonthYearPicker({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const [tempYear, setTempYear] = useState(value.getFullYear());
  const [focusedMonth, setFocusedMonth] = useState(value.getMonth());

  const ref = useRef<HTMLDivElement | null>(null);

  // ─── Close on outside click ─────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // ─── Keyboard navigation ────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return;

      if (e.key === 'Escape') setOpen(false);

      if (e.key === 'ArrowRight') setFocusedMonth((m) => (m + 1) % 12);
      if (e.key === 'ArrowLeft') setFocusedMonth((m) => (m - 1 + 12) % 12);
      if (e.key === 'ArrowDown') setFocusedMonth((m) => (m + 3) % 12);
      if (e.key === 'ArrowUp') setFocusedMonth((m) => (m - 3 + 12) % 12);

      if (e.key === 'Enter') {
        onChange(new Date(tempYear, focusedMonth, 1));
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, focusedMonth, tempYear, onChange]);

  const handleSelect = (monthIndex: number) => {
    onChange(new Date(tempYear, monthIndex, 1));
    setFocusedMonth(monthIndex);
    setOpen(false);
  };

  const goToToday = () => {
    const now = new Date();
    setTempYear(now.getFullYear());
    setFocusedMonth(now.getMonth());
    onChange(new Date(now.getFullYear(), now.getMonth(), 1));
    setOpen(false);
  };

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="font-bold text-gray-900 text-lg flex items-center gap-1"
      >
        {MONTH_NAMES[value.getMonth()]} {value.getFullYear()}
        <Icon icon="mdi:chevron-down" className="w-5 h-5 text-gray-400" />
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute z-50 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3
          origin-top transition-all duration-200
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {/* Year selector */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setTempYear((y) => y - 1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Icon icon="mdi:chevron-left" />
          </button>

          <span className="font-semibold">{tempYear}</span>

          <button
            onClick={() => setTempYear((y) => y + 1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>

        {/* Months */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {MONTH_NAMES.map((month, idx) => {
            const isSelected = value.getMonth() === idx && value.getFullYear() === tempYear;

            const isFocused = focusedMonth === idx;

            return (
              <button
                key={month}
                onClick={() => handleSelect(idx)}
                className={`
                  text-xs py-2 rounded-lg transition
                  ${isSelected ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
                  ${isFocused ? 'ring-2 ring-primary-300' : ''}
                `}
              >
                {month.slice(0, 3)}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <button
          onClick={goToToday}
          className="w-full text-xs font-semibold py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
        >
          Go to Today
        </button>
      </div>
    </div>
  );
}

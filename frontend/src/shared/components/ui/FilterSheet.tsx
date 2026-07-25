import { useState } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface FilterSheetOption {
  label: string;
  value: string;
}

interface FilterSheetProps {
  /** Currently selected value */
  value: string;
  /** Called when an option is selected */
  onChange: (value: string) => void;
  /** Options to choose from */
  options: FilterSheetOption[];
  /** Shown on the trigger button when nothing is selected */
  placeholder?: string;
  /** Sheet header title */
  title?: string;
  /** Optional className for the trigger button */
  className?: string;
}

export function FilterSheet({
  value,
  onChange,
  options,
  placeholder = 'Filter',
  title = 'Filter',
  className = '',
}: FilterSheetProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex w-full items-center justify-between gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 ${className}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl max-h-[70vh] overflow-y-auto p-4 pb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-semibold text-gray-900">{title}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isActive && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
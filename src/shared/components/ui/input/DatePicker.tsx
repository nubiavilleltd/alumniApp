// shared/components/ui/input/DatePicker.tsx
//
// Drop-in replacement for <FormInput type="date" />.
// Outputs value as "YYYY-MM-DD" — same format RHF + Zod expect.
//
// Usage (RHF controlled):
//   <DatePicker
//     label="Event Date"
//     id="event_date"
//     required
//     min={new Date().toISOString().split('T')[0]}
//     error={errors.event_date?.message}
//     value={watch('event_date')}
//     onValueChange={(val) => setValue('event_date', val)}
//   />

import { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DatePickerProps {
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  /** Controlled value — "YYYY-MM-DD" */
  value?: string;
  /** Called with "YYYY-MM-DD" whenever the user picks a date */
  onValueChange?: (value: string) => void;
  /** Minimum selectable date as "YYYY-MM-DD" */
  min?: string;
  /** Maximum selectable date as "YYYY-MM-DD" */
  max?: string;
  placeholder?: string;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
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

function parseDate(str: string | undefined): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(str: string | undefined): string {
  if (!str) return '';
  const d = parseDate(str);
  if (!d) return str;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function startDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DatePicker({
  label,
  id,
  name,
  required,
  disabled,
  error,
  hint,
  value,
  onValueChange,
  min,
  max,
  placeholder = 'Select date',
  className = '',
}: DatePickerProps) {
  const inputId = id ?? name;

  // Calendar view state
  const today = new Date();
  const selected = parseDate(value);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync view when value changes externally
  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const minDate = parseDate(min);
  const maxDate = parseDate(max);

  const isDisabledDay = useCallback(
    (year: number, month: number, day: number): boolean => {
      const d = new Date(year, month, day);
      if (minDate && d < minDate) return true;
      if (maxDate && d > maxDate) return true;
      return false;
    },
    [min, max],
  );

  const selectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    onValueChange?.(toISO(date));
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  // Build calendar grid
  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = startDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day: number) =>
    selected &&
    day === selected.getDate() &&
    viewMonth === selected.getMonth() &&
    viewYear === selected.getFullYear();

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        id={inputId}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={[
          'flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left',
          'bg-white border rounded-3xl shadow-sm transition-colors outline-none',
          error
            ? 'border-red-400 focus:border-red-400'
            : open
              ? 'border-primary-400'
              : 'border-gray-200 hover:border-gray-300',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer',
        ].join(' ')}
      >
        <Icon icon="mdi:calendar-outline" className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className={`flex-1 ${value ? 'text-gray-700' : 'text-gray-400'}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Icon
          icon="mdi:chevron-down"
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div
          className="absolute top-full mt-1 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
          style={{ minWidth: '280px', left: 0 }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-2 pb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const disabled = isDisabledDay(viewYear, viewMonth, day);
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={[
                    'w-8 h-8 mx-auto flex items-center justify-center text-sm rounded-full transition-colors',
                    sel
                      ? 'bg-primary-500 text-white font-semibold'
                      : tod
                        ? 'border border-primary-400 text-primary-600 font-semibold hover:bg-primary-50'
                        : disabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick: today button */}
          {!isDisabledDay(today.getFullYear(), today.getMonth(), today.getDate()) && (
            <div className="border-t border-gray-100 px-4 py-2">
              <button
                type="button"
                onClick={() => {
                  setViewYear(today.getFullYear());
                  setViewMonth(today.getMonth());
                  onValueChange?.(toISO(today));
                  setOpen(false);
                }}
                className="text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors"
              >
                Today
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error / hint */}
      {error ? (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

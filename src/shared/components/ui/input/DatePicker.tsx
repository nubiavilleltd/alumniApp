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
  labelClassName?: string;
  inputClassName?: string;
}

type DropdownPlacement = {
  horizontal: 'left' | 'right';
  vertical: 'bottom' | 'top';
};

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
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Number of years shown per page in the year-picker grid */
const YEARS_PER_PAGE = 12;

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
  labelClassName = '',
  inputClassName = '',
}: DatePickerProps) {
  const inputId = id ?? name;

  // Calendar view state
  const today = new Date();
  const selected = parseDate(value);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());
  const [open, setOpen] = useState(false);

  /**
   * 'days'   — the normal day-grid calendar (default)
   * 'months' — 3×4 month grid for the current viewYear
   * 'years'  — paginated year grid
   */
  type CalendarView = 'days' | 'months' | 'years';
  const [calView, setCalView] = useState<CalendarView>('days');

  /**
   * The first year shown in the current year-picker page.
   * Always snaps to a multiple of YEARS_PER_PAGE for consistency.
   */
  const [yearPageStart, setYearPageStart] = useState<number>(
    () =>
      Math.floor((selected?.getFullYear() ?? today.getFullYear()) / YEARS_PER_PAGE) *
      YEARS_PER_PAGE,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPlacement, setDropdownPlacement] = useState<DropdownPlacement>({
    horizontal: 'left',
    vertical: 'bottom',
  });

  // Sync view when value changes externally
  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  }, [value]);

  // Reset to day-view whenever the dropdown closes
  useEffect(() => {
    if (!open) setCalView('days');
  }, [open]);

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

  const updateDropdownPlacement = useCallback(() => {
    if (!open || typeof window === 'undefined' || !containerRef.current || !dropdownRef.current) {
      return;
    }

    const margin = 16;
    const gap = 4;
    const containerRect = containerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    const horizontal =
      containerRect.left + dropdownRect.width > window.innerWidth - margin ? 'right' : 'left';

    const canOpenAbove = containerRect.top - gap - dropdownRect.height >= margin;
    const needsOpenAbove =
      containerRect.bottom + gap + dropdownRect.height > window.innerHeight - margin;
    const vertical = needsOpenAbove && canOpenAbove ? 'top' : 'bottom';

    setDropdownPlacement((current) => {
      if (current.horizontal === horizontal && current.vertical === vertical) {
        return current;
      }

      return { horizontal, vertical };
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const rafId = window.requestAnimationFrame(updateDropdownPlacement);
    window.addEventListener('resize', updateDropdownPlacement);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateDropdownPlacement);
    };
  }, [open, calView, viewMonth, viewYear, updateDropdownPlacement]);

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

  /** True when every day in a given month is outside the min/max range */
  const isMonthDisabled = useCallback(
    (year: number, month: number): boolean => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      if (minDate && lastDay < minDate) return true;
      if (maxDate && firstDay > maxDate) return true;
      return false;
    },
    [min, max],
  );

  /** True when every day in a given year is outside the min/max range */
  const isYearDisabled = useCallback(
    (year: number): boolean => {
      if (minDate && year < minDate.getFullYear()) return true;
      if (maxDate && year > maxDate.getFullYear()) return true;
      return false;
    },
    [min, max],
  );

  const selectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    onValueChange?.(toISO(date));
    setOpen(false);
  };

  // ── Day-view navigation ──────────────────────────────────────────────────

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

  // ── Month-view handlers ──────────────────────────────────────────────────

  const selectMonth = (monthIndex: number) => {
    setViewMonth(monthIndex);
    setCalView('days');
  };

  // ── Year-view handlers ───────────────────────────────────────────────────

  const selectYear = (year: number) => {
    setViewYear(year);
    setCalView('months'); // go straight to month picker after choosing a year
  };

  const prevYearPage = () => setYearPageStart((s) => s - YEARS_PER_PAGE);
  const nextYearPage = () => setYearPageStart((s) => s + YEARS_PER_PAGE);

  // ── Header click: cycle day → year (skip months, land on year grid first) ─

  const handleHeaderClick = () => {
    if (calView === 'days') {
      // Align year-page to the currently viewed year before opening
      setYearPageStart(Math.floor(viewYear / YEARS_PER_PAGE) * YEARS_PER_PAGE);
      setCalView('years');
    } else if (calView === 'years') {
      setCalView('months');
    } else {
      setCalView('days');
    }
  };

  // ── Build day-grid cells ─────────────────────────────────────────────────

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = startDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day: number) =>
    selected &&
    day === selected.getDate() &&
    viewMonth === selected.getMonth() &&
    viewYear === selected.getFullYear();

  // ── Year grid cells ──────────────────────────────────────────────────────

  const yearCells = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i);

  // ─── Header label for each view ──────────────────────────────────────────

  const headerLabel = (() => {
    if (calView === 'years') {
      return `${yearPageStart} – ${yearPageStart + YEARS_PER_PAGE - 1}`;
    }
    if (calView === 'months') {
      return `${viewYear}`;
    }
    return `${MONTHS[viewMonth]} ${viewYear}`;
  })();

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
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
          inputClassName,
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
          ref={dropdownRef}
          className="absolute z-[60] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          style={{
            minWidth: '280px',
            width: 'min(280px, calc(100vw - 2rem))',
            ...(dropdownPlacement.horizontal === 'left' ? { left: 0 } : { right: 0 }),
            ...(dropdownPlacement.vertical === 'bottom'
              ? { top: 'calc(100% + 0.25rem)' }
              : { bottom: 'calc(100% + 0.25rem)' }),
          }}
        >
          {/* ── Shared header ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            {/* Prev arrow */}
            <button
              type="button"
              onClick={
                calView === 'years'
                  ? prevYearPage
                  : calView === 'months'
                    ? () => setViewYear((y) => y - 1)
                    : prevMonth
              }
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4 text-gray-600" />
            </button>

            {/* Clickable Month/Year label — opens year/month picker */}
            <button
              type="button"
              onClick={handleHeaderClick}
              className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors rounded px-1"
              title={
                calView === 'days'
                  ? 'Click to pick a year'
                  : calView === 'years'
                    ? 'Click to pick a month'
                    : 'Click to go back to calendar'
              }
            >
              {headerLabel}
              <Icon icon="mdi:unfold-more-horizontal" className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Next arrow */}
            <button
              type="button"
              onClick={
                calView === 'years'
                  ? nextYearPage
                  : calView === 'months'
                    ? () => setViewYear((y) => y + 1)
                    : nextMonth
              }
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* ── Year picker ── */}
          {calView === 'years' && (
            <div className="grid grid-cols-3 gap-1 p-3">
              {yearCells.map((year) => {
                const isCurrentYear = year === today.getFullYear();
                const isSelectedYear = year === viewYear;
                const yearDisabled = isYearDisabled(year);
                return (
                  <button
                    key={year}
                    type="button"
                    disabled={yearDisabled}
                    onClick={() => !yearDisabled && selectYear(year)}
                    className={[
                      'py-1.5 rounded-lg text-sm transition-colors font-medium',
                      isSelectedYear
                        ? 'bg-primary-500 text-white'
                        : isCurrentYear
                          ? 'border border-primary-400 text-primary-600 hover:bg-primary-50'
                          : yearDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100',
                    ].join(' ')}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Month picker ── */}
          {calView === 'months' && (
            <div className="grid grid-cols-3 gap-1 p-3">
              {MONTHS_SHORT.map((month, idx) => {
                const isCurrentMonth = idx === today.getMonth() && viewYear === today.getFullYear();
                const isSelectedMonth =
                  idx === viewMonth && (selected ? viewYear === selected.getFullYear() : false);
                const monthDisabled = isMonthDisabled(viewYear, idx);
                return (
                  <button
                    key={month}
                    type="button"
                    disabled={monthDisabled}
                    onClick={() => !monthDisabled && selectMonth(idx)}
                    className={[
                      'py-1.5 rounded-lg text-sm transition-colors font-medium',
                      isSelectedMonth
                        ? 'bg-primary-500 text-white'
                        : isCurrentMonth
                          ? 'border border-primary-400 text-primary-600 hover:bg-primary-50'
                          : monthDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100',
                    ].join(' ')}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Day picker (original) ── */}
          {calView === 'days' && (
            <>
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
                  const dayDisabled = isDisabledDay(viewYear, viewMonth, day);
                  const sel = isSelected(day);
                  const tod = isToday(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={dayDisabled}
                      onClick={() => selectDay(day)}
                      className={[
                        'w-8 h-8 mx-auto flex items-center justify-center text-sm rounded-full transition-colors',
                        sel
                          ? 'bg-primary-500 text-white font-semibold'
                          : tod
                            ? 'border border-primary-400 text-primary-600 font-semibold hover:bg-primary-50'
                            : dayDisabled
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
            </>
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

// shared/components/ui/input/TimePicker.tsx
//
// Drop-in replacement for <FormInput type="time" />.
// Outputs value as "HH:MM" (24-hour) — same format RHF + Zod expect.
//
// Usage (RHF controlled):
//   <TimePicker
//     label="Start Time"
//     id="start_time"
//     error={errors.start_time?.message}
//     value={watch('start_time')}
//     onValueChange={(val) => setValue('start_time', val)}
//   />

import { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimePickerProps {
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  /** Controlled value — "HH:MM" 24-hour */
  value?: string;
  /** Called with "HH:MM" whenever the user confirms */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Step in minutes for the minute column (default: 5) */
  minuteStep?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTime(str: string | undefined): { h: number; m: number } | null {
  if (!str) return null;
  const [h, m] = str.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return { h, m };
}

function formatDisplay(str: string | undefined): string {
  if (!str) return '';
  const t = parseTime(str);
  if (!t) return str;
  const period = t.h >= 12 ? 'PM' : 'AM';
  const hour = t.h % 12 === 0 ? 12 : t.h % 12;
  return `${String(hour).padStart(2, '0')}:${String(t.m).padStart(2, '0')} ${period}`;
}

function toHHMM(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ─── Scroll-snapping column ────────────────────────────────────────────────────

function Column({
  items,
  selected,
  onSelect,
  format,
}: {
  items: number[];
  selected: number;
  onSelect: (val: number) => void;
  format: (n: number) => string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const ITEM_H = 36;

  // Scroll selected item into centre on open / change
  useEffect(() => {
    const idx = items.indexOf(selected);
    if (idx === -1 || !listRef.current) return;
    listRef.current.scrollTo({ top: idx * ITEM_H - ITEM_H * 2, behavior: 'smooth' });
  }, [selected, items]);

  return (
    <div
      ref={listRef}
      className="flex flex-col overflow-y-auto"
      style={{ height: ITEM_H * 5, scrollbarWidth: 'none' }}
    >
      {/* Top padding so first item can be centred */}
      <div style={{ height: ITEM_H * 2, flexShrink: 0 }} />
      {items.map((val) => (
        <button
          key={val}
          type="button"
          onClick={() => onSelect(val)}
          style={{ height: ITEM_H, minHeight: ITEM_H }}
          className={[
            'flex items-center justify-center text-sm font-medium rounded-xl mx-1 transition-colors flex-shrink-0',
            val === selected ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100',
          ].join(' ')}
        >
          {format(val)}
        </button>
      ))}
      {/* Bottom padding */}
      <div style={{ height: ITEM_H * 2, flexShrink: 0 }} />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TimePicker({
  label,
  id,
  name,
  required,
  disabled,
  error,
  hint,
  value,
  onValueChange,
  placeholder = 'Select time',
  className = '',
  minuteStep = 5,
}: TimePickerProps) {
  const inputId = id ?? name;
  const parsed = parseTime(value);

  const now = new Date();
  const [localH, setLocalH] = useState(parsed?.h ?? now.getHours());
  const [localM, setLocalM] = useState(parsed?.m ?? 0);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local state when value changes externally
  useEffect(() => {
    if (parsed) {
      setLocalH(parsed.h);
      setLocalM(parsed.m);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // Commit on close
        onValueChange?.(toHHMM(localH, localM));
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, localH, localM]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  const confirm = () => {
    onValueChange?.(toHHMM(localH, localM));
    setOpen(false);
  };

  const clear = () => {
    onValueChange?.('');
    setOpen(false);
  };

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
        <Icon icon="mdi:clock-outline" className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className={`flex-1 ${value ? 'text-gray-700' : 'text-gray-400'}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
          </button>
        )}
        <Icon
          icon="mdi:chevron-down"
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full mt-1 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
          style={{ minWidth: '200px', left: 0 }}
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">Pick a time</span>
            <span className="text-sm font-mono font-medium text-primary-600 tabular-nums">
              {String(localH).padStart(2, '0')}:{String(localM).padStart(2, '0')}
            </span>
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-2 px-2 pt-2">
            <span className="text-center text-xs text-gray-400 font-medium">Hour</span>
            <span className="text-center text-xs text-gray-400 font-medium">Minute</span>
          </div>

          {/* Highlight band */}
          <div className="relative mx-2" style={{ height: 180 }}>
            {/* Centre highlight */}
            <div
              className="absolute left-0 right-0 rounded-xl bg-primary-50 border border-primary-100 pointer-events-none"
              style={{ top: '50%', transform: 'translateY(-50%)', height: 36 }}
            />
            <div className="absolute inset-0 grid grid-cols-2 overflow-hidden">
              <Column
                items={hours}
                selected={localH}
                onSelect={setLocalH}
                format={(n) => String(n).padStart(2, '0')}
              />
              <Column
                items={minutes}
                selected={localM}
                onSelect={setLocalM}
                format={(n) => String(n).padStart(2, '0')}
              />
            </div>
          </div>

          {/* AM / PM quick toggles */}
          <div className="flex gap-2 px-3 pb-2 pt-1">
            <button
              type="button"
              onClick={() => setLocalH((h) => (h >= 12 ? h : h))}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors ${localH < 12 ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setLocalH((h) => (h < 12 ? h + 12 : h))}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors ${localH >= 12 ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              PM
            </button>
          </div>

          {/* Confirm */}
          <div className="border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={confirm}
              className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Confirm
            </button>
          </div>
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

import { useMemo, useRef, useState } from 'react';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { Avatar } from '@/shared/components/ui/Avatar';
import clsx from 'clsx';

interface MemberPickerProps {
  value: string | null; // selected memberId, or null if nothing chosen yet
  onChange: (memberId: string, alumni: Alumni) => void;
  excludeIds?: string[]; // memberIds to hide from results (e.g. existing admins/excos)
  label?: string;
  placeholder?: string;
  error?: string;
  inputClassName?:string
}

export function MemberPicker({
  value,
  onChange,
  excludeIds = [],
  label = 'Member',
  placeholder = "Enter the member's name or email",
  error,
  inputClassName = "bg-[#F8F7F4] rounded-3xl"
}: MemberPickerProps) {
  const { data: alumniList = [] } = useAlumni();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => alumniList.find((alumni) => alumni.memberId === value) ?? null,
    [alumniList, value],
  );

  const excludeSet = useMemo(() => new Set(excludeIds), [excludeIds]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return alumniList
      .filter((alumni) => !excludeSet.has(alumni.memberId))
      .filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(q) || alumni.email.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [alumniList, query, excludeSet]);

  const handleSelect = (alumni: Alumni) => {
    onChange(alumni.memberId, alumni);
    setQuery('');
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Only close if focus moved outside this whole component (not between its
    // own input/list elements)
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1" ref={containerRef} onBlur={handleBlur}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {selected ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={selected.photo} alt={selected.name} size={32} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{selected.name}</p>
              <p className="truncate text-xs text-gray-500">{selected.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('', selected)}
            className="shrink-0 text-xs font-semibold text-primary-600 hover:text-primary-800"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={clsx(`w-full border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-400 ${
              error ? 'border-red-400' : 'border-gray-200'
            }`, inputClassName)}
          />

          {isOpen && results.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              {results.map((alumni) => (
                <li key={alumni.memberId}>
                  <button
                    type="button"
                    onClick={() => handleSelect(alumni)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <Avatar src={alumni.photo} alt={alumni.name} size={28} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{alumni.name}</p>
                      <p className="truncate text-xs text-gray-500">{alumni.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {isOpen && query.trim() && results.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-lg">
              No members found
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
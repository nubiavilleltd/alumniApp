import { Icon } from "@iconify/react/dist/iconify.js";

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label?: string;
  placeholder?: string;
}

export function FilterDropdown({
  value,
  onChange,
  options,
  label,
  placeholder = 'All',
}: FilterDropdownProps) {
  return (
    <div className="w-full sm:w-48">
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 shadow-sm outline-none focus:border-primary-400 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Icon
          icon="mdi:chevron-down"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
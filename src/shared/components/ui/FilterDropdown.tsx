import { SelectInput } from './SelectInput';

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
      <SelectInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        options={options}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}

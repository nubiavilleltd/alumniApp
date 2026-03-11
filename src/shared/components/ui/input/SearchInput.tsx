// import { Icon } from "@iconify/react/dist/iconify.js";

// interface SearchInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   label?: string;
// }

// export function SearchInput({
//   value,
//   onChange,
//   placeholder = 'Search events...',
//   label,
// }: SearchInputProps) {
//   return (
//     <div className="flex-1">
//       {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
//       <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//         <div className="pl-3 text-gray-400">
//           <Icon icon="mdi:magnify" className="w-4 h-4" />
//         </div>
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           className="flex-1 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//         />
//       </div>
//     </div>
//   );
// }

import { Icon } from '@iconify/react';
import { BaseInput, type BaseInputProps } from './BaseInput';

interface SearchInputProps extends Omit<BaseInputProps, 'leadingSlot' | 'trailingSlot' | 'type'> {
  onSearch?: () => void;
  showSearchButton?: boolean;
  onValueChange?: (value: string) => void;
}

export function SearchInput({
  onSearch,
  showSearchButton = false,
  onValueChange,
  onChange,
  ...rest
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch?.();
    rest.onKeyDown?.(e);
  };

  return (
    <BaseInput
      type="search"
      leadingSlot={<Icon icon="mdi:magnify" className="w-4 h-4" />}
      trailingSlot={
        showSearchButton ? (
          <button
            type="button"
            onClick={onSearch}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            Search
          </button>
        ) : undefined
      }
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}

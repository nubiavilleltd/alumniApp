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
      leadingSlot={<Icon icon="mdi:magnify" className="w-6 h-6" />}
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

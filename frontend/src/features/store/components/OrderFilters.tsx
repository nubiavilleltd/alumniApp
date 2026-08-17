// /feature/store/components/orders/OrderFilters.tsx

import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { DatePicker } from '@/shared/components/ui/input/DatePicker';
import { FilterSheet } from '@/shared/components/ui/FilterSheet';

interface Tab {
  label: string;
  value: string;
  count?: number;
}

interface OrderFiltersProps {
  /** Current search value */
  search: string;
  /** Called when search value changes */
  onSearch: (value: string) => void;
  
  /** Currently active tab value */
  activeTab: string;
  /** Called when tab changes */
  onTabChange: (tab: string) => void;
  
  /** Array of tab configurations */
  tabs: Tab[];
  
  /** Variant determines placeholder text and whether date range is shown */
  variant: 'user' | 'admin';
  
  /** Date range picker (admin only) */
  dateRange?: {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
  };
  
  /** Optional className for the container */
  className?: string;
}

export function OrderFilters({
  search,
  onSearch,
  activeTab,
  onTabChange,
  tabs,
  variant,
  dateRange,
  className = '',
}: OrderFiltersProps) {
  const isAdmin = variant === 'admin';
  
  // Search placeholder based on variant
  const searchPlaceholder = isAdmin
    ? 'Search by order number or customer name'
    : 'Search by order number or product name';


return (
    <div className={`flex w-full flex-col gap-3 xl:flex-row xl:flex-nowrap xl:items-center ${className}`}>
      {/* Search */}
      <div className="w-full xl:w-auto xl:flex-1 xl:min-w-[240px] xl:max-w-sm">
        <SearchInput
          value={search}
          onValueChange={onSearch}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* Mobile/tablet: tabs collapse into a dropdown */}
      <div className="w-full xl:hidden">
        <FilterSheet
          value={activeTab}
          onChange={onTabChange}
          placeholder="Filter"
          title="Filter Orders"
          className="w-full"
          options={tabs.map((tab) => ({
            label:
              tab.count !== undefined && tab.count >= 0
                ? `${tab.label} (${tab.count})`
                : tab.label,
            value: tab.value,
          }))}
        />
      </div>

      {/* Desktop: tab pills, inline with everything else, no wrap */}
      <div className="hidden xl:flex xl:items-center xl:gap-2 xl:flex-shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const hasCount = tab.count !== undefined && tab.count >= 0;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={`
                px-4 py-2.5 text-sm font-semibold rounded-full border whitespace-nowrap transition-colors
                ${isActive
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {hasCount && ` (${tab.count})`}
            </button>
          );
        })}
      </div>

      {/* Date Range (Admin only): inline, right after tabs, same row */}
      {isAdmin && dateRange && (
        <div className="flex items-center gap-2 w-full xl:w-auto xl:flex-shrink-0">
          <div className="flex-1 xl:w-36">
            <DatePicker
              placeholder="Date From"
              value={dateRange.from}
              onValueChange={dateRange.onFromChange}
              inputClassName="h-10 text-sm rounded-full"
            />
          </div>
          <span className="text-sm text-gray-400 shrink-0">→</span>
          <div className="flex-1 xl:w-36">
            <DatePicker
              placeholder="Date To"
              value={dateRange.to}
              onValueChange={dateRange.onToChange}
              inputClassName="h-10 text-sm rounded-full"
            />
          </div>
          {(dateRange.from || dateRange.to) && (
            <button
              type="button"
              onClick={() => {
                dateRange.onFromChange('');
                dateRange.onToChange('');
              }}
              className="text-sm font-medium text-gray-400 hover:text-gray-600 shrink-0 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );

}
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import clsx from 'clsx';

interface Props {
    search: string;
    category: string;
    categories: string[];
    onSearch: (value: string) => void;
    onCategoryChange: (value: string) => void;

    className?:string
}

export function StoreFilters({
    search,
    category,
    categories,
    onSearch,
    onCategoryChange,
    className
}: Props) {
    return (
        <div className={clsx('flex flex-col sm:flex-row items-center gap-4', className)}>
            <div className="flex-1 w-full sm:max-w-xl">
                <SearchInput
                    value={search}
                    onValueChange={onSearch}
                    placeholder="Search products"
                />
            </div>

            <div className="w-full sm:w-auto">
                <FilterDropdown
                    value={category}
                    onChange={onCategoryChange}
                    placeholder="Category"
                    options={categories.map((c) => ({
                        label: c,
                        value: c,
                    }))}
                />
            </div>

        </div>
    );
}
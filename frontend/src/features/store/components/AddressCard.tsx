import { Pencil, Trash2 } from 'lucide-react';
import type { Address } from '../types/address.types';

interface Props {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDeleting,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${
        isSelected ? 'border-primary-500 bg-primary-50/30' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <p className="font-semibold text-gray-800 text-sm pr-16">
        {address.firstName} {address.lastName}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 pr-16">
        {[address.address, address.landmark, address.area, address.state, address.phone]
          .filter(Boolean)
          .join(' | ')}
      </p>

      {/* Edit / Delete */}
      <div className="absolute top-3 right-3 flex gap-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          disabled={isDeleting}
          className="p-1.5 text-primary-400 hover:text-primary-600 transition-colors"
          aria-label="Edit address"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={isDeleting}
          className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
          aria-label="Delete address"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </button>
  );
}
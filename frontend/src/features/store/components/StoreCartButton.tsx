import { ShoppingCart } from 'lucide-react';
import clsx from 'clsx';

interface StoreCartButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StoreCartButton({
  count,
  onClick,
  className,
  iconClassName,
  size = 'sm',
}: StoreCartButtonProps) {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 18,
    md: 20,
    lg: 24,
  };


  return (
    <button
      onClick={onClick}
      className={clsx(
        'relative rounded-full border border-primary-200 bg-white flex items-center justify-center transition-colors hover:bg-primary-50',
        sizeClasses[size],
        className,
      )}
    >
      <ShoppingCart
        size={iconSizes[size]}
        className={clsx('text-primary-500', iconClassName)}
      />

      {typeof count === 'number' && count > 0 && (
        <span
          className="
            absolute
            -top-2
            -right-2
            min-w-[18px]
            h-[18px]
            px-1
            rounded-full
            bg-red-500
            text-white
            text-[10px]
            font-semibold
            flex
            items-center
            justify-center
          "
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
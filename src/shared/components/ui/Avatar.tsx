// shared/components/ui/Avatar.tsx

import { Icon } from '@iconify/react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: number; // px
}

export function Avatar({ src, alt, size = 48 }: AvatarProps) {
  return (
    <div
      className="rounded-full overflow-hidden bg-gray-100 flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Icon icon="mdi:account-circle" className="w-2/3 h-2/3 text-gray-300" />
        </div>
      )}
    </div>
  );
}

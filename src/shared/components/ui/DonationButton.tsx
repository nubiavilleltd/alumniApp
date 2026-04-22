// shared/components/ui/DonationButton.tsx
// Floating "Make a Donation" button — fixed position bottom-right.
// Used across Resources, Welfare, WelfareZones and any other page that needs it.

import { Icon } from '@iconify/react';

interface DonationButtonProps {
  href?: string;
  onClick?: () => void;
}

export function DonationButton({ href, onClick }: DonationButtonProps) {
  const cls =
    'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold pl-5 pr-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 select-none';

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        Make a Donation
        <Icon icon="mdi:hand-coin-outline" className="w-5 h-5 flex-shrink-0" />
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      Make a Donation
      <Icon icon="mdi:hand-coin-outline" className="w-5 h-5 flex-shrink-0" />
    </button>
  );
}

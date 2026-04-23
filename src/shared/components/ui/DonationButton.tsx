// // shared/components/ui/DonationButton.tsx
// // Floating "Make a Donation" button — fixed position bottom-right.
// // Used across Resources, Welfare, WelfareZones and any other page that needs it.

// import { Icon } from '@iconify/react';

// interface DonationButtonProps {
//   href?: string;
//   onClick?: () => void;
// }

// export function DonationButton({ href, onClick }: DonationButtonProps) {
//   const cls =
//     'flex items-center gap-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold sm:h-6 sm:w-6 pl-5 pr-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 select-none';

//   if (href) {
//     return (
//       <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
//        <span className='hidden sminline'>Make a Donation</span>
//         <Icon icon="mdi:hand-coin-outline" className="w-5 h-5 flex-shrink-0" />
//       </a>
//     );
//   }

//   return (
//     <button type="button" onClick={onClick} className={cls}>
//       <span className='hidden sminline'>Make a Donation</span>
//       <Icon icon="mdi:hand-coin-outline" className="w-5 h-5 flex-shrink-0" />
//     </button>
//   );
// }

import { ROUTES } from '@/shared/constants/routes';
import { Icon } from '@iconify/react';

// export function DonationButton({ href }: DonationButtonProps) {
export function DonationButton() {
  return (
    <a
      href={ROUTES.DONATION}
      rel="noopener noreferrer"
      className="
        flex items-center justify-center
        bg-[#7c3aed] hover:bg-[#6d28d9]
        text-white font-semibold
        shadow-lg hover:shadow-xl
        transition-all duration-200
        select-none

        /* Mobile (default) — perfect circle */
        w-12 h-12 rounded-full

        /* Desktop — pill with text */
        sm:w-auto sm:h-auto sm:px-5 sm:py-3 sm:gap-2.5 sm:rounded-full
      "
      title="Make a Donation"
    >
      {/* Text (hidden on mobile) */}
      <span className="hidden sm:inline text-sm">Make a Donation</span>

      {/* Icon */}
      <Icon icon="mdi:hand-coin-outline" className="w-5 h-5 flex-shrink-0" />
    </a>
  );
}

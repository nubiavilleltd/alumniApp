// import type { FormEvent } from 'react';
// import { Icon } from '@iconify/react';
// import { getSiteConfig } from '@/data/content';
// import { AppLink } from '../ui/AppLink';

// export function Footer() {
//   const config = getSiteConfig();
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-primary-500 text-white">
//       <div className="container-custom py-16">
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"> */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
//           <div className="md:col-span-2">
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
//                 {config.site.logo ? (
//                   <img
//                     src={config.site.logo}
//                     alt={`${config.site.name} logo`}
//                     className="w-full h-full object-contain"
//                   />
//                 ) : (
//                   <Icon icon="mdi:account-group" className="w-7 h-7 text-white" />
//                 )}
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold text-white">{config.site.name}</h3>
//                 <p className="text-accent-300 text-sm">Alumni Network</p>
//               </div>
//             </div>
//             <p className="text-accent-300 mb-6 leading-relaxed max-w-md">
//               {config.site.description}
//             </p>
//             <div className="flex space-x-4">
//               {config.social_links.map((social) => (
//                 <AppLink
//                   href={social.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-10 h-10 bg-accent-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
//                   ariaLabel={social.name}
//                   key={social.name}
//                 >
//                   <Icon icon={`mdi:${social.icon}`} className="w-5 h-5" />
//                 </AppLink>
//               ))}
//             </div>
//           </div>

//           {/* <div>
//             <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
//             <ul className="space-y-3">
//               {config.navigation.slice(0, 6).map((item) => (
//                 <li key={item.label}>
//                   <AppLink
//                     href={item.url}
//                     className="text-accent-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group"
//                   >
//                     <Icon
//                       icon={`mdi:${item.icon || 'arrow-right'}`}
//                       className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
//                     />
//                     <span>{item.label}</span>
//                   </AppLink>
//                 </li>
//               ))}
//             </ul>
//           </div> */}

//           <div>
//             <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
//                   <Icon icon="mdi:map-marker" className="w-4 h-4 text-white" />
//                 </div>
//                 <p className="text-accent-300 text-sm leading-relaxed">
//                   {config.organization.address}
//                 </p>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
//                   <Icon icon="mdi:email" className="w-4 h-4 text-white" />
//                 </div>
//                 <AppLink
//                   href={`mailto:${config.contact.email}`}
//                   className="text-accent-300 hover:text-primary-400 transition-colors duration-200 text-sm"
//                 >
//                   {config.contact.email}
//                 </AppLink>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
//                   <Icon icon="mdi:phone" className="w-4 h-4 text-white" />
//                 </div>
//                 <AppLink
//                   href={`tel:${config.contact.phone}`}
//                   className="text-accent-300 hover:text-primary-400 transition-colors duration-200 text-sm"
//                 >
//                   {config.contact.phone}
//                 </AppLink>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-accent-800 pt-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="text-accent-400 text-sm text-center md:text-left">
//               <p>
//                 © {currentYear} {config.organization.name}. All rights reserved.
//               </p>
//             </div>

//             <div className="flex items-center space-x-6 text-sm">
//               <AppLink
//                 href="/privacy"
//                 className="text-accent-400 hover:text-primary-400 transition-colors duration-200"
//               >
//                 Privacy Policy
//               </AppLink>
//               <AppLink
//                 href="/terms"
//                 className="text-accent-400 hover:text-primary-400 transition-colors duration-200"
//               >
//                 Terms of Service
//               </AppLink>
//               <AppLink
//                 href="/about"
//                 className="text-accent-400 hover:text-primary-400 transition-colors duration-200"
//               >
//                 About
//               </AppLink>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { Icon } from '@iconify/react';
import { getSiteConfig } from '@/data/content';
import { AppLink } from '../ui/AppLink';

export function Footer() {
  const config = getSiteConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0077B6] text-white">
      <div className="container-custom py-10">
        {/* Top row: Logo + Contact */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Left: Logo + description */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center overflow-hidden flex-shrink-0 bg-white">
                {config.site.logo ? (
                  <img
                    src={config.site.logo}
                    alt={`${config.site.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Icon icon="mdi:account-group" className="w-5 h-5 text-[#0077B6]" />
                )}
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{config.site.name}</p>
                <p className="text-blue-100 text-xs leading-tight">{config.organization.name}</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">{config.site.description}</p>
          </div>

          {/* Right: Contact Us */}
          <div className="min-w-[220px]">
            <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <Icon icon="mdi:map-marker" className="w-4 h-4 flex-shrink-0" />
                <span>{config.organization.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:email-outline" className="w-4 h-4 flex-shrink-0 text-blue-100" />
                <AppLink
                  href={`mailto:${config.contact.email}`}
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  {config.contact.email}
                </AppLink>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:phone" className="w-4 h-4 flex-shrink-0 text-blue-100" />
                <AppLink
                  href={`tel:${config.contact.phone}`}
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  {config.contact.phone}
                </AppLink>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-400/40" />

        {/* Bottom row: Copyright + Social icons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-blue-100 text-xs text-center md:text-left">
            © {currentYear} FGGC Owerri Alumni Association, Lagos Chapter. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {config.social_links.map((social) => (
              <AppLink
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={social.name}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-md flex items-center justify-center transition-colors duration-200"
              >
                <Icon icon={`mdi:${social.icon}`} className="w-4 h-4 text-white" />
              </AppLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

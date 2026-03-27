// import { Icon } from '@iconify/react';
// import { useEffect, useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { getSiteConfig } from '@/data/content';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { AppLink } from '../ui/AppLink';
// import Button from '../ui/Button';

// // ─── Nav Items ────────────────────────────────────────────────────────────────
// const navItems = [
//   { label: 'Home', url: '/' },
//   { label: 'About Us', url: '/about' },
//   { label: 'Market Place', url: '/marketplace' },
//   {
//     label: 'Alumnae Connect',
//     url: '#',
//     children: [
//       { label: 'Messages', url: '/messages', icon: 'mdi:message-outline' },
//       { label: 'Alumni Directory', url: '/alumni/profiles', icon: 'mdi:account-group-outline' },
//     ],
//   },
//   { label: 'Events', url: '/events' },
// ];

// // ─── Active link helper ───────────────────────────────────────────────────────
// function useIsActive(url: string) {
//   const { pathname } = useLocation();
//   if (url === '/') return pathname === '/';
//   return pathname.startsWith(url);
// }

// // ─── Desktop Nav Link ─────────────────────────────────────────────────────────
// function NavLink({ label, url }: { label: string; url: string }) {
//   const active = useIsActive(url);
//   return (
//     <AppLink
//       href={url}
//       className={`relative py-1 text-sm font-medium text-white transition-colors hover:text-white/80
//         after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-200
//         ${active ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
//     >
//       {label}
//     </AppLink>
//   );
// }

// // ─── Desktop Dropdown ─────────────────────────────────────────────────────────
// function DropdownNavItem({
//   label,
//   children,
// }: {
//   label: string;
//   children: { label: string; url: string; icon?: string }[];
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   const { pathname } = useLocation();
//   const isActive = children.some((c) => pathname.startsWith(c.url));

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!ref.current?.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   return (
//     <div ref={ref} className="relative">
//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className={`flex items-center gap-1 py-1 text-sm font-medium text-white transition-colors hover:text-white/80
//           relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-200
//           ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
//       >
//         {label}
//         <Icon
//           icon="mdi:chevron-down"
//           className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
//         />
//       </button>

//       {open && (
//         <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
//           {children.map((child) => (
//             <AppLink
//               key={child.url}
//               href={child.url}
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
//             >
//               {child.icon && <Icon icon={child.icon} className="w-4 h-4 text-primary-400" />}
//               {child.label}
//             </AppLink>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── User Dropdown ────────────────────────────────────────────────────────────
// function UserDropdown({
//   currentUser,
//   onLogout,
// }: {
//   currentUser: { fullName: string; avatarInitials: string; photo?: string; role?: string };
//   onLogout: () => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!ref.current?.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   return (
//     <div ref={ref} className="relative">
//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-2 py-1.5 transition-colors"
//       >
//         <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
//           {currentUser.photo ? (
//             <img
//               src={currentUser.photo}
//               alt={currentUser.fullName}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-white flex items-center justify-center text-primary-600 text-xs font-bold">
//               {currentUser.avatarInitials}
//             </div>
//           )}
//         </div>
//         <Icon
//           icon="mdi:chevron-down"
//           className={`w-4 h-4 text-white transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
//         />
//       </button>

//       {open && (
//         <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
//           <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
//             <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.fullName}</p>
//             <p className="text-xs text-gray-400 capitalize">{currentUser.role ?? 'Member'}</p>
//           </div>

//           <div className="py-1">
//             <AppLink
//               href="/user/profile"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
//             >
//               <Icon icon="mdi:account-outline" className="w-4 h-4 text-primary-400" />
//               View Profile
//             </AppLink>
//             <AppLink
//               href="/dashboard"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
//             >
//               <Icon icon="mdi:view-dashboard-outline" className="w-4 h-4 text-primary-400" />
//               Dashboard
//             </AppLink>
//             <AppLink
//               href="/marketplace/my-business"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
//             >
//               <Icon icon="mdi:storefront-outline" className="w-4 h-4 text-primary-400" />
//               My Business
//             </AppLink>
//             <AppLink
//               href="/user/settings"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
//             >
//               <Icon icon="mdi:cog-outline" className="w-4 h-4 text-primary-400" />
//               Settings
//             </AppLink>
//           </div>

//           <div className="border-t border-gray-100 py-1">
//             <button
//               type="button"
//               onClick={() => {
//                 setOpen(false);
//                 onLogout();
//               }}
//               className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
//             >
//               <Icon icon="mdi:logout" className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main Navigation ──────────────────────────────────────────────────────────
// export function Navigation() {
//   const config = getSiteConfig();
//   const navigate = useNavigate();
//   const currentUser = useAuthStore((state) => state.user);
//   const clearSession = useAuthStore((state) => state.clearSession);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const mobileMenuRef = useRef<HTMLDivElement>(null);
//   const mobileButtonRef = useRef<HTMLButtonElement>(null);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   useEffect(() => {
//     const onOutsideClick = (e: MouseEvent) => {
//       const inMenu = mobileMenuRef.current?.contains(e.target as Node);
//       const inButton = mobileButtonRef.current?.contains(e.target as Node);
//       if (!inMenu && !inButton) setMobileOpen(false);
//     };
//     const onResize = () => {
//       if (window.innerWidth >= 1024) setMobileOpen(false);
//     };
//     document.addEventListener('click', onOutsideClick);
//     window.addEventListener('resize', onResize);
//     return () => {
//       document.removeEventListener('click', onOutsideClick);
//       window.removeEventListener('resize', onResize);
//     };
//   }, []);

//   const handleLogout = () => {
//     clearSession();
//     setMobileOpen(false);
//     navigate('/', { replace: true });
//   };

//   return (
//     <nav className="bg-primary-500 sticky top-0 z-50 text-white shadow-sm">
//       <div className="container-custom">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* ── Logo ───────────────────────────────────────────────────── */}
//           <AppLink href="/" className="flex items-center gap-3 group flex-shrink-0">
//             <div className="w-10 h-10">
//               {config.site.logo ? (
//                 <img
//                   src={config.site.logo}
//                   alt={`${config.site.name} logo`}
//                   className="w-full h-full object-cover rounded-full border-2 border-white group-hover:scale-105 transition-transform duration-300"
//                 />
//               ) : (
//                 <Icon icon="mdi:account-group" className="w-7 h-7 text-white" />
//               )}
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-white group-hover:text-white/80 transition-colors">
//                 {config.site.name}
//               </h1>
//               <p className="text-xs text-white/70 hidden sm:block">
//                 Federal Government Girls College
//               </p>
//             </div>
//           </AppLink>

//           {/* ── Desktop Links ──────────────────────────────────────────── */}
//           <div className="hidden lg:flex items-center gap-6">
//             {navItems.map((item) =>
//               item.children ? (
//                 <DropdownNavItem key={item.label} label={item.label} children={item.children} />
//               ) : (
//                 <NavLink key={item.label} label={item.label} url={item.url} />
//               ),
//             )}
//           </div>

//           {/* ── Desktop Auth ───────────────────────────────────────────── */}
//           <div className="hidden lg:flex items-center gap-3">
//             {currentUser ? (
//               <UserDropdown currentUser={currentUser} onLogout={handleLogout} />
//             ) : (
//               <AppLink href="/auth/login">
//                 <Button variant="white">Login</Button>
//               </AppLink>
//             )}
//           </div>

//           {/* ── Mobile Hamburger ───────────────────────────────────────── */}
//           <button
//             ref={mobileButtonRef}
//             type="button"
//             aria-label="Toggle mobile menu"
//             onClick={() => setMobileOpen((prev) => !prev)}
//             className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
//           >
//             <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} className="w-6 h-6" />
//           </button>
//         </div>

//         {/* ── Mobile Menu ──────────────────────────────────────────────── */}
//         <div
//           ref={mobileMenuRef}
//           className={`lg:hidden overflow-hidden transition-all duration-200 ${mobileOpen ? 'max-h-screen py-4' : 'max-h-0'}`}
//         >
//           <div className="space-y-1 border-t border-white/20 pt-4">
//             {navItems.map((item) =>
//               item.children ? (
//                 <div key={item.label}>
//                   <p className="px-4 pt-2 pb-1 text-xs font-semibold text-white/50 uppercase tracking-wider">
//                     {item.label}
//                   </p>
//                   {item.children.map((child) => (
//                     <AppLink
//                       key={child.url}
//                       href={child.url}
//                       className={`flex items-center gap-2.5 px-6 py-2.5 text-sm transition-colors
//                         ${pathname.startsWith(child.url) ? 'text-white font-semibold' : 'text-white/80 hover:text-white'}`}
//                     >
//                       {child.icon && <Icon icon={child.icon} className="w-4 h-4" />}
//                       {child.label}
//                     </AppLink>
//                   ))}
//                 </div>
//               ) : (
//                 <AppLink
//                   key={item.label}
//                   href={item.url}
//                   className={`block px-4 py-2.5 text-sm rounded-lg transition-colors
//                     ${
//                       (item.url === '/' ? pathname === '/' : pathname.startsWith(item.url))
//                         ? 'bg-white/20 text-white font-semibold'
//                         : 'text-white/80 hover:bg-white/10 hover:text-white'
//                     }`}
//                 >
//                   {item.label}
//                 </AppLink>
//               ),
//             )}

//             {/* ── Mobile Auth ────────────────────────────────────────── */}
//             {currentUser ? (
//               <div className="space-y-1 px-4 pt-4 border-t border-white/20 mt-2">
//                 <div className="flex items-center gap-3 px-2 py-2 mb-1">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
//                     {currentUser.photo ? (
//                       <img
//                         src={currentUser.photo}
//                         alt={currentUser.fullName}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-white flex items-center justify-center text-primary-600 text-sm font-bold">
//                         {currentUser.avatarInitials}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-white text-sm">{currentUser.fullName}</p>
//                     <p className="text-xs text-white/60 capitalize">
//                       {currentUser.role ?? 'Member'}
//                     </p>
//                   </div>
//                 </div>
//                 <AppLink
//                   href="/user/profile"
//                   className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
//                 >
//                   <Icon icon="mdi:account-outline" className="w-4 h-4" />
//                   View Profile
//                 </AppLink>
//                 <AppLink
//                   href="/dashboard"
//                   className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
//                 >
//                   <Icon icon="mdi:view-dashboard-outline" className="w-4 h-4" />
//                   Dashboard
//                 </AppLink>
//                 <AppLink
//                   href="/marketplace/my-business"
//                   className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
//                 >
//                   <Icon icon="mdi:storefront-outline" className="w-4 h-4" />
//                   My Business
//                 </AppLink>
//                 <AppLink
//                   href="/user/settings"
//                   className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
//                 >
//                   <Icon icon="mdi:cog-outline" className="w-4 h-4" />
//                   Settings
//                 </AppLink>
//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-300 hover:text-red-200 hover:bg-white/10 rounded-lg transition-colors"
//                 >
//                   <Icon icon="mdi:logout" className="w-4 h-4" />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-3 px-4 pt-4 border-t border-white/20 mt-2">
//                 <AppLink
//                   href="/auth/login"
//                   className="btn btn-outline btn-sm w-full justify-center text-white border-white hover:bg-white hover:text-primary-600"
//                 >
//                   Login
//                 </AppLink>
//                 <AppLink
//                   href="/auth/register"
//                   className="btn btn-sm w-full justify-center bg-white text-primary-600 hover:bg-white/90"
//                 >
//                   Register
//                 </AppLink>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSiteConfig } from '@/data/content';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { AppLink } from '../ui/AppLink';
import Button from '../ui/Button';

// ─── Nav Items ────────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Home', url: '/' },
  { label: 'About Us', url: '/about' },
  { label: 'Market Place', url: '/marketplace' },
  {
    label: 'Alumnae Connect',
    url: '#',
    children: [
      { label: 'Messages', url: '/messages', icon: 'mdi:message-outline' },
      { label: 'Alumni Directory', url: '/alumni/profiles', icon: 'mdi:account-group-outline' },
    ],
  },
  { label: 'Events', url: '/events' },
];

// ─── Active link helper ───────────────────────────────────────────────────────
function useIsActive(url: string) {
  const { pathname } = useLocation();
  if (url === '/') return pathname === '/';
  return pathname.startsWith(url);
}

// ─── Desktop Nav Link ─────────────────────────────────────────────────────────
function NavLink({ label, url }: { label: string; url: string }) {
  const active = useIsActive(url);
  return (
    <AppLink
      href={url}
      className={`relative py-1 text-sm font-medium text-white transition-colors hover:text-white/80
        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-200
        ${active ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
    >
      {label}
    </AppLink>
  );
}

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────
function DropdownNavItem({
  label,
  children,
}: {
  label: string;
  children: { label: string; url: string; icon?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isActive = children.some((c) => pathname.startsWith(c.url));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1 py-1 text-sm font-medium text-white transition-colors hover:text-white/80
          relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-200
          ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
      >
        {label}
        <Icon
          icon="mdi:chevron-down"
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          {children.map((child) => (
            <AppLink
              key={child.url}
              href={child.url}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {child.icon && <Icon icon={child.icon} className="w-4 h-4 text-primary-400" />}
              {child.label}
            </AppLink>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────
function UserDropdown({
  currentUser,
  onLogout,
}: {
  currentUser: {
    fullName: string;
    avatarInitials: string;
    photo?: string;
    role?: string;
    memberId?: string;
  };
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-2 py-1.5 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
          {currentUser.photo ? (
            <img
              src={currentUser.photo}
              alt={currentUser.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center text-primary-600 text-xs font-bold">
              {currentUser.avatarInitials}
            </div>
          )}
        </div>
        <Icon
          icon="mdi:chevron-down"
          className={`w-4 h-4 text-white transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.fullName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-400 capitalize">{currentUser.role ?? 'Member'}</p>
              {isAdmin && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="py-1">
            {/* Admin Dashboard - Only for admin users */}
            {isAdmin && (
              <>
                <AppLink
                  href="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border-l-2 border-purple-500"
                >
                  <Icon icon="mdi:shield-account-outline" className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold">Admin Dashboard</span>
                </AppLink>
                <div className="border-t border-gray-100 my-1" />
              </>
            )}

            <AppLink
              href={`/alumni/profiles/${currentUser.memberId}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Icon icon="mdi:account-outline" className="w-4 h-4 text-primary-400" />
              View Profile
            </AppLink>
            <AppLink
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Icon icon="mdi:view-dashboard-outline" className="w-4 h-4 text-primary-400" />
              Dashboard
            </AppLink>
            <AppLink
              href="/marketplace/my-business"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Icon icon="mdi:storefront-outline" className="w-4 h-4 text-primary-400" />
              My Business
            </AppLink>
            <AppLink
              href="/user/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Icon icon="mdi:cog-outline" className="w-4 h-4 text-primary-400" />
              Settings
            </AppLink>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Icon icon="mdi:logout" className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Navigation ──────────────────────────────────────────────────────────
export function Navigation() {
  const config = getSiteConfig();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      const inMenu = mobileMenuRef.current?.contains(e.target as Node);
      const inButton = mobileButtonRef.current?.contains(e.target as Node);
      if (!inMenu && !inButton) setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    document.addEventListener('click', onOutsideClick);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('click', onOutsideClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    setMobileOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-primary-500 sticky top-0 z-50 text-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* ── Logo ───────────────────────────────────────────────────── */}
          <AppLink href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10">
              {config.site.logo ? (
                <img
                  src={config.site.logo}
                  alt={`${config.site.name} logo`}
                  className="w-full h-full object-cover rounded-full border-2 border-white group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Icon icon="mdi:account-group" className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white group-hover:text-white/80 transition-colors">
                {config.site.name}
              </h1>
              <p className="text-xs text-white/70 hidden sm:block">
                Federal Government Girls College
              </p>
            </div>
          </AppLink>

          {/* ── Desktop Links ──────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.children ? (
                <DropdownNavItem key={item.label} label={item.label} children={item.children} />
              ) : (
                <NavLink key={item.label} label={item.label} url={item.url} />
              ),
            )}
          </div>

          {/* ── Desktop Auth ───────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <UserDropdown currentUser={currentUser} onLogout={handleLogout} />
            ) : (
              <AppLink href="/auth/login">
                <Button variant="white">Login</Button>
              </AppLink>
            )}
          </div>

          {/* ── Mobile Hamburger ───────────────────────────────────────── */}
          <button
            ref={mobileButtonRef}
            type="button"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} className="w-6 h-6" />
          </button>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────────────── */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden overflow-hidden transition-all duration-200 ${mobileOpen ? 'max-h-screen py-4' : 'max-h-0'}`}
        >
          <div className="space-y-1 border-t border-white/20 pt-4">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="px-4 pt-2 pb-1 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <AppLink
                      key={child.url}
                      href={child.url}
                      className={`flex items-center gap-2.5 px-6 py-2.5 text-sm transition-colors
                        ${pathname.startsWith(child.url) ? 'text-white font-semibold' : 'text-white/80 hover:text-white'}`}
                    >
                      {child.icon && <Icon icon={child.icon} className="w-4 h-4" />}
                      {child.label}
                    </AppLink>
                  ))}
                </div>
              ) : (
                <AppLink
                  key={item.label}
                  href={item.url}
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors
                    ${
                      (item.url === '/' ? pathname === '/' : pathname.startsWith(item.url))
                        ? 'bg-white/20 text-white font-semibold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {item.label}
                </AppLink>
              ),
            )}

            {/* ── Mobile Auth ────────────────────────────────────────── */}
            {currentUser ? (
              <div className="space-y-1 px-4 pt-4 border-t border-white/20 mt-2">
                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                    {currentUser.photo ? (
                      <img
                        src={currentUser.photo}
                        alt={currentUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white flex items-center justify-center text-primary-600 text-sm font-bold">
                        {currentUser.avatarInitials}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{currentUser.fullName}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-white/60 capitalize">
                        {currentUser.role ?? 'Member'}
                      </p>
                      {isAdmin && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-purple-500/30 text-white rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Dashboard - Mobile */}
                {isAdmin && (
                  <AppLink
                    href="/admin/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm bg-purple-500/20 text-white hover:bg-purple-500/30 rounded-lg transition-colors"
                  >
                    <Icon icon="mdi:shield-account-outline" className="w-4 h-4" />
                    Admin Dashboard
                  </AppLink>
                )}

                <AppLink
                  href={`/alumni/profiles/${currentUser.memberId}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:account-outline" className="w-4 h-4" />
                  View Profile
                </AppLink>
                <AppLink
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:view-dashboard-outline" className="w-4 h-4" />
                  Dashboard
                </AppLink>
                <AppLink
                  href="/marketplace/my-business"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:storefront-outline" className="w-4 h-4" />
                  My Business
                </AppLink>
                <AppLink
                  href="/user/settings"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:cog-outline" className="w-4 h-4" />
                  Settings
                </AppLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-300 hover:text-red-200 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:logout" className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-4 pt-4 border-t border-white/20 mt-2">
                <AppLink
                  href="/auth/login"
                  className="btn btn-outline btn-sm w-full justify-center text-white border-white hover:bg-white hover:text-primary-600"
                >
                  Login
                </AppLink>
                <AppLink
                  href="/auth/register"
                  className="btn btn-sm w-full justify-center bg-white text-primary-600 hover:bg-white/90"
                >
                  Register
                </AppLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// import { Icon } from '@iconify/react';
// import { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getSiteConfig } from '@/data/content';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { AppLink } from '../ui/AppLink';
// import Button from '../ui/Button';

// interface NavigationItem {
//   label: string;
//   url: string;
//   icon?: string;
// }

// const navigation: NavigationItem[] = [
//   {
//     label: 'Home',
//     url: '/',
//   },
//   {
//     label: 'About Us',
//     url: '/about',
//   },
//   {
//     label: 'Alumnae Directory',
//     url: '/alumni/profiles',
//   },
//   {
//     label: 'Alumnae Connect',
//     url: '/alumni/profiles',
//   },
//   {
//     label: 'Events',
//     url: '/events',
//   },
//   {
//     label: 'Market Place',
//     url: '/marketplace',
//   },
// ];

// export function Navigation() {
//   const config = getSiteConfig();
//   const navigate = useNavigate();
//   const currentUser = useAuthStore((state) => state.user);
//   const clearSession = useAuthStore((state) => state.clearSession);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({});
//   const mobileMenuRef = useRef<HTMLDivElement>(null);
//   const mobileButtonRef = useRef<HTMLButtonElement>(null);

//   const years = Array.from(
//     { length: config.years.end - config.years.start + 1 },
//     (_, i) => config.years.end - i,
//   );

//   useEffect(() => {
//     const onOutsideClick = (event: MouseEvent): void => {
//       const target = event.target as Node;
//       const inMenu = mobileMenuRef.current?.contains(target);
//       const inButton = mobileButtonRef.current?.contains(target);
//       if (!inMenu && !inButton) {
//         setMobileMenuOpen(false);
//       }
//     };

//     const onResize = (): void => {
//       if (window.innerWidth >= 1024) {
//         setMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener('click', onOutsideClick);
//     window.addEventListener('resize', onResize);

//     return () => {
//       document.removeEventListener('click', onOutsideClick);
//       window.removeEventListener('resize', onResize);
//     };
//   }, []);

//   const toggleMobileSection = (sectionId: string): void => {
//     setOpenMobileSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }));
//   };

//   const handleLogout = () => {
//     clearSession();
//     setMobileMenuOpen(false);
//     navigate('/', { replace: true });
//   };

//   return (
//     // <nav className="bg-white/95 backdrop-blur border-b border-accent-100 sticky top-0 z-50">
//     <nav className="bg-primary-500 backdrop-blur border-b border-accent-100 sticky top-0 z-50 text-white">
//       <div className="container-custom">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           <div className="flex items-center">
//             <AppLink href="/" className="flex items-center space-x-3 group">
//               {/* <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"> */}
//               <div className="w-10 h-10 lg:w-10 lg:h-10">
//                 {config.site.logo ? (
//                   <img
//                     src={config.site.logo}
//                     alt={`${config.site.name} logo`}
//                     className="w-full h-full object-cover rounded-full border border-2 border-white duration-300 hover:scale-105"
//                   />
//                 ) : (
//                   <Icon icon="mdi:account-group" className="w-7 h-7 text-white" />
//                 )}
//               </div>
//               <div>
//                 {/* <h1 className="text-sm lg:text-2xl font-bold text-white group-hover:text-primary-200 transition-colors duration-200"> */}
//                 <h1 className="text-lg font-bold text-white group-hover:text-primary-200 transition-colors duration-200">
//                   {config.site.name}
//                 </h1>
//                 <p className="text-xs text-gray-50 hidden sm:block">
//                   Federal Government Girls College
//                 </p>
//               </div>
//             </AppLink>
//           </div>

//           <div className="hidden lg:flex items-center space-x-5">
//             {navigation.map((item) => (
//               <div className="relative group" key={item.label}>
//                 <AppLink href={item.url} className="nav-link py-2">
//                   {item.icon && (
//                     <Icon icon={`mdi:${item.icon}`} className="w-4 h-4 mr-2 inline-block" />
//                   )}
//                   {item.label}
//                 </AppLink>
//               </div>
//             ))}

//             {currentUser ? (
//               <div className="flex items-center gap-3">
//                 <AppLink
//                   href="/dashboard"
//                   className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-3 py-2 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50"
//                 >
//                   <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
//                     {currentUser.avatarInitials}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-semibold text-accent-900">
//                       {currentUser.fullName}
//                     </p>
//                     <p className="text-xs text-accent-500">Dashboard</p>
//                   </div>
//                 </AppLink>

//                 <button className="btn btn-outline btn-sm" type="button" onClick={handleLogout}>
//                   <Icon icon="mdi:logout" className="mr-2 h-4 w-4" />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <AppLink href="/auth/login">
//                 {/* <Icon icon="mdi:login" className="mr-2 h-5 w-5" /> */}

//                 <Button variant="white">Login</Button>
//               </AppLink>
//             )}
//           </div>

//           <button
//             ref={mobileButtonRef}
//             className="lg:hidden p-2 rounded-lg text-accent-600 hover:text-accent-900 hover:bg-accent-100 transition-colors duration-200"
//             aria-label="Toggle mobile menu"
//             type="button"
//             onClick={() => setMobileMenuOpen((prev) => !prev)}
//           >
//             <Icon icon="mdi:menu" className="w-6 h-6" />
//           </button>
//         </div>

//         <div ref={mobileMenuRef} className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
//           <div className="py-4 space-y-2 border-t border-accent-100">
//             {navigation.map((item) => {
//               const sectionId = `mobile-mega-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
//               const sectionOpen = !!openMobileSections[sectionId];

//               return (
//                 <div className="space-y-2" key={item.label}>
//                   <AppLink
//                     href={item.url}
//                     className="block px-4 py-3 text-accent-700 hover:text-primary-600 hover:bg-accent-50 rounded-lg transition-colors duration-200"
//                   >
//                     {item.icon && (
//                       <Icon icon={`mdi:${item.icon}`} className="w-4 h-4 mr-3 inline" />
//                     )}
//                     {item.label}
//                   </AppLink>
//                 </div>
//               );
//             })}

//             {currentUser ? (
//               <div className="space-y-3 px-4 pt-4">
//                 <AppLink
//                   href="/dashboard"
//                   className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3"
//                 >
//                   <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
//                     {currentUser.avatarInitials}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="truncate font-semibold text-accent-900">{currentUser.fullName}</p>
//                     <p className="text-sm text-accent-500">Open dashboard</p>
//                   </div>
//                 </AppLink>

//                 <button
//                   className="btn btn-outline btn-sm w-full justify-center"
//                   type="button"
//                   onClick={handleLogout}
//                 >
//                   <Icon icon="mdi:logout" className="mr-2 h-4 w-4" />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-3 px-4 pt-4">
//                 <AppLink
//                   href="/auth/login"
//                   className="btn btn-outline btn-sm w-full justify-center"
//                 >
//                   Login
//                 </AppLink>
//                 <AppLink
//                   href="/auth/register"
//                   className="btn btn-primary btn-sm w-full justify-center"
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

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close mobile menu on outside click or resize
  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      const inMenu = mobileMenuRef.current?.contains(e.target as Node);
      const inButton = mobileButtonRef.current?.contains(e.target as Node);
      if (!inMenu && !inButton) setMobileOpen(false);
    };
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
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

          {/* ── Logo ─────────────────────────────────────────────────────── */}
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
              <p className="text-xs text-white/70 hidden sm:block">Federal Government Girls College</p>
            </div>
          </AppLink>

          {/* ── Desktop Links ─────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.children ? (
                <DropdownNavItem key={item.label} label={item.label} children={item.children} />
              ) : (
                <NavLink key={item.label} label={item.label} url={item.url} />
              ),
            )}
          </div>

          {/* ── Desktop Auth ──────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <>
                <AppLink
                  href="/dashboard"
                  className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-2 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-600 text-sm font-bold">
                    {currentUser.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{currentUser.fullName}</p>
                    <p className="text-xs text-white/60">Dashboard</p>
                  </div>
                </AppLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
                >
                  <Icon icon="mdi:logout" className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <AppLink href="/auth/login">
                <Button variant="white">Login</Button>
              </AppLink>
            )}
          </div>

          {/* ── Mobile Hamburger ──────────────────────────────────────────── */}
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

        {/* ── Mobile Menu ───────────────────────────────────────────────────── */}
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
                        ${pathname.startsWith(child.url)
                          ? 'text-white font-semibold'
                          : 'text-white/80 hover:text-white'}`}
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
                    ${(item.url === '/' ? pathname === '/' : pathname.startsWith(item.url))
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  {item.label}
                </AppLink>
              ),
            )}

            {/* Mobile Auth */}
            {currentUser ? (
              <div className="space-y-2 px-4 pt-4 border-t border-white/20 mt-2">
                <AppLink
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 text-sm font-bold">
                    {currentUser.avatarInitials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{currentUser.fullName}</p>
                    <p className="text-xs text-white/60">Open dashboard</p>
                  </div>
                </AppLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/80 hover:text-white transition-colors"
                >
                  <Icon icon="mdi:logout" className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-4 pt-4 border-t border-white/20 mt-2">
                <AppLink href="/auth/login" className="btn btn-outline btn-sm w-full justify-center text-white border-white hover:bg-white hover:text-primary-600">
                  Login
                </AppLink>
                <AppLink href="/auth/register" className="btn btn-sm w-full justify-center bg-white text-primary-600 hover:bg-white/90">
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

import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { getSiteConfig } from '@/data/content';
import { AppLink } from '../ui/AppLink';

export function Navigation() {
  const config = getSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({});
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const years = Array.from(
    { length: config.years.end - config.years.start + 1 },
    (_, i) => config.years.end - i,
  );

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent): void => {
      const target = event.target as Node;
      const inMenu = mobileMenuRef.current?.contains(target);
      const inButton = mobileButtonRef.current?.contains(target);
      if (!inMenu && !inButton) {
        setMobileMenuOpen(false);
      }
    };

    const onResize = (): void => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', onOutsideClick);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('click', onOutsideClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const toggleMobileSection = (sectionId: string): void => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-accent-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <AppLink href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {config.site.logo ? (
                  <img
                    src={config.site.logo}
                    alt={`${config.site.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Icon icon="mdi:account-group" className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-accent-900 group-hover:text-primary-600 transition-colors duration-200">
                  {config.site.name}
                </h1>
                <p className="text-xs text-accent-500 hidden sm:block">Alumni Network</p>
              </div>
            </AppLink>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {config.navigation.map((item) => (
              <div className="relative group" key={item.label}>
                {item.mega_menu ? (
                  <div className="relative">
                    <button className="nav-link flex items-center space-x-1 py-2" type="button">
                      <span>{item.label}</span>
                      <Icon
                        icon="mdi:chevron-down"
                        className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      />
                    </button>

                    <div className="mega-menu">
                      <div className="mega-menu-content">
                        <div className="grid grid-cols-1 gap-6 xl:gap-8">
                          <div className="mega-menu-section">
                            <h3 className="mega-menu-title">Browse by Year</h3>
                            <div className="mega-menu-links max-h-64 overflow-y-auto scrollbar-hide">
                              <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
                                {years.map((year) => (
                                  <AppLink
                                    href={`/alumni/years/${year}`}
                                    key={year}
                                    className="mega-menu-link flex items-center space-x-2 hover:bg-accent-50 px-3 py-2 rounded-lg -mx-3 -my-2"
                                  >
                                    <Icon
                                      icon="mdi:calendar"
                                      className="w-4 h-4 text-accent-400 flex-shrink-0"
                                    />
                                    <span className="truncate">{year}</span>
                                    <span className="text-xs text-accent-400 ml-auto hidden xl:inline">
                                      {config.content.alumni_per_page} alumni
                                    </span>
                                  </AppLink>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 xl:mt-8 pt-4 xl:pt-6 border-t border-accent-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AppLink
                              href="/alumni/profiles"
                              className="btn btn-primary btn-sm w-full justify-center"
                            >
                              <Icon icon="mdi:account-search" className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">View All Alumni</span>
                              <span className="sm:hidden">All Alumni</span>
                            </AppLink>
                            <AppLink
                              href="/alumni/years"
                              className="btn btn-outline btn-sm w-full justify-center"
                            >
                              <Icon icon="mdi:calendar-multiple" className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Browse by Year</span>
                              <span className="sm:hidden">By Year</span>
                            </AppLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AppLink href={item.url} className="nav-link py-2">
                    {item.icon && (
                      <Icon icon={`mdi:${item.icon}`} className="w-4 h-4 mr-2 inline-block" />
                    )}
                    {item.label}
                  </AppLink>
                )}
              </div>
            ))}

            <AppLink href="/alumni/profiles" className="btn btn-primary btn-sm">
              Login
              <Icon icon="mdi:login" className="w-6 h-6 mr-2" />
            </AppLink>
          </div>

          <button
            ref={mobileButtonRef}
            className="lg:hidden p-2 rounded-lg text-accent-600 hover:text-accent-900 hover:bg-accent-100 transition-colors duration-200"
            aria-label="Toggle mobile menu"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <Icon icon="mdi:menu" className="w-6 h-6" />
          </button>
        </div>

        <div ref={mobileMenuRef} className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="py-4 space-y-2 border-t border-accent-100">
            {config.navigation.map((item) => {
              const sectionId = `mobile-mega-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
              const sectionOpen = !!openMobileSections[sectionId];

              return (
                <div className="space-y-2" key={item.label}>
                  {item.mega_menu ? (
                    <div className="space-y-2">
                      <button
                        className="w-full text-left px-4 py-3 text-accent-700 hover:text-primary-600 hover:bg-accent-50 rounded-lg transition-colors duration-200 flex items-center justify-between"
                        type="button"
                        onClick={() => toggleMobileSection(sectionId)}
                      >
                        <span className="font-medium">{item.label}</span>
                        <Icon
                          icon="mdi:chevron-down"
                          className={`w-5 h-5 transition-transform duration-200 ${
                            sectionOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <div className={`${sectionOpen ? 'block' : 'hidden'} pl-4 space-y-2`}>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-accent-900 uppercase tracking-wider px-4 py-2">
                            By Year
                          </h4>
                          <div className="grid grid-cols-2 gap-2 px-4">
                            {years.slice(0, 6).map((year) => (
                              <AppLink
                                href={`/alumni/years/${year}`}
                                key={year}
                                className="text-sm text-accent-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-accent-50 transition-colors duration-200"
                              >
                                {year}
                              </AppLink>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-accent-100 mt-4 px-4">
                          <AppLink
                            href="/alumni/profiles"
                            className="block w-full text-center btn btn-primary btn-sm"
                          >
                            View All Alumni
                          </AppLink>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <AppLink
                      href={item.url}
                      className="block px-4 py-3 text-accent-700 hover:text-primary-600 hover:bg-accent-50 rounded-lg transition-colors duration-200"
                    >
                      {item.icon && (
                        <Icon icon={`mdi:${item.icon}`} className="w-4 h-4 mr-3 inline" />
                      )}
                      {item.label}
                    </AppLink>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

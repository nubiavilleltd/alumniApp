import { AppLink } from './AppLink';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="bg-gray-50 py-3" aria-label="Breadcrumb">
      <div className="container-custom">
        <ol className="flex items-center text-sm text-gray-600 whitespace-nowrap overflow-hidden">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                className="flex items-center min-w-0"
                key={`${item.label}-${index}`}
              >
                {item.href ? (
                  <AppLink
                    href={item.href}
                    className="hover:text-primary-600 truncate"
                  >
                    {item.label}
                  </AppLink>
                ) : (
                  <span
                    className={`font-medium ${
                      isLast
                        ? 'text-gray-900 truncate max-w-[40vw] sm:max-w-none'
                        : 'text-gray-500 truncate'
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <svg
                    className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
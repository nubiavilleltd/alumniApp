import { AppLink } from "./AppLink";

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
        <ol className="flex items-center text-sm text-gray-600">
          {items.map((item, index) => (
            <li className="flex items-center" key={`${item.label}-${index}`}>
              {item.href ? (
                <AppLink href={item.href} className="hover:text-primary-600">
                  {item.label}
                </AppLink>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <svg className="w-4 h-4 mx-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

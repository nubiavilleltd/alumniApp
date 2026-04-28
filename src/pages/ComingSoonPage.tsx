import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
}

export function ComingSoonPage({
  title = 'Coming Soon',
  description = "We're working on this feature and it will be available shortly.",
}: ComingSoonPageProps) {
  return (
    <>
      <SEO title={title} />
      <section className="section">
        <div className="container-custom text-center max-w-xl mx-auto">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-50">
            <Icon icon="mdi:clock-outline" className="w-10 h-10 text-primary-500" />
          </div>

          {/* Title */}
          {/* <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1> */}

          {/* Description */}
          <p className="text-gray-500 text-sm md:text-base mb-8">{description}</p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <AppLink href={ROUTES.HOME} className="btn btn-primary">
              Go Home
            </AppLink>
            {/* <AppLink
              href={ROUTES.CONTACT || '#'}
              className="text-sm text-primary-500 hover:underline"
            >
              Contact Us
            </AppLink> */}
          </div>
        </div>
      </section>
    </>
  );
}

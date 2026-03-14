import { Icon } from '@iconify/react';
import { getSiteConfig } from '@/data/content';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';

export default function HomeStats() {
  const config = getSiteConfig();
  const { data: alumni = [] } = useAlumni();

  return (
    <section className="section-sm bg-gradient-to-r from-accent-50 to-accent-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Icon icon="mdi:account-group" className="w-8 h-8 text-white" />
            </div>
            {/* <h3 className="text-3xl font-bold text-primary-900 mb-2">{alumni.length}+</h3> */}

            <h3 className="text-3xl font-bold text-primary-900 mb-2">
              {alumni.length > 100 ? `${Math.floor(alumni.length / 100) * 100}+` : alumni.length}
            </h3>
            <p className="text-accent-700 font-medium">Registered Alumnae</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Icon icon="mdi:calendar" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-primary-900 mb-2">
              {config.years.end - config.years.start + 1}
            </h3>
            <p className="text-accent-700 font-medium">Years</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Icon icon="mdi:map-marker" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-primary-900 mb-2">Global</h3>
            <p className="text-accent-700 font-medium">Network</p>
          </div>
        </div>
      </div>
    </section>
  );
}

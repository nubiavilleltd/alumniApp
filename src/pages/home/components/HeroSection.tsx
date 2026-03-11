import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import HeroBg from '../../../../public/hero-bg.png';

export default function HeroSection() {
  return (
    <section className="hero section-sm">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-accent-900 mb-6 leading-snug italic">
              Daughters of{' '}
              {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-900"> */}
              <span className="text-primary-600">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-accent-600 mb-8 leading-relaxed">
              A global sisterhood of Federal Government Girls' College alumnae connected by shared
              memories, driven by purpose, and committed to lifting the next generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <AppLink href="/auth/register">
                <Button className="py-3 px-12" size="lg">
                  {' '}
                  Join Us
                </Button>
              </AppLink>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              {/* <div className="bg-gradient-to-br from-primary-400 to-primary-900 rounded-3xl p-8 md:p-12 shadow-2xl"> */}
              <img src={HeroBg} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

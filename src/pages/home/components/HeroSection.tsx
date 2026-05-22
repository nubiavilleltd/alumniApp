import { useState, useEffect } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
// import HeroBg from '/hero-bg.png';
import HeroBg1 from '../../../../public/alumni-hero-img1.jpg';
// import HeroBg2 from '../../../../public/alumni-hero-img2.jpg'
import HeroBg3 from '../../../../public/alumni-hero-img3.jpg';
import HeroBg4 from '../../../../public/alumni-hero-img4.jpg';
import HeroBg5 from '../../../../public/alumni-hero-img5.jpg';
import HeroBg6 from '../../../../public/alumni-hero-img6.jpg';

import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { ROUTES } from '@/shared/constants/routes';

// const heroImages = [
//   HeroBg,
//   'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80', // group of women laughing together
//   'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=1400&q=80', // African women at a gathering
//   'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=1400&q=80', // professional women networking
//   'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1400&q=80', // women in meeting, smiling
// ];
const heroImages = [HeroBg1, HeroBg3, HeroBg4, HeroBg5, HeroBg6];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const currentUser = useIdentityStore((state) => state.user);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden px-0 lg:min-h-[78vh]">
      {/* ── Background Images ─────────────────────────────────────────────── */}
      {heroImages.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={src} alt="" className="w-full h-full object-cover object-center" />
        </div>
      ))}

      {/* ── Blue overlay ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-primary-700/90 via-primary-600/72 to-primary-900/28" />
      <div className="absolute inset-0 z-[1] bg-primary-500/20" />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-[var(--app-page-inline-padding)]">
        <div className="max-w-3xl text-left">
          <h1 className="type-hero mb-6 text-white">Welcome home</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
            A global sisterhood of Federal Government Girls' College alumnae connected by shared
            memories, driven by purpose, and committed to lifting the next generation.
          </p>
          <div className="flex flex-col items-start gap-4">
            {!currentUser ? (
              <AppLink href={AUTH_ROUTES.REGISTER}>
                <Button
                  size="lg"
                  className="type-button h-12 w-56 justify-center rounded-full bg-white px-12 text-primary-500 shadow-none hover:bg-white/90"
                >
                  Join Us
                </Button>
              </AppLink>
            ) : null}

            <AppLink href={ROUTES.DONATION}>
              <Button
                size="lg"
                className="type-button h-12 min-w-52 justify-center rounded-full border-0 bg-[#7c3aed] px-12 text-white shadow-none hover:bg-[#6d28d9]"
              >
                Make a Donation
                <img
                  src="/donationIcon.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                />
              </Button>
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}

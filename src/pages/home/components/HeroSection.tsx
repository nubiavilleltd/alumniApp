import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import HeroBg from '/hero-bg.png';
import { AUTH_ROUTES } from '@/features/authentication/routes';

const heroImages = [
  HeroBg,
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80', // group of women laughing together
  'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=1400&q=80', // African women at a gathering
  'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=1400&q=80', // professional women networking
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1400&q=80', // women in meeting, smiling
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
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

      {/* ── Dark overlay ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-black/50" />

      {/* ── Est. Badge ────────────────────────────────────────────────────── */}
      <div className="absolute top-6 left-6 z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 inline-block" />
          Est. 1966 · Nigeria
        </span>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold italic text-white mb-6 leading-tight">
          Welcome Home.
        </h1>
        <p className="text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-2xl mx-auto">
          The Connection is Real. Own Your Journey. Reconnect with your sisters, expand your
          network, and give back to the community that shaped us.
        </p>
        {!currentUser ? (
          <AppLink href={AUTH_ROUTES.REGISTER}>
            <Button size="lg" className="px-14 py-3.5 rounded-full font-bold text-base shadow-lg">
              Join us
            </Button>
          </AppLink>
        ) : null}
      </div>

      {/* ── Dot indicators ────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

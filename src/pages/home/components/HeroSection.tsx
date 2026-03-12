// import { AppLink } from '@/shared/components/ui/AppLink';
// import Button from '@/shared/components/ui/Button';
// import HeroBg from '/hero-bg.png';

// export default function HeroSection() {
//   return (
//     <section className="hero section-sm">
//       <div className="container-custom">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           <div className="text-center lg:text-left">
//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-accent-900 mb-6 leading-snug italic">
//               Daughters of{' '}
//               {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-900"> */}
//               <span className="text-primary-600">Excellence</span>
//             </h1>
//             <p className="text-xl md:text-2xl text-accent-600 mb-8 leading-relaxed">
//               The Connection is Real. Own Your Journey. Reconnect with your sisters, expand your network, and give back to the community that shaped us.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//               <AppLink href="/auth/register">
//                 <Button className="py-3 px-12" size="lg">
//                   {' '}
//                   Join Us
//                 </Button>
//               </AppLink>
//             </div>
//           </div>

//           <div className="relative">
//             <div className="relative z-10">
//               {/* <div className="bg-gradient-to-br from-primary-400 to-primary-900 rounded-3xl p-8 md:p-12 shadow-2xl"> */}
//               <img src={HeroBg} alt="" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// import { AppLink } from '@/shared/components/ui/AppLink';
// import Button from '@/shared/components/ui/Button';
// import HeroBg from '/hero-bg.png';

// export default function HeroSection() {
//   return (
//     <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
//       {/* ── Background Image ─────────────────────────────────────────────── */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src={HeroBg}
//           alt=""
//           className="w-full h-full object-cover object-center"
//         />
//         {/* Dark overlay for text readability */}
//         <div className="absolute inset-0 bg-black/50" />
//       </div>

//       {/* ── Est. Badge ───────────────────────────────────────────────────── */}
//       <div className="absolute top-6 left-6 z-10">
//         <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full">
//           <span className="w-1.5 h-1.5 rounded-full bg-primary-400 inline-block" />
//           Est. 1966 · Nigeria
//         </span>
//       </div>

//       {/* ── Content ──────────────────────────────────────────────────────── */}
//       <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
//         <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold italic text-white mb-6 leading-tight">
//           Welcome Home.
//         </h1>
//         <p className="text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-2xl mx-auto">
//           A global sisterhood of Federal Government Girls' College alumnae connected by
//           shared memories, driven by purpose, and committed to lifting the next generation.
//         </p>
//         <AppLink href="/auth/register">
//           <Button
//             size="lg"
//             variant="white"
//             className="px-14 py-3.5 rounded-full text-primary-600 font-bold text-base shadow-lg hover:shadow-xl transition-shadow"
//           >
//             Join us
//           </Button>
//         </AppLink>
//       </div>
//     </section>
//   );
// }

import { useState, useEffect } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import HeroBg from '/hero-bg.png';

const heroImages = [
  HeroBg,
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80', // group of women laughing together
  'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=1400&q=80', // African women at a gathering
  'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=1400&q=80', // professional women networking
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1400&q=80', // women in meeting, smiling
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

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
          A global sisterhood of Federal Government Girls' College alumnae connected by shared
          memories, driven by purpose, and committed to lifting the next generation.
        </p>
        <AppLink href="/auth/register">
          <Button size="lg" className="px-14 py-3.5 rounded-full font-bold text-base shadow-lg">
            Join us
          </Button>
        </AppLink>
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

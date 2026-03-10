// import { AppLink } from '@/shared/components/ui/AppLink';
// import Button from '@/shared/components/ui/Button';

// import OurStoryImg from "../../../../public/our-story.png"
// import React from 'react';

// export default function OurStory() {
//   return (
//     // <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
//     <section className="section">
//       {/* <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10"> */}
//       <div className="container-custom flex flex-col md:flex-row items-center gap-10">
//         {/* Text */}
//        <div className="flex-1">
//             <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
//               <span className="inline-block w-6 h-px bg-primary-500" />
//               Our Story
//             </p>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
//               A Legacy Woven <span className="text-primary-500 italic">in Crimson &amp; Gold</span>
//             </h2>
//             <p className="text-gray-600 text-sm leading-relaxed mb-4">
//               Federal Government Girls' College stands among Nigeria's most revered institutions — a
//               place where countless women first discovered their voice, their strength, and their
//               purpose. From dormitory friendships forged by candlelight to classroom debates that
//               shaped futures, FGGC made us who we are.
//             </p>
//             <p className="text-gray-600 text-sm leading-relaxed mb-8">
//               The Alumnae Association exists to honour that legacy: connecting women across
//               generations and continents, investing in current students, and ensuring the school
//               continues to produce Nigeria's finest daughters.
//             </p>
//             {/* <a
//             href="#"
//             className="inline-block bg-[#0077B6] text-white text-sm font-semibold px-8 py-3 rounded-md hover:bg-[#005f99] transition-colors"
//           >
//             Learn More
//           </a> */}

//            <AppLink href="/about" className="w-fit inline-block">
//             <Button styles="py-3 px-12"> Learn More</Button>
//           </AppLink>
//           </div>

//         {/* Image */}
//         <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
//           <div className="rounded-2xl overflow-hidden shadow-lg">
//             <img
//               src={OurStoryImg}
//               alt="FGGC Owerri students marching"
//               className="w-full h-72 object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import OurStoryImg from '../../../../public/our-story.png';

export default function OurStory() {
  return (
    <section className="section">
      <div className="container-custom grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-center">
        {/* Text */}
        <div>
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-primary-500" />
            Our Story
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
            A Legacy Woven <span className="text-primary-500 italic">in Crimson &amp; Gold</span>
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Federal Government Girls' College stands among Nigeria's most revered institutions — a
            place where countless women first discovered their voice, their strength, and their
            purpose. From dormitory friendships forged by candlelight to classroom debates that
            shaped futures, FGGC made us who we are.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The Alumnae Association exists to honour that legacy: connecting women across
            generations and continents, investing in current students, and ensuring the school
            continues to produce Nigeria's finest daughters.
          </p>
          <AppLink href="/about" className="w-fit inline-block">
            <Button className="py-3 px-12" size='lg'>Learn More</Button>
          </AppLink>
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={OurStoryImg}
            alt="FGGC Owerri students marching"
            className="w-full h-72 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

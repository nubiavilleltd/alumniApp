// import React from "react";
// import Leadership1 from "../../../../public/leadership-1.png"
// import Leadership2 from "../../../../public/leadership-2.png"
// import Leadership3 from "../../../../public/leadership-3.png"
// import Leadership4 from "../../../../public/leadership-4.png"
// import Leadership5 from "../../../../public/leadership-5.png"
// import Leadership6 from "../../../../public/leadership-6.png"
// import Leadership7 from "../../../../public/leadership-7.png"

// interface LeadershipMember {
//   id: number;
//   name: string;
//   role: string;
//   image: string;
//   featured?: boolean;
//   bio?: string;
// }

// const members: LeadershipMember[] = [
//   {
//     id: 1,
//     name: "Mrs. Stella Alochi",
//     role: "President, Federal Government Girls Collage (FGGC) Alumnae Association.",
//     image: Leadership1,
//     featured: true,
//     bio: `Welcome to the official website of the Federal Government Girls Collage (FGGC) Alumnae Association. We are more than graduates—we are the fire forged in shared halls, the quiet strength that shatters ceilings, and the unstoppable force lifting the next generation.\n\nFrom boardrooms to classrooms, from startups to policy tables, our alumnae prove every day: education here didn't just open doors—it built empires, healed communities, and changed nations.\n\nAs your Alumnae President, I see you: the doctors saving lives, the entrepreneurs building legacies, the mothers raising revolutionaries, the leaders shaping tomorrow.`,
//   },
//   {
//     id: 2,
//     name: "Mrs. Abigal Ojo",
//     role: "Vice President, Federal Government Girls Collage (FGGC) Alumnae Association.",
//     image: Leadership2,
//   },
//   {
//     id: 3,
//     name: "Mrs. Josephine Adeka",
//     role: "P.R.O, Federal Government Girls Collage (FGGC) Alumnae Association.",
//     image: Leadership3,
//   },
//   {
//     id: 4,
//     name: "Mrs. Favour Adah",
//     role: "Secretary, Federal Government Girls Collage (FGGC) Alumnae Association.",
//     image: Leadership4,
//   },
//   {
//     id: 5,
//     name: "Mrs. Lilian Ojo",
//     role: "Secretary Gen, Federal Government Girls Collage (FGGC) Alumnae Association.",
//     image: Leadership5,
//   },
//   {
//     id: 6,
//     name: "Mrs. Goodness Adeka",
//     role: "Cashier, Federal Government Girls Collage (FGGC) Alumnae Association.",
//     image: Leadership6,
//   },
//   {
//     id: 7,
//     name: "Mrs. Bella Adah",
//     role: "Event Planner, Federal Government Girls Collage (FGGC) Alumnae Association.",
//     image: Leadership7,
//   },
// ];

// function MemberCard({ member }: { member: LeadershipMember }) {
//   return (
//     <div className="flex flex-col items-center text-center">
//       <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
//         <img
//           src={member.image}
//           alt={member.name}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//         />
//       </div>
//       <h4 className="text-gray-900 font-semibold text-sm">{member.name}</h4>
//       <p className="text-gray-400 text-[11px] mt-1 leading-snug">{member.role}</p>
//     </div>
//   );
// }

// export default function Leadership() {
//   const president = members.find((m) => m.featured);
//   const board = members.filter((m) => !m.featured);

//   return (
//     // <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
//     <section className="section">
//       {/* <div className="max-w-5xl mx-auto"> */}
//       <div className="container-custom">
//         {/* Header tag */}
//         <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-8 flex items-center gap-2">
//           <span className="inline-block w-6 h-px bg-primary-500" />
//           Leadership
//         </p>

//         {/* President feature row */}
//         {president && (
//           <div className="flex flex-col md:flex-row gap-10 mb-14">
//             {/* Text */}
//             <div className="flex-1">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
//                 From the{" "}
//                 <span className="text-primary-500 italic">President</span> of the
//                 Association.
//               </h2>
//               {president.bio?.split("\n\n").map((para, i) => (
//                 <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">
//                   {para}
//                 </p>
//               ))}
//             </div>

//             {/* President photo */}
//             {/* <div className="flex-shrink-0 flex flex-col items-center w-full md:w-64"> */}
//             <div className="flex-shrink-0 flex flex-col items-center w-full md:w-64">
//               <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
//                 <img
//                   src={president.image}
//                   alt={president.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <p className="text-gray-900 font-semibold text-sm mt-3">
//                 {president.name}
//               </p>
//               <p className="text-gray-400 text-[11px] text-center leading-snug mt-1">
//                 {president.role}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Board grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
//           {board.map((member) => (
//             <MemberCard key={member.id} member={member} />
//           ))}
//         </div>

//         <div className="mt-8 text-right">
//           <a
//             href="#"
//             className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
//           >
//             See More <span>→</span>
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// import React from 'react';
// import Leadership1 from '../../../../public/leadership-1.png';
// import Leadership2 from '../../../../public/leadership-2.png';
// import Leadership3 from '../../../../public/leadership-3.png';
// import Leadership4 from '../../../../public/leadership-4.png';
// import Leadership5 from '../../../../public/leadership-5.png';
// import Leadership6 from '../../../../public/leadership-6.png';
// import Leadership7 from '../../../../public/leadership-7.png';

// interface LeadershipMember {
//   id: number;
//   name: string;
//   role: string;
//   image: string;
//   featured?: boolean;
//   bio?: string;
// }

// const members: LeadershipMember[] = [
//   {
//     id: 1,
//     name: 'Mrs. Stella Alochi',
//     role: 'President, Federal Government Girls Collage (FGGC) Alumnae Association.',
//     image: Leadership1,
//     featured: true,
//     bio: `Welcome to the official website of the Federal Government Girls Collage (FGGC) Alumnae Association. We are more than graduates—we are the fire forged in shared halls, the quiet strength that shatters ceilings, and the unstoppable force lifting the next generation.\n\nFrom boardrooms to classrooms, from startups to policy tables, our alumnae prove every day: education here didn't just open doors—it built empires, healed communities, and changed nations.\n\nAs your Alumnae President, I see you: the doctors saving lives, the entrepreneurs building legacies, the mothers raising revolutionaries, the leaders shaping tomorrow.`,
//   },
//   {
//     id: 2,
//     name: 'Mrs. Abigal Ojo',
//     role: 'Vice President, Federal Government Girls Collage (FGGC) Alumnae Association.',
//     image: Leadership2,
//   },
//   {
//     id: 3,
//     name: 'Mrs. Josephine Adeka',
//     role: 'P.R.O, Federal Government Girls Collage (FGGC) Alumnae Association.',
//     image: Leadership3,
//   },
//   {
//     id: 4,
//     name: 'Mrs. Favour Adah',
//     role: 'Secretary, Federal Government Girls Collage (FGGC) Alumnae Association.',
//     image: Leadership4,
//   },
//   {
//     id: 5,
//     name: 'Mrs. Lilian Ojo',
//     role: 'Secretary Gen, Federal Government Girls Collage (FGGC) Alumnae Association.',
//     image: Leadership5,
//   },
//   {
//     id: 6,
//     name: 'Mrs. Goodness Adeka',
//     role: 'Cashier, Federal Government Girls Collage (FGGC) Alumnae Association.',
//     image: Leadership6,
//   },
//   {
//     id: 7,
//     name: 'Mrs. Bella Adah',
//     role: 'Event Planner, Federal Government Girls Collage (FGGC) Alumnae Association.',
//     image: Leadership7,
//   },
// ];

// function MemberCard({ member }: { member: LeadershipMember }) {
//   return (
//     <div className="flex flex-col items-center text-center">
//       <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
//         <img
//           src={member.image}
//           alt={member.name}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//         />
//       </div>
//       <h4 className="text-gray-900 font-semibold text-sm">{member.name}</h4>
//       <p className="text-gray-400 text-[11px] mt-1 leading-snug">{member.role}</p>
//     </div>
//   );
// }

// export default function Leadership() {
//   const president = members.find((m) => m.featured);
//   const board = members.filter((m) => !m.featured);

//   return (
//     <section className="section">
//       <div className="container-custom">
//         {/* Header tag */}
//         <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-8 flex items-center gap-2">
//           <span className="inline-block w-6 h-px bg-primary-500" />
//           Leadership
//         </p>

//         {/* President feature row */}
//         {president && (
//           <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 mb-14 items-start">
//             {/* Text */}
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
//                 From the <span className="text-primary-500 italic">President</span> of the
//                 Association.
//               </h2>
//               {president.bio?.split('\n\n').map((para, i) => (
//                 <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">
//                   {para}
//                 </p>
//               ))}
//             </div>

//             {/* President photo */}
//             <div className="flex flex-col items-center">
//               <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
//                 <img
//                   src={president.image}
//                   alt={president.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <p className="text-gray-900 font-semibold text-sm mt-3 text-center">
//                 {president.name}
//               </p>
//               <p className="text-gray-400 text-[11px] text-center leading-snug mt-1">
//                 {president.role}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Board grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
//           {board.map((member) => (
//             <MemberCard key={member.id} member={member} />
//           ))}
//         </div>

//         <div className="mt-8 text-right">
//           <a
//             href="#"
//             className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
//           >
//             See More <span>→</span>
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }





import React from "react";
import Leadership1 from "../../../../public/leadership-1.png"
import Leadership2 from "../../../../public/leadership-2.png"
import Leadership3 from "../../../../public/leadership-3.png"
import Leadership4 from "../../../../public/leadership-4.png"
import Leadership5 from "../../../../public/leadership-5.png"
import Leadership6 from "../../../../public/leadership-6.png"
import Leadership7 from "../../../../public/leadership-7.png"

interface LeadershipMember {
  id: number;
  name: string;
  role: string;
  image: string;
  featured?: boolean;
  bio?: string;
}

const members: LeadershipMember[] = [
  {
    id: 1,
    name: "Mrs. Stella Alochi",
    role: "President, Federal Government Girls Collage (FGGC) Alumnae Association.",
    image: Leadership1,
    featured: true,
    bio: `Welcome to the official website of the Federal Government Girls Collage (FGGC) Alumnae Association. We are more than graduates—we are the fire forged in shared halls, the quiet strength that shatters ceilings, and the unstoppable force lifting the next generation.\n\nFrom boardrooms to classrooms, from startups to policy tables, our alumnae prove every day: education here didn't just open doors—it built empires, healed communities, and changed nations.\n\nAs your Alumnae President, I see you: the doctors saving lives, the entrepreneurs building legacies, the mothers raising revolutionaries, the leaders shaping tomorrow.`,
  },
  {
    id: 2,
    name: "Mrs. Abigal Ojo",
    role: "Vice President, Federal Government Girls Collage (FGGC) Alumnae Association.",
    image: Leadership2,
  },
  {
    id: 3,
    name: "Mrs. Josephine Adeka",
    role: "P.R.O, Federal Government Girls Collage (FGGC) Alumnae Association.",
    image: Leadership3,
  },
  {
    id: 4,
    name: "Mrs. Favour Adah",
    role: "Secretary, Federal Government Girls Collage (FGGC) Alumnae Association.",
    image: Leadership4,
  },
  {
    id: 5,
    name: "Mrs. Lilian Ojo",
    role: "Secretary Gen, Federal Government Girls Collage (FGGC) Alumnae Association.",
    image: Leadership5,
  },
  {
    id: 6,
    name: "Mrs. Goodness Adeka",
    role: "Cashier, Federal Government Girls Collage (FGGC) Alumnae Association.",
    image: Leadership6,
  },
  {
    id: 7,
    name: "Mrs. Bella Adah",
    role: "Event Planner, Federal Government Girls Collage (FGGC) Alumnae Association.",
    image: Leadership7,
  },
];

function MemberCard({ member }: { member: LeadershipMember }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-full max-w-[200px] aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h4 className="text-gray-900 font-semibold text-sm">{member.name}</h4>
      <p className="text-gray-400 text-[11px] mt-1 leading-snug">{member.role}</p>
    </div>
  );
}

export default function Leadership() {
  const president = members.find((m) => m.featured);
  const board = members.filter((m) => !m.featured);

  return (
    <section className="section">
      <div className="container-custom">

        {/* Header tag */}
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-8 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Leadership
        </p>

        {/* President feature row */}
        {president && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 mb-14 items-start">
            {/* Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
                From the{" "}
                <span className="text-primary-500 italic">President</span> of the Association.
              </h2>
              {president.bio?.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">
                  {para}
                </p>
              ))}
            </div>

            {/* President photo */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                <img
                  src={president.image}
                  alt={president.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-900 font-semibold text-sm mt-3 text-center">
                {president.name}
              </p>
              <p className="text-gray-400 text-[11px] text-center leading-snug mt-1">
                {president.role}
              </p>
            </div>
          </div>
        )}

        {/* Board grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {board.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        <div className="mt-8 text-right">
          <a
            href="#"
            className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            See More <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}

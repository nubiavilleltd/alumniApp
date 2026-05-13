import { AppLink } from '@/shared/components/ui/AppLink';

import { useLeadership } from '@/features/leadership/hooks/useLeadership';
import { LeadershipMember } from '@/features/leadership/types/leadership.types';

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="about-eyebrow">
      <span className="about-eyebrow__corner about-eyebrow__corner--left" />
      <span className="about-eyebrow__corner about-eyebrow__corner--right" />
      <span className="about-eyebrow__label">{children}</span>
    </div>
  );
}

function MemberCard({ member }: { member: LeadershipMember }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* <div className="h-57 w-full overflow-hidden bg-gray-100"> */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100 rounded-2xl">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="py-3 px-3 bg-white">
        <h4 className="text-gray-900 font-bold text-sm">{member.name}</h4>
        <p className="text-gray-400 text-xs mt-0.5">{member.role}</p>
      </div>
    </div>
  );
}

function MemberCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-57 bg-gray-200" />
      <div className="py-3 px-3 flex flex-col items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

export default function Leadership() {
  const { data: members = [], isLoading } = useLeadership();

  const president = members.find((m) => m.featured);
  const board = members.filter((m) => !m.featured);

  return (
    <section className="section">
      <div className="container-custom">
        <div className="mb-12">
          <SectionEyebrow>Our Leadership</SectionEyebrow>
          <p className="font-semibold text-gray-700 mt-2">Meet the woment leading the way</p>
        </div>

        {/* President feature row */}
        {/* {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 mb-14 items-start animate-pulse">
            <div className="flex flex-col gap-4">
              <div className="h-10 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="w-full aspect-[3/4] bg-gray-200 rounded-2xl" />
          </div>
        ) : (
          president && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 mb-14 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
                  From the <span className="text-primary-500 italic">President</span> of the
                  Association.
                </h2>
                {president.bio?.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">
                    {para}
                  </p>
                ))}
              </div>
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
          )
        )} */}

        {/* President feature row */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 mb-14 items-start animate-pulse">
            <div className="flex flex-col gap-3">
              <div className="h-8 bg-gray-200 rounded w-40" />
              <div className="h-5 bg-gray-200 rounded w-52" />
              <div className="w-full aspect-[3/4] bg-gray-200 rounded-2xl" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        ) : (
          president && (
            <div>
              {/* Heading */}
              <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-700 leading-tight">
                  From the President
                </h2>

                <h3 className="text-lg font-semibold text-gray-600 ">-{president.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 mb-14 items-start">
                {/* Left Column */}
                <div className="w-full max-w-[260px] mx-auto md:mx-0">
                  {/* Image */}
                  {/* <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gray-100"> */}
                  <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-md bg-gray-100">
                    <img
                      src={president.image}
                      alt={president.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="pt-1">
                  {president.bio?.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-700 text-md leading-relaxed mb-6">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* Board grid */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <MemberCardSkeleton key={i} />)
            : board.map((member) => <MemberCard key={member.id} member={member} />)}
        </div> */}

        {/* Board grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <MemberCardSkeleton key={i} />)
            : board.map((member) => <MemberCard key={member.id} member={member} />)}
        </div>
      </div>
    </section>
  );
}

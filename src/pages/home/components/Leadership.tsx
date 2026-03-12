import { AppLink } from '@/shared/components/ui/AppLink';

import { useLeadership } from '@/features/leadership/hooks/useLeadership';
import { LeadershipMember } from '@/features/leadership/types/leadership.types';

function MemberCard({ member }: { member: LeadershipMember }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div className="h-57 w-full overflow-hidden bg-gray-100">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="py-3 px-3 text-center bg-white">
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
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-8 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Leadership
        </p>

        {/* President feature row */}
        {isLoading ? (
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
        )}

        {/* Board grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <MemberCardSkeleton key={i} />)
            : board.map((member) => <MemberCard key={member.id} member={member} />)}
        </div>

        <div className="mt-8 text-right">
          <AppLink
            href="/leadership"
            className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            See More → 
          </AppLink>
        </div>
      </div>
    </section>
  );
}

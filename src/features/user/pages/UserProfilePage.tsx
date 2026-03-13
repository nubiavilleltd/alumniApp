import { Icon } from '@iconify/react';
import { useState } from 'react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import EditProfileModal from '../components/ui/EditProfileModal';

export default function UserProfilePage() {
  const currentUser = useAuthStore((state) => state.user);
  const [showEdit, setShowEdit] = useState(false);

  const initials = (currentUser?.fullName ?? 'U')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Profile' },
  ];

  const fields = [
    { label: 'Full Name', value: currentUser?.fullName, icon: 'mdi:account-outline' },
    { label: 'Email', value: currentUser?.email, icon: 'mdi:email-outline' },
    { label: 'Phone', value: currentUser?.phone, icon: 'mdi:phone-outline' },
    { label: 'Position', value: currentUser?.position, icon: 'mdi:briefcase-outline' },
    { label: 'Company', value: currentUser?.company, icon: 'mdi:office-building-outline' },
    { label: 'Location', value: currentUser?.location, icon: 'mdi:map-marker-outline' },
  ];

  const socials = [
    { label: 'LinkedIn', value: currentUser?.social?.linkedin, icon: 'mdi:linkedin' },
    { label: 'Twitter', value: currentUser?.social?.twitter, icon: 'mdi:twitter' },
    { label: 'GitHub', value: currentUser?.social?.github, icon: 'mdi:github' },
  ].filter((s) => s.value);

  return (
    <>
      <SEO title="My Profile" description="View and manage your profile." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside className="lg:col-span-1 h-fit space-y-4">
              {/* Profile card */}
              <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center mb-4">
                  {currentUser?.photo ? (
                    <img
                      src={currentUser.photo}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary-400">{initials}</span>
                  )}
                </div>

                <h1 className="text-lg font-bold text-gray-800">
                  {currentUser?.fullName ?? 'Your Name'}
                </h1>
                <p className="text-sm text-primary-500 mt-0.5">
                  {[currentUser?.position, currentUser?.company].filter(Boolean).join(' at ') ||
                    'Add your role'}
                </p>
                {currentUser?.location && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Icon icon="mdi:map-marker-outline" className="w-3.5 h-3.5" />
                    {currentUser.location}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="mt-5 w-full flex items-center justify-center gap-2 border border-primary-200 text-primary-500 hover:bg-primary-50 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {/* Social links card */}
              {socials.length > 0 && (
                <div className="bg-white shadow-md rounded-2xl p-5">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Social Links
                  </h2>
                  <div className="flex flex-col gap-2">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.value}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-500 transition-colors"
                      >
                        <Icon icon={s.icon} className="w-4 h-4 text-primary-400" />
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main className="lg:col-span-2 space-y-6">
              {/* Basic info */}
              <section className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="mdi:account-outline" className="w-5 h-5 text-primary-400" />
                    Basic Information
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowEdit(true)}
                    className="text-xs text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1"
                  >
                    <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>

                <div className="divide-y divide-gray-50">
                  {fields.map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Icon icon={icon} className="w-4 h-4" />
                        {label}
                      </div>
                      <p
                        className={`text-sm font-medium ${value ? 'text-gray-700' : 'text-gray-300 italic'}`}
                      >
                        {value || 'Not added'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bio */}
              <section className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <Icon icon="mdi:text-account" className="w-5 h-5 text-primary-400" />
                    About Me
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowEdit(true)}
                    className="text-xs text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1"
                  >
                    <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
                <p
                  className={`text-sm leading-relaxed ${currentUser?.bio ? 'text-gray-700' : 'text-gray-300 italic'}`}
                >
                  {currentUser?.bio || 'No bio added yet. Tell your fellow alumnae about yourself.'}
                </p>
              </section>
            </main>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        currentUser={currentUser}
      />
    </>
  );
}

/**
 * ============================================================================
 * ADMIN MEMBERS MANAGEMENT PAGE - WITH ROLE MANAGEMENT
 * ============================================================================
 *
 * Route: /admin/members
 *
 * Features:
 * - View all users
 * - Activate/Deactivate accounts
 * - Change user roles (admin <-> member) ← NEW
 *
 * ============================================================================
 */

import {
  Check,
  CheckCircle,
  LoaderCircle,
  Mail,
  Phone,
  UserSearch,
  UserX,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import {
  useAdminDeactivateUser,
  useAdminActivateUser,
} from '@/features/admin/hooks/useUserManagement';
import { useChangeUserRole } from '@/features/admin/hooks/useRoleManagement';
import type { AccountStatus } from '@/features/admin/api/adapters/user-management.adapter';
import {
  getRoleOptions,
  type UserRole,
} from '@/features/admin/api/adapters/role-management.adapter';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { getPhotoDisplay, resolveProfilePhoto } from '@/features/user/utils/profileUtils';
import { Avatar } from '@/shared/components/ui/Avatar';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { Pagination } from '@/shared/components/ui/Pagination';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { AdminBanner } from '@/features/admin/components/AdminBanner';

function generateInitialsAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=E5E7EB&color=6B7280&size=256`;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type DisplayUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'member';
  accountStatus: AccountStatus;
  photo?: string;
};

const ADMIN_MEMBERS_PER_PAGE = 10;
const memberActionButtonClassName =
  'flex h-[33px] w-[134px] items-center justify-center gap-1 rounded-[48px] border-2 px-4 py-2 text-sm font-semibold leading-none transition-colors disabled:opacity-50';

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: MAP ALUMNI TO DISPLAY USER
// ═══════════════════════════════════════════════════════════════════════════

function mapAlumniToDisplayUser(alumni: Alumni, currentUserMemberId?: string): DisplayUser {
  return {
    id: alumni.memberId,
    fullName: alumni.name,
    email: alumni.email,
    phone: alumni.whatsappPhone,
    role: alumni.role === 'admin' ? 'admin' : 'member',
    accountStatus: alumni.isActive ? 'active' : 'inactive',
    photo: resolveProfilePhoto({
      photoUrl: alumni.photo,
      privacy: alumni.privacy,
      isOwner: alumni.memberId === currentUserMemberId,
      isSignedIn: Boolean(currentUserMemberId),
    }),
  };
}

function AdminMembersPageSkeleton() {
  return (
    <section className="min-h-screen animate-pulse bg-[#F8F8F7] py-8 sm:py-10">
      <div className="container-custom space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[144px] rounded-[2rem] bg-gray-200" />
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="h-12 flex-1 rounded-full bg-white" />
          <div className="flex gap-2">
            <div className="h-12 w-[82px] rounded-full bg-gray-200" />
            <div className="h-12 w-[100px] rounded-full bg-gray-200" />
            <div className="h-12 w-[100px] rounded-full bg-gray-200" />
          </div>
        </div>

        {/* User rows */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <UserRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ NEW: CHANGE ROLE MODAL
// ═══════════════════════════════════════════════════════════════════════════

function ChangeRoleModal({
  user,
  isOpen,
  onClose,
}: {
  user: DisplayUser;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user.role === 'admin' ? 'admin' : 'alumni',
  );

  const changeRole = useChangeUserRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await changeRole.mutateAsync({
        userId: user.id,
        newRole: selectedRole,
      });
      onClose();
    } catch (error) {
      // Error toast shown by mutation
    }
  };

  const roleOptions = getRoleOptions();
  const isBusy = changeRole.isPending;

  // Get initials
  const initials = user.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Change User Role</h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
          {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary-700">{initials}</span>
          </div> */}
          <Avatar
            src={user.photo ?? generateInitialsAvatar(user.fullName)}
            alt={user.fullName}
            size={48}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full flex-shrink-0">
            {user.role === 'admin' ? 'ADMIN' : 'MEMBER'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <SelectInput
              label="New Role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              options={roleOptions}
              disabled={isBusy}
              hint="This will change the user's role and permissions immediately."
              controlClassName="rounded-lg px-4 py-2.5 pr-10 text-sm shadow-none"
              className="gap-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isBusy || selectedRole === (user.role === 'admin' ? 'admin' : 'alumni')}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  {/* <Check className="w-4 h-4" /> */}
                  Change Role
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 btn btn-outline whitespace-nowrap disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USER ROW COMPONENT - UPDATED WITH ROLE CHANGE BUTTON
// ═══════════════════════════════════════════════════════════════════════════

function UserRow({ user }: { user: DisplayUser }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false); // ← NEW

  const deactivate = useAdminDeactivateUser();
  const activate = useAdminActivateUser();

  const isActive = user.accountStatus === 'active';
  const isBusy = deactivate.isPending || activate.isPending;

  const handleAction = async () => {
    try {
      if (actionType === 'deactivate') {
        await deactivate.mutateAsync(user.id);
      } else if (actionType === 'activate') {
        await activate.mutateAsync(user.id);
      }
      setShowConfirm(false);
      setActionType(null);
    } catch (error) {
      // Error toast shown by mutation
    }
  };

  const openConfirm = (action: 'activate' | 'deactivate') => {
    setActionType(action);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setActionType(null);
  };

  // Get initials
  const initials = user.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-200 hover:shadow-sm transition-all">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar
            src={user.photo ?? generateInitialsAvatar(user.fullName)}
            alt={user.fullName}
            size={48}
          />

          {/* Info + buttons wrapper */}
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* User info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900">{user.fullName}</p>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full flex-shrink-0">
                    ADMIN
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 min-w-0">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              {user.phone && (
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {!showConfirm ? (
              <div className="flex flex-col items-stretch gap-2 flex-shrink-0 w-full sm:flex-row sm:items-center md:w-auto">
                {isActive && (
                  <button
                    onClick={() => setShowRoleModal(true)}
                    disabled={isBusy}
                    className={`${memberActionButtonClassName} border-purple-200 text-purple-600 hover:bg-purple-50`}
                  >
                    Change Role
                  </button>
                )}
                <button
                  onClick={() => openConfirm(isActive ? 'deactivate' : 'activate')}
                  disabled={isBusy}
                  className={`${memberActionButtonClassName} ${
                    isActive
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0 w-full md:w-auto">
                <button
                  onClick={handleAction}
                  disabled={isBusy}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors text-center ${
                    actionType === 'deactivate'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isBusy ? <LoaderCircle className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm'}
                </button>
                <button
                  onClick={closeConfirm}
                  disabled={isBusy}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-center"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChangeRoleModal user={user} isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON (unchanged)
// ═══════════════════════════════════════════════════════════════════════════

function UserRowSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-[33px] w-[134px] rounded-[48px] bg-gray-200" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE (unchanged except imports)
// ═══════════════════════════════════════════════════════════════════════════

export function AdminMembersPage() {
  const currentUser = useIdentityStore((state) => state.user);
  const { data: alumniList = [], isLoading } = useAlumni();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const users = useMemo(() => {
    return alumniList.map((alumni) => mapAlumniToDisplayUser(alumni, currentUser?.memberId));
  }, [alumniList, currentUser?.memberId]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((u) => u.accountStatus === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) => u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [users, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ADMIN_MEMBERS_PER_PAGE));
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * ADMIN_MEMBERS_PER_PAGE,
    currentPage * ADMIN_MEMBERS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const activeCount = users.filter((u) => u.accountStatus === 'active').length;
  const inactiveCount = users.filter((u) => u.accountStatus === 'inactive').length;

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <>
        <SEO title="Manage Members" description="View and manage all members" />
        <AdminBanner activeTab="members" title="Members" />
        <AdminMembersPageSkeleton />
      </>
    );
  }

  return (
    <>
      <SEO title="Manage Members" description="View and manage all members" />
      <AdminBanner activeTab="members" title="Members" />

      <section className="min-h-screen bg-[#F8F8F7] py-8 sm:py-10">
        <div className="container-custom space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="min-h-[144px] rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white/80">Total Members</p>
                  <p className="mt-3 text-4xl font-bold">{users.length}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <Users className="h-9 w-9 text-white" />
                </div>
              </div>
            </div>

            <div className="min-h-[144px] rounded-[2rem] bg-gradient-to-br from-green-500 to-green-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white/80">Active Members</p>
                  <p className="mt-3 text-4xl font-bold">{activeCount}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <CheckCircle className="h-9 w-9 text-white" />
                </div>
              </div>
            </div>

            <div className="min-h-[144px] rounded-[2rem] bg-gradient-to-br from-gray-500 to-gray-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white/80">Inactive Members</p>
                  <p className="mt-3 text-4xl font-bold">{inactiveCount}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <UserX className="h-9 w-9 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="min-w-0 flex-1">
              <SearchInput
                placeholder="Search by name or email..."
                value={searchQuery}
                onValueChange={(value) => {
                  setSearchQuery(value);
                  setCurrentPage(1);
                }}
                className="w-full"
                inputClassName="!h-12 !border-0 !pl-12 !pr-5 !text-base !shadow-none focus:!ring-0"
                iconClassName="!left-5 !h-5 !w-5 !text-[#828282]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex w-full flex-wrap gap-2 sm:w-[298px] sm:flex-nowrap">
              {(['all', 'active', 'inactive'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setStatusFilter(filter);
                    setCurrentPage(1);
                  }}
                  className={`h-12 rounded-[40px] border px-6 text-base font-semibold capitalize transition-colors sm:px-0 ${
                    filter === 'all' ? 'sm:w-[82px]' : 'sm:w-[100px]'
                  } ${
                    statusFilter === filter
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-primary-100 bg-white text-gray-500 hover:border-primary-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <UserRowSkeleton key={i} />)
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <UserSearch className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {searchQuery ? 'No users found matching your search' : 'No users found'}
                </p>
              </div>
            ) : (
              visibleUsers.map((user) => <UserRow key={user.id} user={user} />)
            )}
          </div>

          {!isLoading && filteredUsers.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          ) : null}
        </div>
      </section>
    </>
  );
}

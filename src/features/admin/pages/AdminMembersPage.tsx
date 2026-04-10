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

import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
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
import { ROUTES } from '@/shared/constants/routes';
import { ADMIN_ROUTES } from '../routes';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { Avatar } from '@/shared/components/ui/Avatar';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
  { label: 'Members' },
];

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
  photo: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: MAP ALUMNI TO DISPLAY USER
// ═══════════════════════════════════════════════════════════════════════════

function mapAlumniToDisplayUser(alumni: Alumni): DisplayUser {
  return {
    id: alumni.memberId,
    fullName: alumni.name,
    email: alumni.email,
    phone: alumni.whatsappPhone,
    role: alumni.role === 'admin' ? 'admin' : 'member',
    accountStatus: alumni.isActive ? 'active' : 'inactive',
    photo: alumni.photo,
  };
}

function AdminMembersPageSkeleton() {
  return (
    <section className="section py-8 animate-pulse">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-200" />
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded" />
            ))}
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
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
          {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary-700">{initials}</span>
          </div> */}
          <Avatar src={user.photo} alt={user.fullName} size={48} />
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              disabled={isBusy}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              This will change the user's role and permissions immediately.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isBusy || selectedRole === (user.role === 'admin' ? 'admin' : 'alumni')}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="w-4 h-4" />
                  Change Role
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 btn btn-outline disabled:opacity-50"
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
        <div className="flex items-center justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar */}
            {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-700">{user.avatar}</span>
            </div> */}

            <Avatar src={user.photo} alt={user.fullName} size={48} />

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>

                {/* Role Badge */}
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
                    ADMIN
                  </span>
                )}

                {/* Status Badge */}
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:email-outline" className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:phone-outline" className="w-3.5 h-3.5" />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ✅ UPDATED: Action Buttons */}
          {!showConfirm ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* ✅ NEW: Change Role button (only for active users) */}
              {isActive && (
                <button
                  onClick={() => setShowRoleModal(true)}
                  disabled={isBusy}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  Change Role
                </button>
              )}

              {/* Activate/Deactivate button */}
              <button
                onClick={() => openConfirm(isActive ? 'deactivate' : 'activate')}
                disabled={isBusy}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border border-red-200 text-red-600 hover:bg-red-50'
                    : 'border border-green-200 text-green-600 hover:bg-green-50'
                }`}
              >
                {isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAction}
                disabled={isBusy}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
                  actionType === 'deactivate'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isBusy ? <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" /> : 'Confirm'}
              </button>
              <button
                onClick={closeConfirm}
                disabled={isBusy}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ NEW: Role Change Modal */}
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
        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE (unchanged except imports)
// ═══════════════════════════════════════════════════════════════════════════

export function AdminMembersPage() {
  const { data: alumniList = [], isLoading } = useAlumni();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');

  const users = useMemo(() => {
    return alumniList.map(mapAlumniToDisplayUser);
  }, [alumniList]);

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

  const activeCount = users.filter((u) => u.accountStatus === 'active').length;
  const inactiveCount = users.filter((u) => u.accountStatus === 'inactive').length;

  if (isLoading) {
    return (
      <>
        <SEO title="Manage Members" description="View and manage all members" />
        <Breadcrumbs items={breadcrumbItems} />
        <AdminMembersPageSkeleton />
      </>
    );
  }

  return (
    <>
      <SEO title="Manage Members" description="View and manage all members" />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-8">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Manage Members</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all registered user accounts
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Total Members</p>
                  <p className="text-3xl font-bold mt-2">{users.length}</p>
                </div>
                <Icon icon="mdi:account-group" className="w-12 h-12 text-white/20" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Active</p>
                  <p className="text-3xl font-bold mt-2">{activeCount}</p>
                </div>
                <Icon icon="mdi:check-circle" className="w-12 h-12 text-white/20" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Inactive</p>
                  <p className="text-3xl font-bold mt-2">{inactiveCount}</p>
                </div>
                <Icon icon="mdi:account-off" className="w-12 h-12 text-white/20" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    statusFilter === 'inactive'
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <UserRowSkeleton key={i} />)
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Icon
                  icon="mdi:account-search-outline"
                  className="w-16 h-16 text-gray-300 mx-auto mb-3"
                />
                <p className="text-gray-500 text-sm">
                  {searchQuery ? 'No users found matching your search' : 'No users found'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => <UserRow key={user.id} user={user} />)
            )}
          </div>
        </div>
      </section>
    </>
  );
}

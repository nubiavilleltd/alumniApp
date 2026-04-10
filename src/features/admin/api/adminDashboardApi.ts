// features/admin/api/adminDashboardApi.ts
//
// Admin-only API layer. Completely separate from userDashboardApi.
// Only accessible via AdminRoute.
//

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import {
  buildApprovePayload,
  buildMemberListPayload,
  buildRejectPayload,
  mapBackendMemberToPending,
  mapBackendMemberToRecent,
  mapMemberListResponse,
} from './adapters/adminDashboard.adapter';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminStat {
  id: 'members' | 'pending' | 'events' | 'revenue';
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'primary' | 'accent' | 'secondary' | 'warning';
}

export interface PendingMember {
  id: string; // backend user_id, always stringified
  fullName: string;
  nameInSchool: string;
  email: string;
  graduationYear: number;
  submittedAt: string; // ISO date string
}

export interface RecentMember {
  name: string;
  email: string;
  joinedAt: string; // ISO date string
  slug: string;
}

export interface AdminDashboardData {
  stats: AdminStat[];
  pendingApprovals: PendingMember[];
  recentMembers: RecentMember[];
  upcomingEvents: { title: string; date: string; location: string; href: string }[];
}

export interface ApproveResult {
  success: boolean;
  message: string;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────
// Centralised here so one-line changes cover both the payload builder and call.

// ─── Stat placeholders ────────────────────────────────────────────────────────
// These are shown while the real counts aren't available from the backend yet.
// The pending count is filled in dynamically from getPendingMembers().

function buildStatPlaceholders(pendingCount: number): AdminStat[] {
  return [
    {
      id: 'members',
      label: 'Total Members',
      value: '—', // 🔴 TODO: real count from backend stats endpoint
      detail: 'Approved & active',
      icon: 'mdi:account-group-outline',
      tone: 'primary',
    },
    {
      id: 'pending',
      label: 'Pending Approvals',
      value: String(pendingCount),
      detail: 'Awaiting your review',
      icon: 'mdi:account-clock-outline',
      tone: 'warning',
    },
    {
      id: 'events',
      label: 'Upcoming Events',
      value: '—', // 🔴 TODO: real count from backend stats endpoint
      detail: 'Scheduled this quarter',
      icon: 'mdi:calendar-star',
      tone: 'accent',
    },
    {
      id: 'revenue',
      label: 'Dues Collected',
      value: '—', // 🔴 TODO: real figure from backend dues endpoint
      detail: 'Current period',
      icon: 'mdi:cash-multiple',
      tone: 'secondary',
    },
  ];
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const adminDashboardApi = {
  /**
   * Fetch members pending admin approval.
   * POST /api/admin/members/list  { action_type: "pending Approval" }
   */
  async getPendingMembers(): Promise<PendingMember[]> {
    const payload = buildMemberListPayload('pending Approval');
    const { data } = await apiClient.post(API_ENDPOINTS.ADMIN_ENDPOINTS.MEMBER_LIST, payload);
    return mapMemberListResponse(data, mapBackendMemberToPending) as PendingMember[];
  },

  /**
   * Fetch already-approved members (for the recent members panel).
   * POST /api/admin/members/list  { action_type: "approved" }
   */
  async getApprovedMembers(): Promise<RecentMember[]> {
    const payload = buildMemberListPayload('approved');
    const { data } = await apiClient.post(API_ENDPOINTS.ADMIN_ENDPOINTS.MEMBER_LIST, payload);
    return mapMemberListResponse(data, mapBackendMemberToRecent) as RecentMember[];
  },

  /**
   * Load everything the dashboard page needs in parallel.
   * Stats are assembled locally until a real stats endpoint is available.
   */
  async getDashboard(): Promise<AdminDashboardData> {
    // Fire both member-list calls in parallel
    const [pendingMembers, recentMembers] = await Promise.allSettled([
      adminDashboardApi.getPendingMembers(),
      adminDashboardApi.getApprovedMembers(),
    ]);

    const pending = pendingMembers.status === 'fulfilled' ? pendingMembers.value : [];
    const recent = recentMembers.status === 'fulfilled' ? recentMembers.value : [];

    // Log partial failures for debugging without breaking the whole dashboard
    if (pendingMembers.status === 'rejected') {
      console.error('[adminDashboardApi] getPendingMembers failed:', pendingMembers.reason);
    }
    if (recentMembers.status === 'rejected') {
      console.error('[adminDashboardApi] getApprovedMembers failed:', recentMembers.reason);
    }

    return {
      stats: buildStatPlaceholders(pending.length),
      pendingApprovals: pending,
      // recentMembers: recent,
      recentMembers: Array.isArray(recent) ? recent.slice(0, 5) : [],
      upcomingEvents: [], // 🔴 TODO: real upcoming events endpoint
    };
  },

  /**
   * Approve a pending member.
   * POST /api/approve_user  { user_id, action: "approve" }
   *
   * Returns a normalised result so the UI doesn't need to parse the response.
   */
  async approveMember(userId: string): Promise<ApproveResult> {
    try {
      const payload = buildApprovePayload(userId);
      const { data } = await apiClient.post(API_ENDPOINTS.ADMIN_ENDPOINTS.APPROVE_USER, payload);

      return {
        success: true,
        message: data?.message ?? data?.msg ?? 'User account approved successfully',
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.response?.data?.detail ??
        'Approval failed. Please try again.';

      // 403 means the logged-in user isn't an admin — surface clearly
      if (error.response?.status === 403) {
        throw new Error('Access denied. Admin role required.');
      }
      // 404 means the user_id the backend received was wrong
      if (error.response?.status === 404) {
        throw new Error('Member not found. They may have already been processed.');
      }

      throw new Error(message);
    }
  },

  /**
   * Reject a pending member, with an optional reason.
   * POST /api/approve_user  { user_id, action: "reject", reject_reason? }
   */
  async rejectMember(userId: string, reason?: string): Promise<ApproveResult> {
    try {
      const payload = buildRejectPayload(userId, reason);
      const { data } = await apiClient.post(API_ENDPOINTS.ADMIN_ENDPOINTS.APPROVE_USER, payload);

      return {
        success: true,
        message: data?.message ?? data?.msg ?? 'User account rejected',
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.response?.data?.detail ??
        'Rejection failed. Please try again.';

      if (error.response?.status === 403) {
        throw new Error('Access denied. Admin role required.');
      }
      if (error.response?.status === 404) {
        throw new Error('Member not found. They may have already been processed.');
      }

      throw new Error(message);
    }
  },
};

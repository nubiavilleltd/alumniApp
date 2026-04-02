// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { getLeadership, getLeaderById } from '@/data/site-data';
// import { LeadershipMember } from '../types/leadership.types';

// export const leadershipService = {
//   getAll: async (): Promise<LeadershipMember[]> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.LEADERSHIP.LIST);
//     // return data;

//     // 🟢 MOCK — delete when API is ready
//     return getLeadership();
//   },

//   getById: async (id: number): Promise<LeadershipMember | undefined> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.LEADERSHIP.DETAIL(String(id)));
//     // return data;

//     // 🟢 MOCK — delete when API is ready
//     return getLeaderById(id);
//   },
// };

/**
 * ============================================================================
 * LEADERSHIP SERVICE
 * ============================================================================
 *
 * Real backend integration for leadership team
 *
 * ENDPOINTS:
 * - POST /api/get_leadership (public, token only)
 *
 * CMS features (create/update/delete) will be added later
 *
 * ============================================================================
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getLeadership, getLeaderById } from '@/data/site-data';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type { LeadershipMember } from '../types/leadership.types';
import {
  extractLeadershipFromResponse,
  mapBackendLeaderToFrontend,
} from '../adapters/leadership.adapter';
// import {
//   mapBackendLeadersToFrontend,
//   mapBackendLeaderToFrontend,
//   extractLeadershipFromResponse,
// } from '../api/adapters/leadership.adapter';

export const leadershipService = {
  /**
   * Get all leadership members
   * POST /api/get_leadership
   */
  getAll: async (): Promise<LeadershipMember[]> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LEADERSHIP.GET_LEADERSHIP);

      console.log('📥 Leadership response:', response.data);

      // Extract and transform data
      const { all } = extractLeadershipFromResponse(response.data);

      console.log(`✅ Loaded ${all.length} leadership members`);
      return all;
    } catch (error) {
      console.error('Failed to fetch leadership:', error);

      // Fallback to mock data
      console.warn('⚠️ Using mock leadership data');
      return getLeadership();
    }
  },

  /**
   * Get featured leader (President)
   * POST /api/get_leadership with is_featured: "1"
   */
  getFeatured: async (): Promise<LeadershipMember | null> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LEADERSHIP.GET_LEADERSHIP, {
        is_featured: '1',
      });

      const { featured } = extractLeadershipFromResponse(response.data);
      return featured;
    } catch (error) {
      console.error('Failed to fetch featured leader:', error);

      // Fallback to mock
      const allLeaders = getLeadership();
      return allLeaders.find((l) => l.featured) || null;
    }
  },

  /**
   * Get leadership team (non-featured members)
   */
  getTeam: async (): Promise<LeadershipMember[]> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LEADERSHIP.GET_LEADERSHIP);

      const { team } = extractLeadershipFromResponse(response.data);
      return team;
    } catch (error) {
      console.error('Failed to fetch leadership team:', error);

      // Fallback to mock
      const allLeaders = getLeadership();
      return allLeaders.filter((l) => !l.featured);
    }
  },

  /**
   * Get single leader by ID
   * POST /api/get_leadership with id
   */
  getById: async (id: number): Promise<LeadershipMember | undefined> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LEADERSHIP.GET_LEADERSHIP, {
        id: String(id),
      });

      // Handle different response structures
      let leaderData = null;

      if (response.data.leader) {
        leaderData = response.data.leader;
      } else if (response.data.featured && Array.isArray(response.data.featured)) {
        leaderData = response.data.featured[0];
      } else if (response.data.all && Array.isArray(response.data.all)) {
        leaderData = response.data.all[0];
      } else if (Array.isArray(response.data)) {
        leaderData = response.data[0];
      }

      if (!leaderData) return undefined;

      return mapBackendLeaderToFrontend(leaderData);
    } catch (error) {
      console.error(`Failed to fetch leader ${id}:`, error);

      // Fallback to mock
      return getLeaderById(id);
    }
  },
};

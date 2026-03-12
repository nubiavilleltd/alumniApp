import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getLeadership, getLeaderById } from '@/data/site-data';
import { LeadershipMember } from '../types/leadership.types';

export const leadershipService = {
  getAll: async (): Promise<LeadershipMember[]> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.LEADERSHIP.LIST);
    // return data;

    // 🟢 MOCK — delete when API is ready
    return getLeadership();
  },

  getById: async (id: number): Promise<LeadershipMember | undefined> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.LEADERSHIP.DETAIL(String(id)));
    // return data;

    // 🟢 MOCK — delete when API is ready
    return getLeaderById(id);
  },
};

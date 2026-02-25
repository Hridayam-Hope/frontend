import { create } from "zustand";
import type {
  VolunteerApplicationListItem,
  VolunteerProfileListItem,
  VolunteerProfile,
  VolunteerOpportunity,
} from "@/types/api";
import * as api from "@/lib/api/volunteers";

interface VolunteersState {
  // Applications
  applications: VolunteerApplicationListItem[];
  appsTotal: number;
  appsPage: number;
  appsTotalPages: number;
  appsLoading: boolean;

  // Volunteers list
  volunteers: VolunteerProfileListItem[];
  volTotal: number;
  volPage: number;
  volTotalPages: number;
  volLoading: boolean;

  // Detail cache
  volunteerCache: Record<number, VolunteerProfile>;
  detailLoading: boolean;

  // Opportunities
  opportunities: VolunteerOpportunity[];
  oppsLoaded: boolean;

  // Actions
  fetchApplications: (params?: { page?: number; status?: string }) => Promise<void>;
  approveApplication: (id: number, notes?: string) => Promise<void>;
  rejectApplication: (id: number, notes?: string) => Promise<void>;
  fetchVolunteers: (params?: { page?: number }) => Promise<void>;
  fetchVolunteer: (id: number, force?: boolean) => Promise<VolunteerProfile>;
  fetchOpportunities: (force?: boolean) => Promise<void>;
}

export const useVolunteersStore = create<VolunteersState>((set, get) => ({
  applications: [],
  appsTotal: 0,
  appsPage: 1,
  appsTotalPages: 0,
  appsLoading: false,
  volunteers: [],
  volTotal: 0,
  volPage: 1,
  volTotalPages: 0,
  volLoading: false,
  volunteerCache: {},
  detailLoading: false,
  opportunities: [],
  oppsLoaded: false,

  fetchApplications: async (params) => {
    set({ appsLoading: true });
    try {
      const res = await api.getApplications({ page: 1, page_size: 20, ...params });
      set({
        applications: res.items,
        appsTotal: res.total,
        appsPage: res.page,
        appsTotalPages: res.total_pages,
        appsLoading: false,
      });
    } catch {
      set({ appsLoading: false });
    }
  },

  approveApplication: async (id, notes) => {
    await api.approveApplication(id, notes);
    const { appsPage } = get();
    get().fetchApplications({ page: appsPage });
  },

  rejectApplication: async (id, notes) => {
    await api.rejectApplication(id, notes);
    const { appsPage } = get();
    get().fetchApplications({ page: appsPage });
  },

  fetchVolunteers: async (params) => {
    set({ volLoading: true });
    try {
      const res = await api.getVolunteers({ page: 1, page_size: 20, ...params });
      set({
        volunteers: res.items,
        volTotal: res.total,
        volPage: res.page,
        volTotalPages: res.total_pages,
        volLoading: false,
      });
    } catch {
      set({ volLoading: false });
    }
  },

  fetchVolunteer: async (id, force = false) => {
    const cached = get().volunteerCache[id];
    if (cached && !force) return cached;

    set({ detailLoading: true });
    try {
      const vol = await api.getVolunteer(id);
      set((s) => ({
        volunteerCache: { ...s.volunteerCache, [id]: vol },
        detailLoading: false,
      }));
      return vol;
    } catch (err) {
      set({ detailLoading: false });
      throw err;
    }
  },

  fetchOpportunities: async (force = false) => {
    if (get().oppsLoaded && !force) return;
    try {
      const opps = await api.getOpportunities();
      set({ opportunities: opps, oppsLoaded: true });
    } catch {
      // ignore
    }
  },
}));

import { create } from "zustand";
import type {
  VolunteerApplicationListItem,
  VolunteerApplicationDetail,
  VolunteerProfileListItem,
  VolunteerProfileDetail,
  VolunteerOpportunity,
  VolunteerOpportunityDetail,
  VolunteerActivity,
  VolunteerCertificate,
  CampaignVolunteerItem,
  VolunteerSkill,
} from "@/types/api";
import * as api from "@/lib/api/volunteers";

interface VolunteersState {
  // Applications
  applications: VolunteerApplicationListItem[];
  appsTotal: number;
  appsPage: number;
  appsTotalPages: number;
  appsLoading: boolean;
  applicationCache: Record<number, VolunteerApplicationDetail>;
  appDetailLoading: boolean;

  // Volunteers list
  volunteers: VolunteerProfileListItem[];
  volTotal: number;
  volPage: number;
  volTotalPages: number;
  volLoading: boolean;

  // Detail cache
  volunteerCache: Record<number, VolunteerProfileDetail>;
  detailLoading: boolean;

  // Volunteer sub-data
  activities: VolunteerActivity[];
  activitiesLoading: boolean;
  certificates: VolunteerCertificate[];
  certificatesLoading: boolean;
  campaignAssignments: CampaignVolunteerItem[];
  assignmentsLoading: boolean;

  // Opportunities
  opportunities: VolunteerOpportunity[];
  oppsTotal: number;
  oppsPage: number;
  oppsTotalPages: number;
  oppsLoading: boolean;
  opportunityCache: Record<number, VolunteerOpportunityDetail>;
  oppDetailLoading: boolean;

  // Skills
  skills: VolunteerSkill[];
  skillsLoading: boolean;

  // Actions
  fetchSkills: () => Promise<void>;
  fetchApplications: (params?: Record<string, unknown>) => Promise<void>;
  fetchApplication: (id: number, force?: boolean) => Promise<VolunteerApplicationDetail>;
  approveApplication: (id: number, notes?: string) => Promise<void>;
  rejectApplication: (id: number, notes?: string) => Promise<void>;
  fetchVolunteers: (params?: Record<string, unknown>) => Promise<void>;
  fetchVolunteer: (id: number, force?: boolean) => Promise<VolunteerProfileDetail>;
  createVolunteer: (data: Record<string, unknown>) => Promise<void>;
  updateVolunteer: (id: number, data: Record<string, unknown>) => Promise<VolunteerProfileDetail>;
  deactivateVolunteer: (id: number) => Promise<void>;
  fetchActivities: (volunteerId: number) => Promise<void>;
  fetchCertificates: (volunteerId: number) => Promise<void>;
  fetchOpportunities: (params?: Record<string, unknown>) => Promise<void>;
  fetchOpportunity: (id: number, force?: boolean) => Promise<VolunteerOpportunityDetail>;
  closeOpportunity: (id: number) => Promise<void>;
}

export const useVolunteersStore = create<VolunteersState>((set, get) => ({
  applications: [],
  appsTotal: 0,
  appsPage: 1,
  appsTotalPages: 0,
  appsLoading: false,
  applicationCache: {},
  appDetailLoading: false,
  volunteers: [],
  volTotal: 0,
  volPage: 1,
  volTotalPages: 0,
  volLoading: false,
  volunteerCache: {},
  detailLoading: false,
  activities: [],
  activitiesLoading: false,
  certificates: [],
  certificatesLoading: false,
  campaignAssignments: [],
  assignmentsLoading: false,
  opportunities: [],
  oppsTotal: 0,
  oppsPage: 1,
  oppsTotalPages: 0,
  oppsLoading: false,
  opportunityCache: {},
  oppDetailLoading: false,
  skills: [],
  skillsLoading: false,

  // ── Skills ──

  fetchSkills: async () => {
    if (get().skills.length > 0) return;
    set({ skillsLoading: true });
    try {
      const data = await api.getSkills();
      set({ skills: data, skillsLoading: false });
    } catch {
      set({ skillsLoading: false });
    }
  },

  // ── Applications ──

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

  fetchApplication: async (id, force = false) => {
    const cached = get().applicationCache[id];
    if (cached && !force) return cached;
    set({ appDetailLoading: true });
    try {
      const app = await api.getApplication(id);
      set((s) => ({
        applicationCache: { ...s.applicationCache, [id]: app },
        appDetailLoading: false,
      }));
      return app;
    } catch (err) {
      set({ appDetailLoading: false });
      throw err;
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

  // ── Volunteers ──

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

  createVolunteer: async (data) => {
    await api.createVolunteer(data);
    get().fetchVolunteers();
  },

  updateVolunteer: async (id, data) => {
    await api.updateVolunteer(id, data);
    // Force-refresh detail cache so the page shows fresh data
    const updated = await get().fetchVolunteer(id, true);
    return updated;
  },

  deactivateVolunteer: async (id) => {
    await api.deactivateVolunteer(id);
    // Refresh list and invalidate cache
    set((s) => {
      const newCache = { ...s.volunteerCache };
      delete newCache[id];
      return { volunteerCache: newCache };
    });
    get().fetchVolunteers();
  },

  // ── Activities & Certificates ──

  fetchActivities: async (volunteerId) => {
    set({ activitiesLoading: true });
    try {
      const data = await api.getVolunteerActivities(volunteerId);
      set({ activities: data, activitiesLoading: false });
    } catch {
      set({ activitiesLoading: false });
    }
  },

  fetchCertificates: async (volunteerId) => {
    set({ certificatesLoading: true });
    try {
      const data = await api.getVolunteerCertificates(volunteerId);
      set({ certificates: data, certificatesLoading: false });
    } catch {
      set({ certificatesLoading: false });
    }
  },

  // ── Opportunities ──

  fetchOpportunities: async (params) => {
    set({ oppsLoading: true });
    try {
      const res = await api.getAllOpportunities({ page: 1, page_size: 20, ...params });
      set({
        opportunities: res.items,
        oppsTotal: res.total,
        oppsPage: res.page,
        oppsTotalPages: res.total_pages,
        oppsLoading: false,
      });
    } catch {
      set({ oppsLoading: false });
    }
  },

  fetchOpportunity: async (id, force = false) => {
    const cached = get().opportunityCache[id];
    if (cached && !force) return cached;
    set({ oppDetailLoading: true });
    try {
      const opp = await api.getOpportunity(id);
      set((s) => ({
        opportunityCache: { ...s.opportunityCache, [id]: opp },
        oppDetailLoading: false,
      }));
      return opp;
    } catch (err) {
      set({ oppDetailLoading: false });
      throw err;
    }
  },

  closeOpportunity: async (id) => {
    await api.closeOpportunity(id);
    set((s) => {
      const newCache = { ...s.opportunityCache };
      delete newCache[id];
      return { opportunityCache: newCache };
    });
    get().fetchOpportunities();
  },
}));

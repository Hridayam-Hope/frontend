import { create } from "zustand";
import type {
  InKindDonationListItem,
  InKindDonationDetail,
  InKindDonationStats,
} from "@/types/api";
import * as api from "@/lib/api/inkind";

interface InKindState {
  donations: InKindDonationListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  donationCache: Record<number, InKindDonationDetail>;
  detailLoading: boolean;

  stats: InKindDonationStats | null;
  statsLoading: boolean;

  fetchDonations: (params?: { page?: number; status?: string }) => Promise<void>;
  fetchDonation: (id: number, force?: boolean) => Promise<InKindDonationDetail>;
  fetchStats: (force?: boolean) => Promise<void>;
  updateStatus: (id: number, status: string, notes?: string, tracking_number?: string) => Promise<void>;
  issueCertificate: (id: number) => Promise<string>;
  createDonation: (data: Record<string, unknown>) => Promise<InKindDonationDetail>;
}

export const useInKindStore = create<InKindState>((set, get) => ({
  donations: [],
  total: 0,
  page: 1,
  totalPages: 0,
  listLoading: false,
  donationCache: {},
  detailLoading: false,
  stats: null,
  statsLoading: false,

  fetchDonations: async (params) => {
    set({ listLoading: true });
    try {
      const res = await api.getInKindDonations({ page: 1, page_size: 20, ...params });
      set({
        donations: res.items,
        total: res.total,
        page: res.page,
        totalPages: res.total_pages,
        listLoading: false,
      });
    } catch {
      set({ listLoading: false });
    }
  },

  fetchDonation: async (id, force = false) => {
    const cached = get().donationCache[id];
    if (cached && !force) return cached;

    set({ detailLoading: true });
    try {
      const donation = await api.getInKindDonation(id);
      set((s) => ({
        donationCache: { ...s.donationCache, [id]: donation },
        detailLoading: false,
      }));
      return donation;
    } catch (err) {
      set({ detailLoading: false });
      throw err;
    }
  },

  fetchStats: async (force = false) => {
    if (get().stats && !force) return;
    set({ statsLoading: true });
    try {
      const stats = await api.getInKindStats();
      set({ stats, statsLoading: false });
    } catch {
      set({ statsLoading: false });
    }
  },

  updateStatus: async (id, status, notes, tracking_number) => {
    await api.updateInKindStatus(id, { status, notes, tracking_number });
    await get().fetchDonation(id, true);
    // Refresh list
    const { page } = get();
    get().fetchDonations({ page });
  },

  issueCertificate: async (id) => {
    const res = await api.issueInKindCertificate(id);
    await get().fetchDonation(id, true);
    return res.message;
  },

  createDonation: async (data) => {
    const donation = await api.createInKindDonation(data);
    set((s) => ({
      donationCache: { ...s.donationCache, [donation.id]: donation },
    }));
    const { page } = get();
    get().fetchDonations({ page });
    get().fetchStats(true);
    return donation;
  },
}));

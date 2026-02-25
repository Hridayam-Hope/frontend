import { create } from "zustand";
import type {
  DonationListItem,
  DonationDetail,
  DonationStats,
} from "@/types/api";
import * as api from "@/lib/api/donations";

interface DonationsState {
  donations: DonationListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  donationCache: Record<number, DonationDetail>;
  detailLoading: boolean;

  stats: DonationStats | null;
  statsLoading: boolean;

  fetchDonations: (params?: { page?: number; status?: string; campaign_id?: number }) => Promise<void>;
  fetchDonation: (id: number, force?: boolean) => Promise<DonationDetail>;
  fetchStats: (force?: boolean) => Promise<void>;
  issueCertificate: (id: number) => Promise<string>;
}

export const useDonationsStore = create<DonationsState>((set, get) => ({
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
      const res = await api.getDonations({ page: 1, page_size: 20, ...params });
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
      const donation = await api.getDonation(id);
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
      const stats = await api.getDonationStats();
      set({ stats, statsLoading: false });
    } catch {
      set({ statsLoading: false });
    }
  },

  issueCertificate: async (id) => {
    const res = await api.issueTaxCertificate(id);
    await get().fetchDonation(id, true);
    return res.message;
  },
}));

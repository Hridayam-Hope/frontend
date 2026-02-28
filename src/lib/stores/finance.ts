import { create } from "zustand";
import type {
  VolunteerDonationListItem,
  VolunteerDonationDetail,
  VolunteerDonationSummary,
  BulkDonationResult,
} from "@/types/api";
import * as api from "@/lib/api/finance";

interface FinanceState {
  // List
  donations: VolunteerDonationListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  // Detail cache
  donationCache: Record<number, VolunteerDonationDetail>;
  detailLoading: boolean;

  // Summary
  summary: VolunteerDonationSummary | null;
  summaryLoading: boolean;

  // Actions
  fetchDonations: (params?: {
    page?: number;
    page_size?: number;
    volunteer_id?: number;
    date_from?: string;
    date_to?: string;
    payment_method?: string;
    search?: string;
  }) => Promise<void>;
  fetchDonation: (id: number, force?: boolean) => Promise<VolunteerDonationDetail>;
  fetchSummary: (force?: boolean) => Promise<void>;
  createDonation: (data: {
    volunteer_id: number;
    amount: number;
    date: string;
    payment_method: string;
    transaction_reference?: string;
    notes?: string;
  }) => Promise<VolunteerDonationDetail>;
  updateDonation: (id: number, data: Record<string, unknown>) => Promise<VolunteerDonationDetail>;
  deleteDonation: (id: number) => Promise<string>;
  bulkCreate: (donations: {
    volunteer_id: number;
    amount: number;
    date: string;
    payment_method: string;
    transaction_reference?: string;
    notes?: string;
  }[]) => Promise<BulkDonationResult>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  donations: [],
  total: 0,
  page: 1,
  totalPages: 0,
  listLoading: false,
  donationCache: {},
  detailLoading: false,
  summary: null,
  summaryLoading: false,

  fetchDonations: async (params) => {
    set({ listLoading: true });
    try {
      const res = await api.getVolunteerDonations({ page: 1, page_size: 20, ...params });
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
      const donation = await api.getVolunteerDonation(id);
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

  fetchSummary: async (force = false) => {
    if (get().summary && !force) return;
    set({ summaryLoading: true });
    try {
      const summary = await api.getVolunteerDonationSummary();
      set({ summary, summaryLoading: false });
    } catch {
      set({ summaryLoading: false });
    }
  },

  createDonation: async (data) => {
    const donation = await api.createVolunteerDonation(data);
    set((s) => ({
      donationCache: { ...s.donationCache, [donation.id]: donation },
    }));
    // Refresh list and summary
    get().fetchDonations();
    get().fetchSummary(true);
    return donation;
  },

  updateDonation: async (id, data) => {
    const donation = await api.updateVolunteerDonation(id, data);
    set((s) => ({
      donationCache: { ...s.donationCache, [id]: donation },
    }));
    get().fetchDonations();
    get().fetchSummary(true);
    return donation;
  },

  deleteDonation: async (id) => {
    const res = await api.deleteVolunteerDonation(id);
    set((s) => {
      const newCache = { ...s.donationCache };
      delete newCache[id];
      return { donationCache: newCache };
    });
    get().fetchDonations();
    get().fetchSummary(true);
    return res.message;
  },

  bulkCreate: async (donations) => {
    const result = await api.bulkCreateDonations(donations);
    get().fetchDonations();
    get().fetchSummary(true);
    return result;
  },
}));

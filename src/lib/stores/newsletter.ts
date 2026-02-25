import { create } from "zustand";
import type {
  NewsletterListItem,
  SubscriberListItem,
  NewsletterStats,
} from "@/types/api";
import * as api from "@/lib/api/newsletter";

interface NewsletterState {
  newsletters: NewsletterListItem[];
  nlTotal: number;
  nlPage: number;
  nlTotalPages: number;
  nlLoading: boolean;

  subscribers: SubscriberListItem[];
  subTotal: number;
  subPage: number;
  subTotalPages: number;
  subLoading: boolean;

  stats: NewsletterStats | null;
  statsLoaded: boolean;

  fetchNewsletters: (params?: { page?: number; status?: string }) => Promise<void>;
  fetchSubscribers: (params?: { page?: number; status?: string }) => Promise<void>;
  fetchStats: (force?: boolean) => Promise<void>;
}

export const useNewsletterStore = create<NewsletterState>((set, get) => ({
  newsletters: [],
  nlTotal: 0,
  nlPage: 1,
  nlTotalPages: 0,
  nlLoading: false,
  subscribers: [],
  subTotal: 0,
  subPage: 1,
  subTotalPages: 0,
  subLoading: false,
  stats: null,
  statsLoaded: false,

  fetchNewsletters: async (params) => {
    set({ nlLoading: true });
    try {
      const res = await api.getNewsletters({ page: 1, page_size: 20, ...params });
      set({
        newsletters: res.items,
        nlTotal: res.total,
        nlPage: res.page,
        nlTotalPages: res.total_pages,
        nlLoading: false,
      });
    } catch {
      set({ nlLoading: false });
    }
  },

  fetchSubscribers: async (params) => {
    set({ subLoading: true });
    try {
      const res = await api.getSubscribers({ page: 1, page_size: 20, ...params });
      set({
        subscribers: res.items,
        subTotal: res.total,
        subPage: res.page,
        subTotalPages: res.total_pages,
        subLoading: false,
      });
    } catch {
      set({ subLoading: false });
    }
  },

  fetchStats: async (force = false) => {
    if (get().statsLoaded && !force) return;
    try {
      const stats = await api.getNewsletterStats();
      set({ stats, statsLoaded: true });
    } catch {
      // ignore
    }
  },
}));

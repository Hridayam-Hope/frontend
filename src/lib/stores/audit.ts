import { create } from "zustand";
import type { AuditLogListItem, AuditLogDetail, AuditLogStats } from "@/types/api";
import * as api from "@/lib/api/audit";

interface AuditState {
  logs: AuditLogListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  logCache: Record<number, AuditLogDetail>;
  detailLoading: boolean;

  stats: AuditLogStats | null;
  statsLoaded: boolean;

  fetchLogs: (params?: {
    page?: number;
    action?: string;
    entity_type?: string;
    search?: string;
  }) => Promise<void>;
  fetchLog: (id: number) => Promise<AuditLogDetail>;
  fetchStats: (force?: boolean) => Promise<void>;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  logs: [],
  total: 0,
  page: 1,
  totalPages: 0,
  listLoading: false,
  logCache: {},
  detailLoading: false,
  stats: null,
  statsLoaded: false,

  fetchLogs: async (params) => {
    set({ listLoading: true });
    try {
      const res = await api.getAuditLogs({ page: 1, page_size: 20, ...params });
      set({
        logs: res.items,
        total: res.total,
        page: res.page,
        totalPages: res.total_pages,
        listLoading: false,
      });
    } catch {
      set({ listLoading: false });
    }
  },

  fetchLog: async (id) => {
    const cached = get().logCache[id];
    if (cached) return cached;

    set({ detailLoading: true });
    try {
      const log = await api.getAuditLog(id);
      set((s) => ({
        logCache: { ...s.logCache, [id]: log },
        detailLoading: false,
      }));
      return log;
    } catch (err) {
      set({ detailLoading: false });
      throw err;
    }
  },

  fetchStats: async (force = false) => {
    if (get().statsLoaded && !force) return;
    try {
      const stats = await api.getAuditStats();
      set({ stats, statsLoaded: true });
    } catch {
      // ignore
    }
  },
}));

import { create } from "zustand";
import type {
  PaginatedResponse,
  CampaignListItem,
  CampaignDetail,
  CampaignMedia,
  CampaignUpdate,
  Category,
} from "@/types/api";
import * as api from "@/lib/api/campaigns";

interface CampaignsState {
  // List
  campaigns: CampaignListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  // Detail cache
  campaignCache: Record<number, CampaignDetail>;
  detailLoading: boolean;

  // Categories
  categories: Category[];
  categoriesLoaded: boolean;

  // Media
  media: CampaignMedia[];
  mediaLoading: boolean;

  // Updates
  updates: CampaignUpdate[];
  updatesLoading: boolean;

  // Actions
  fetchCampaigns: (params?: { page?: number; status?: string; search?: string; category_id?: number; campaign_type?: string }) => Promise<void>;
  fetchCampaign: (id: number, force?: boolean) => Promise<CampaignDetail>;
  fetchCategories: (force?: boolean) => Promise<void>;
  createCampaign: (data: Record<string, unknown>) => Promise<CampaignDetail>;
  updateCampaign: (id: number, data: Record<string, unknown>) => Promise<CampaignDetail>;
  deleteCampaign: (id: number) => Promise<void>;
  updateStatus: (id: number, status: string) => Promise<void>;
  invalidateList: () => void;

  // Category actions
  createCategory: (data: Partial<Category>) => Promise<Category>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;

  // Media actions
  fetchMedia: (campaignId: number) => Promise<void>;
  uploadMedia: (campaignId: number, file: File) => Promise<void>;
  deleteMedia: (mediaId: number, campaignId: number) => Promise<void>;

  // Update actions
  fetchUpdates: (campaignId: number) => Promise<void>;
  createUpdate: (campaignId: number, data: { title: string; content: string; is_published?: boolean }) => Promise<CampaignUpdate>;
}

export const useCampaignsStore = create<CampaignsState>((set, get) => ({
  campaigns: [],
  total: 0,
  page: 1,
  totalPages: 0,
  listLoading: false,
  campaignCache: {},
  detailLoading: false,
  categories: [],
  categoriesLoaded: false,
  media: [],
  mediaLoading: false,
  updates: [],
  updatesLoading: false,

  fetchCampaigns: async (params) => {
    set({ listLoading: true });
    try {
      const res = await api.getCampaigns({ page: 1, page_size: 20, ...params });
      set({
        campaigns: res.items,
        total: res.total,
        page: res.page,
        totalPages: res.total_pages,
        listLoading: false,
      });
    } catch {
      set({ listLoading: false });
    }
  },

  fetchCampaign: async (id, force = false) => {
    const cached = get().campaignCache[id];
    if (cached && !force) return cached;

    set({ detailLoading: true });
    try {
      const campaign = await api.getCampaign(id);
      set((s) => ({
        campaignCache: { ...s.campaignCache, [id]: campaign },
        detailLoading: false,
      }));
      return campaign;
    } catch (err) {
      set({ detailLoading: false });
      throw err;
    }
  },

  fetchCategories: async (force = false) => {
    if (get().categoriesLoaded && !force) return;
    try {
      const categories = await api.getCategories();
      set({ categories, categoriesLoaded: true });
    } catch {
      // ignore
    }
  },

  createCampaign: async (data) => {
    const campaign = await api.createCampaign(data);
    set((s) => ({
      campaignCache: { ...s.campaignCache, [campaign.id]: campaign },
    }));
    get().invalidateList();
    return campaign;
  },

  updateCampaign: async (id, data) => {
    const campaign = await api.updateCampaign(id, data);
    set((s) => ({
      campaignCache: { ...s.campaignCache, [id]: campaign },
    }));
    get().invalidateList();
    return campaign;
  },

  deleteCampaign: async (id) => {
    await api.deleteCampaign(id);
    set((s) => {
      const cache = { ...s.campaignCache };
      delete cache[id];
      return { campaignCache: cache };
    });
    get().invalidateList();
  },

  updateStatus: async (id, status) => {
    await api.updateCampaignStatus(id, status);
    await get().fetchCampaign(id, true);
    get().invalidateList();
  },

  invalidateList: () => {
    const { page } = get();
    get().fetchCampaigns({ page });
  },

  // Category actions
  createCategory: async (data) => {
    const category = await api.createCategory(data);
    set({ categoriesLoaded: false });
    await get().fetchCategories(true);
    return category;
  },

  updateCategory: async (id, data) => {
    const category = await api.updateCategory(id, data);
    set({ categoriesLoaded: false });
    await get().fetchCategories(true);
    return category;
  },

  deleteCategory: async (id) => {
    await api.deleteCategory(id);
    set({ categoriesLoaded: false });
    await get().fetchCategories(true);
  },

  // Media actions
  fetchMedia: async (campaignId) => {
    set({ mediaLoading: true });
    try {
      const media = await api.getCampaignMedia(campaignId);
      set({ media, mediaLoading: false });
    } catch {
      set({ mediaLoading: false });
    }
  },

  uploadMedia: async (campaignId, file) => {
    await api.uploadCampaignMedia(campaignId, file);
    await get().fetchMedia(campaignId);
  },

  deleteMedia: async (mediaId, campaignId) => {
    await api.deleteCampaignMedia(mediaId);
    await get().fetchMedia(campaignId);
  },

  // Update actions
  fetchUpdates: async (campaignId) => {
    set({ updatesLoading: true });
    try {
      const updates = await api.getCampaignUpdates(campaignId);
      set({ updates, updatesLoading: false });
    } catch {
      set({ updatesLoading: false });
    }
  },

  createUpdate: async (campaignId, data) => {
    const update = await api.createCampaignUpdate(campaignId, data);
    await get().fetchUpdates(campaignId);
    return update;
  },
}));

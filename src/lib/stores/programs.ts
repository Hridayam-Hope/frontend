import { create } from "zustand";
import type {
  ProgramListItem,
  ProgramDetail,
  ProgramCategory,
  ProgramSummary,
  ProgramHighlight,
  ProgramMedia,
  ProgramQuote,
} from "@/types/api";
import * as api from "@/lib/api/programs";

interface ProgramsState {
  // List
  programs: ProgramListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  // Detail cache
  programCache: Record<number, ProgramDetail>;
  detailLoading: boolean;

  // Categories
  categories: ProgramCategory[];
  categoriesLoading: boolean;

  // Summary
  summary: ProgramSummary | null;
  summaryLoading: boolean;

  // Actions
  fetchPrograms: (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    category_id?: number;
    is_featured?: boolean;
    search?: string;
  }) => Promise<void>;
  fetchProgram: (id: number, force?: boolean) => Promise<ProgramDetail>;
  fetchCategories: (force?: boolean) => Promise<void>;
  fetchSummary: (force?: boolean) => Promise<void>;
  createProgram: (data: Parameters<typeof api.createProgram>[0]) => Promise<ProgramDetail>;
  updateProgram: (id: number, data: Record<string, unknown>) => Promise<ProgramDetail>;
  deleteProgram: (id: number) => Promise<void>;
  publishProgram: (id: number) => Promise<ProgramDetail>;
  archiveProgram: (id: number) => Promise<ProgramDetail>;

  // Highlight actions (cache-patching, no full refetch)
  addHighlight: (programId: number, data: { text: string; order?: number }) => Promise<ProgramHighlight>;
  updateHighlight: (programId: number, highlightId: number, data: { text: string; order?: number }) => Promise<ProgramHighlight>;
  deleteHighlight: (programId: number, highlightId: number) => Promise<void>;

  // Media actions (cache-patching, no full refetch)
  addMedia: (programId: number, data: Parameters<typeof api.addProgramMedia>[1]) => Promise<ProgramMedia>;
  updateMedia: (programId: number, mediaId: number, data: Parameters<typeof api.updateProgramMedia>[2]) => Promise<ProgramMedia>;
  deleteMedia: (programId: number, mediaId: number) => Promise<void>;
  setFeaturedMedia: (programId: number, mediaId: number) => Promise<ProgramMedia>;

  // Quote actions (cache-patching, no full refetch)
  addQuote: (programId: number, data: Parameters<typeof api.addQuote>[1]) => Promise<ProgramQuote>;
  updateQuote: (programId: number, quoteId: number, data: Parameters<typeof api.updateQuote>[2]) => Promise<ProgramQuote>;
  deleteQuote: (programId: number, quoteId: number) => Promise<void>;
}

export const useProgramsStore = create<ProgramsState>((set, get) => ({
  programs: [],
  total: 0,
  page: 1,
  totalPages: 1,
  listLoading: false,
  programCache: {},
  detailLoading: false,
  categories: [],
  categoriesLoading: false,
  summary: null,
  summaryLoading: false,

  fetchPrograms: async (params) => {
    set({ listLoading: true });
    try {
      const res = await api.getAdminPrograms({ page: 1, page_size: 20, ...params });
      set({
        programs: res.items,
        total: res.total,
        page: res.page,
        totalPages: res.total_pages,
        listLoading: false,
      });
    } catch {
      set({ listLoading: false });
    }
  },

  fetchProgram: async (id, force = false) => {
    const cached = get().programCache[id];
    if (cached && !force) return cached;
    set({ detailLoading: true });
    try {
      const program = await api.getAdminProgram(id);
      set((s) => ({
        programCache: { ...s.programCache, [id]: program },
        detailLoading: false,
      }));
      return program;
    } catch (err) {
      set({ detailLoading: false });
      throw err;
    }
  },

  fetchCategories: async (force = false) => {
    if (get().categories.length > 0 && !force) return;
    set({ categoriesLoading: true });
    try {
      const categories = await api.getCategories();
      set({ categories, categoriesLoading: false });
    } catch {
      set({ categoriesLoading: false });
    }
  },

  fetchSummary: async (force = false) => {
    if (get().summary && !force) return;
    set({ summaryLoading: true });
    try {
      const summary = await api.getProgramSummary();
      set({ summary, summaryLoading: false });
    } catch {
      set({ summaryLoading: false });
    }
  },

  createProgram: async (data) => {
    const program = await api.createProgram(data);
    set((s) => ({ programCache: { ...s.programCache, [program.id]: program } }));
    get().fetchPrograms();
    get().fetchSummary(true);
    return program;
  },

  updateProgram: async (id, data) => {
    const program = await api.updateProgram(id, data);
    set((s) => ({ programCache: { ...s.programCache, [id]: program } }));
    return program;
  },

  deleteProgram: async (id) => {
    await api.deleteProgram(id);
    set((s) => {
      const newCache = { ...s.programCache };
      delete newCache[id];
      return { programCache: newCache };
    });
    get().fetchPrograms();
    get().fetchSummary(true);
  },

  publishProgram: async (id) => {
    const program = await api.publishProgram(id);
    set((s) => ({ programCache: { ...s.programCache, [id]: program } }));
    get().fetchPrograms();
    get().fetchSummary(true);
    return program;
  },

  archiveProgram: async (id) => {
    const program = await api.archiveProgram(id);
    set((s) => ({ programCache: { ...s.programCache, [id]: program } }));
    get().fetchPrograms();
    get().fetchSummary(true);
    return program;
  },

  // ── Highlights ─────────────────────────────────────────────────────────────
  addHighlight: async (programId, data) => {
    const highlight = await api.addHighlight(programId, data);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: { ...prog, highlights: [...(prog.highlights ?? []), highlight] },
        },
      };
    });
    return highlight;
  },

  updateHighlight: async (programId, highlightId, data) => {
    const highlight = await api.updateHighlight(programId, highlightId, data);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: {
            ...prog,
            highlights: (prog.highlights ?? []).map((h) =>
              h.id === highlightId ? highlight : h
            ),
          },
        },
      };
    });
    return highlight;
  },

  deleteHighlight: async (programId, highlightId) => {
    await api.deleteHighlight(programId, highlightId);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: {
            ...prog,
            highlights: (prog.highlights ?? []).filter((h) => h.id !== highlightId),
          },
        },
      };
    });
  },

  // ── Media ───────────────────────────────────────────────────────────────────
  addMedia: async (programId, data) => {
    const media = await api.addProgramMedia(programId, data);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: { ...prog, media: [...(prog.media ?? []), media] },
        },
      };
    });
    return media;
  },

  updateMedia: async (programId, mediaId, data) => {
    const media = await api.updateProgramMedia(programId, mediaId, data);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: {
            ...prog,
            media: (prog.media ?? []).map((m) => (m.id === mediaId ? media : m)),
          },
        },
      };
    });
    return media;
  },

  deleteMedia: async (programId, mediaId) => {
    await api.deleteProgramMedia(programId, mediaId);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: {
            ...prog,
            media: (prog.media ?? []).filter((m) => m.id !== mediaId),
          },
        },
      };
    });
  },

  setFeaturedMedia: async (programId, mediaId) => {
    const media = await api.setFeaturedMedia(programId, mediaId);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: {
            ...prog,
            media: (prog.media ?? []).map((m) => ({
              ...m,
              is_featured: m.id === mediaId,
            })),
          },
        },
      };
    });
    return media;
  },

  // ── Quotes ──────────────────────────────────────────────────────────────────
  addQuote: async (programId, data) => {
    const quote = await api.addQuote(programId, data);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: { ...prog, quotes: [...(prog.quotes ?? []), quote] },
        },
      };
    });
    return quote;
  },

  updateQuote: async (programId, quoteId, data) => {
    const quote = await api.updateQuote(programId, quoteId, data);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: {
            ...prog,
            quotes: (prog.quotes ?? []).map((q) => (q.id === quoteId ? quote : q)),
          },
        },
      };
    });
    return quote;
  },

  deleteQuote: async (programId, quoteId) => {
    await api.deleteQuote(programId, quoteId);
    set((s) => {
      const prog = s.programCache[programId];
      if (!prog) return s;
      return {
        programCache: {
          ...s.programCache,
          [programId]: {
            ...prog,
            quotes: (prog.quotes ?? []).filter((q) => q.id !== quoteId),
          },
        },
      };
    });
  },
}));

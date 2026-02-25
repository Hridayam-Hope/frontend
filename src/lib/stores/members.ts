import { create } from "zustand";
import type { MemberListItem, MemberDetail } from "@/types/api";
import * as api from "@/lib/api/members";

interface MembersState {
  members: MemberListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  memberCache: Record<number, MemberDetail>;
  detailLoading: boolean;

  fetchMembers: (params?: {
    page?: number;
    search?: string;
    role?: string;
    include_inactive?: boolean;
  }) => Promise<void>;
  fetchMember: (id: number, force?: boolean) => Promise<MemberDetail>;
  createMember: (data: Partial<MemberDetail>) => Promise<MemberDetail>;
  updateMember: (id: number, data: Partial<MemberDetail>) => Promise<MemberDetail>;
  deactivateMember: (id: number) => Promise<void>;
}

export const useMembersStore = create<MembersState>((set, get) => ({
  members: [],
  total: 0,
  page: 1,
  totalPages: 0,
  listLoading: false,
  memberCache: {},
  detailLoading: false,

  fetchMembers: async (params) => {
    set({ listLoading: true });
    try {
      const res = await api.getMembers({
        page: 1,
        page_size: 20,
        include_inactive: true,
        ...params,
      });
      set({
        members: res.items,
        total: res.total,
        page: res.page,
        totalPages: res.total_pages,
        listLoading: false,
      });
    } catch {
      set({ listLoading: false });
    }
  },

  fetchMember: async (id, force = false) => {
    const cached = get().memberCache[id];
    if (cached && !force) return cached;

    set({ detailLoading: true });
    try {
      const member = await api.getMember(id);
      set((s) => ({
        memberCache: { ...s.memberCache, [id]: member },
        detailLoading: false,
      }));
      return member;
    } catch (err) {
      set({ detailLoading: false });
      throw err;
    }
  },

  createMember: async (data) => {
    const member = await api.createMember(data);
    set((s) => ({
      memberCache: { ...s.memberCache, [member.id]: member },
    }));
    await get().fetchMembers({ page: get().page });
    return member;
  },

  updateMember: async (id, data) => {
    const member = await api.updateMember(id, data);
    set((s) => ({
      memberCache: { ...s.memberCache, [id]: member },
    }));
    await get().fetchMembers({ page: get().page });
    return member;
  },

  deactivateMember: async (id) => {
    await api.deactivateMember(id);
    await get().fetchMembers({ page: get().page });
  },
}));

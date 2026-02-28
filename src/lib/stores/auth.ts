import { create } from "zustand";
import type { User } from "@/types/api";
import { getCurrentUser, login as apiLogin, logout as apiLogout } from "@/lib/api/auth";
import { getTokens } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  fetchUser: async () => {
    const tokens = getTokens();
    if (!tokens?.access_token) {
      set({ loading: false, user: null });
      return;
    }
    try {
      const user = await getCurrentUser();
      set({ user, loading: false, error: null });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      await apiLogin({ email, password });
      const user = await getCurrentUser();
      document.cookie = "hridayam_authenticated=true; path=/; max-age=86400";
      set({ user, error: null });
    } catch (err) {
      // Extract user-friendly message from ApiError
      let msg = "Login failed";
      if (err instanceof Error) {
        msg = err.message;
      }
      set({ error: msg });
      throw err;
    }
  },

  logout: async () => {
    await apiLogout();
    document.cookie = "hridayam_authenticated=; path=/; max-age=0";
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));

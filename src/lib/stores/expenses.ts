import { create } from "zustand";
import type { ExpenseListItem, ExpenseDetail, ExpenseSummary } from "@/types/api";
import * as api from "@/lib/api/expenses";

interface ExpensesState {
  // List
  expenses: ExpenseListItem[];
  total: number;
  page: number;
  totalPages: number;
  listLoading: boolean;

  // Detail cache
  expenseCache: Record<number, ExpenseDetail>;
  detailLoading: boolean;

  // Summary
  summary: ExpenseSummary | null;
  summaryLoading: boolean;

  // Actions
  fetchExpenses: (params?: {
    page?: number;
    page_size?: number;
    category?: string;
    status?: string;
    campaign_id?: number;
    payment_method?: string;
    date_from?: string;
    date_to?: string;
    is_recurring?: boolean;
    search?: string;
  }) => Promise<void>;
  fetchExpense: (id: number, force?: boolean) => Promise<ExpenseDetail>;
  fetchSummary: (force?: boolean) => Promise<void>;
  createExpense: (data: Parameters<typeof api.createExpense>[0]) => Promise<ExpenseDetail>;
  updateExpense: (id: number, data: Record<string, unknown>) => Promise<ExpenseDetail>;
  updateStatus: (id: number, status: string, reason?: string) => Promise<ExpenseDetail>;
  deleteExpense: (id: number) => Promise<void>;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: [],
  total: 0,
  page: 1,
  totalPages: 1,
  listLoading: false,
  expenseCache: {},
  detailLoading: false,
  summary: null,
  summaryLoading: false,

  fetchExpenses: async (params) => {
    set({ listLoading: true });
    try {
      const res = await api.getExpenses({ page: 1, page_size: 20, ...params });
      set({
        expenses: res.items,
        total: res.total,
        page: res.page,
        totalPages: res.total_pages,
        listLoading: false,
      });
    } catch {
      set({ listLoading: false });
    }
  },

  fetchExpense: async (id, force = false) => {
    const cached = get().expenseCache[id];
    if (cached && !force) return cached;
    set({ detailLoading: true });
    try {
      const expense = await api.getExpense(id);
      set((s) => ({
        expenseCache: { ...s.expenseCache, [id]: expense },
        detailLoading: false,
      }));
      return expense;
    } catch (err) {
      set({ detailLoading: false });
      throw err;
    }
  },

  fetchSummary: async (force = false) => {
    if (get().summary && !force) return;
    set({ summaryLoading: true });
    try {
      const summary = await api.getExpenseSummary();
      set({ summary, summaryLoading: false });
    } catch {
      set({ summaryLoading: false });
    }
  },

  createExpense: async (data) => {
    const expense = await api.createExpense(data);
    set((s) => ({ expenseCache: { ...s.expenseCache, [expense.id]: expense } }));
    get().fetchExpenses();
    get().fetchSummary(true);
    return expense;
  },

  updateExpense: async (id, data) => {
    const expense = await api.updateExpense(id, data);
    set((s) => ({ expenseCache: { ...s.expenseCache, [id]: expense } }));
    get().fetchExpenses();
    get().fetchSummary(true);
    return expense;
  },

  updateStatus: async (id, status, reason) => {
    const expense = await api.updateExpenseStatus(id, status, reason);
    set((s) => ({ expenseCache: { ...s.expenseCache, [id]: expense } }));
    get().fetchExpenses();
    get().fetchSummary(true);
    return expense;
  },

  deleteExpense: async (id) => {
    await api.deleteExpense(id);
    set((s) => {
      const newCache = { ...s.expenseCache };
      delete newCache[id];
      return { expenseCache: newCache };
    });
    get().fetchExpenses();
    get().fetchSummary(true);
  },
}));

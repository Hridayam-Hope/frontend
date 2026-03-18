import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  ExpenseListItem,
  ExpenseDetail,
  ExpenseSummary,
  MessageResponse,
} from "@/types/api";

export async function getExpenses(params?: {
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
}) {
  return apiFetch<PaginatedResponse<ExpenseListItem>>("/expenses/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getExpense(id: number) {
  return apiFetch<ExpenseDetail>(`/expenses/${id}`);
}

export async function createExpense(data: {
  title: string;
  description?: string;
  amount: number;
  date: string;
  category: string;
  payment_method: string;
  paid_to?: string;
  reference_number?: string;
  campaign_id?: number | null;
  receipt_url?: string;
  is_recurring?: boolean;
  recurrence_note?: string;
  notes?: string;
}) {
  return apiFetch<ExpenseDetail>("/expenses/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExpense(id: number, data: Record<string, unknown>) {
  return apiFetch<ExpenseDetail>(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteExpense(id: number) {
  return apiFetch<MessageResponse>(`/expenses/${id}`, { method: "DELETE" });
}

export async function updateExpenseStatus(
  id: number,
  status: string,
  reason?: string
) {
  return apiFetch<ExpenseDetail>(`/expenses/${id}/status`, {
    method: "POST",
    body: JSON.stringify({ status, reason: reason ?? "" }),
  });
}

export async function getExpenseSummary(params?: {
  date_from?: string;
  date_to?: string;
}) {
  return apiFetch<ExpenseSummary>("/expenses/summary", {
    params: params as Record<string, string | undefined>,
  });
}

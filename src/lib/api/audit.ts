import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  AuditLogListItem,
  AuditLogDetail,
  AuditLogStats,
} from "@/types/api";

export async function getAuditLogs(params?: {
  page?: number;
  page_size?: number;
  action?: string;
  entity_type?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}) {
  return apiFetch<PaginatedResponse<AuditLogListItem>>("/audit/", {
    params: params as Record<string, string | number>,
  });
}

export async function getAuditLog(id: number) {
  return apiFetch<AuditLogDetail>(`/audit/${id}`);
}

export async function getAuditStats() {
  return apiFetch<AuditLogStats>("/audit/stats/summary");
}

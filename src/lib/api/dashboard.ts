import { apiFetch } from "./client";
import type { DashboardSummary } from "@/types/api";

export async function getDashboardSummary() {
  return apiFetch<DashboardSummary>("/dashboard/summary");
}

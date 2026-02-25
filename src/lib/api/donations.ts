import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  DonationListItem,
  DonationDetail,
  DonationStats,
  MessageResponse,
} from "@/types/api";

export async function getDonations(params?: {
  page?: number;
  page_size?: number;
  status?: string;
  campaign_id?: number;
}) {
  return apiFetch<PaginatedResponse<DonationListItem>>("/donations/", {
    params: params as Record<string, string | number>,
  });
}

export async function getDonation(id: number) {
  return apiFetch<DonationDetail>(`/donations/${id}`);
}

export async function getDonationStats() {
  return apiFetch<DonationStats>("/donations/stats/summary");
}

export async function issueTaxCertificate(id: number) {
  return apiFetch<MessageResponse>(`/donations/${id}/issue-certificate`, {
    method: "POST",
  });
}

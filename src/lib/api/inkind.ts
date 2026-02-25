import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  InKindDonationListItem,
  InKindDonationDetail,
  InKindDonationStats,
  MessageResponse,
} from "@/types/api";

export async function getInKindDonations(params?: {
  page?: number;
  page_size?: number;
  status?: string;
  campaign_id?: number;
  item_category?: string;
}) {
  return apiFetch<PaginatedResponse<InKindDonationListItem>>("/inkind/", {
    params: params as Record<string, string | number>,
  });
}

export async function getInKindDonation(id: number) {
  return apiFetch<InKindDonationDetail>(`/inkind/${id}`);
}

export async function createInKindDonation(data: Record<string, unknown>) {
  return apiFetch<InKindDonationDetail>("/inkind/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateInKindStatus(
  id: number,
  data: { status: string; notes?: string; tracking_number?: string }
) {
  return apiFetch<InKindDonationDetail>(`/inkind/${id}/update-status`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getInKindStats() {
  return apiFetch<InKindDonationStats>("/inkind/stats/summary");
}

export async function issueInKindCertificate(id: number) {
  return apiFetch<MessageResponse>(`/inkind/${id}/issue-certificate`, {
    method: "POST",
  });
}

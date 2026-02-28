import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  VolunteerDonationListItem,
  VolunteerDonationDetail,
  VolunteerDonationSummary,
  BulkDonationResult,
  MessageResponse,
} from "@/types/api";

// ── CRUD ──

export async function getVolunteerDonations(params?: {
  page?: number;
  page_size?: number;
  volunteer_id?: number;
  date_from?: string;
  date_to?: string;
  payment_method?: string;
  search?: string;
}) {
  return apiFetch<PaginatedResponse<VolunteerDonationListItem>>(
    "/finance/volunteer-donations/",
    { params: params as Record<string, string | number> }
  );
}

export async function getVolunteerDonation(id: number) {
  return apiFetch<VolunteerDonationDetail>(`/finance/volunteer-donations/${id}`);
}

export async function createVolunteerDonation(data: {
  volunteer_id: number;
  amount: number;
  date: string;
  payment_method: string;
  transaction_reference?: string;
  notes?: string;
}) {
  return apiFetch<VolunteerDonationDetail>("/finance/volunteer-donations/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateVolunteerDonation(
  id: number,
  data: Record<string, unknown>
) {
  return apiFetch<VolunteerDonationDetail>(
    `/finance/volunteer-donations/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteVolunteerDonation(id: number) {
  return apiFetch<MessageResponse>(`/finance/volunteer-donations/${id}`, {
    method: "DELETE",
  });
}

// ── Bulk ──

export async function bulkCreateDonations(
  donations: {
    volunteer_id: number;
    amount: number;
    date: string;
    payment_method: string;
    transaction_reference?: string;
    notes?: string;
  }[]
) {
  return apiFetch<BulkDonationResult>("/finance/volunteer-donations/bulk", {
    method: "POST",
    body: JSON.stringify({ donations }),
  });
}

// ── Per-volunteer ──

export async function getVolunteerDonationsByVolunteer(
  volunteerId: number,
  params?: { page?: number; page_size?: number; date_from?: string; date_to?: string }
) {
  return apiFetch<PaginatedResponse<VolunteerDonationListItem>>(
    `/finance/volunteer-donations/volunteer/${volunteerId}`,
    { params: params as Record<string, string | number> }
  );
}

// ── Summary ──

export async function getVolunteerDonationSummary(params?: {
  date_from?: string;
  date_to?: string;
}) {
  return apiFetch<VolunteerDonationSummary>(
    "/finance/volunteer-donations/summary",
    { params: params as Record<string, string | number> }
  );
}

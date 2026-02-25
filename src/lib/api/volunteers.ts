import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  VolunteerApplicationListItem,
  VolunteerProfileListItem,
  VolunteerProfile,
  VolunteerOpportunity,
  MessageResponse,
} from "@/types/api";

export async function getApplications(params?: {
  page?: number;
  page_size?: number;
  status?: string;
}) {
  return apiFetch<PaginatedResponse<VolunteerApplicationListItem>>(
    "/volunteers/applications",
    { params: params as Record<string, string | number> }
  );
}

export async function approveApplication(id: number, notes?: string) {
  return apiFetch<VolunteerProfile>(
    `/volunteers/applications/${id}/approve`,
    { method: "PATCH", body: JSON.stringify({ notes: notes || "" }) }
  );
}

export async function rejectApplication(id: number, notes?: string) {
  return apiFetch<MessageResponse>(
    `/volunteers/applications/${id}/reject`,
    { method: "PATCH", body: JSON.stringify({ notes: notes || "" }) }
  );
}

export async function getVolunteers(params?: {
  page?: number;
  page_size?: number;
  is_active?: boolean;
  city?: string;
}) {
  return apiFetch<PaginatedResponse<VolunteerProfileListItem>>(
    "/volunteers/volunteers",
    { params: params as Record<string, string | number | boolean> }
  );
}

export async function getVolunteer(id: number) {
  return apiFetch<VolunteerProfile>(`/volunteers/volunteers/${id}`);
}

export async function deactivateVolunteer(id: number) {
  return apiFetch<MessageResponse>(`/volunteers/volunteers/${id}/deactivate`, {
    method: "PATCH",
  });
}

export async function getOpportunities() {
  return apiFetch<VolunteerOpportunity[]>("/volunteers/opportunities");
}

export async function createOpportunity(data: Partial<VolunteerOpportunity>) {
  return apiFetch<VolunteerOpportunity>("/volunteers/opportunities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

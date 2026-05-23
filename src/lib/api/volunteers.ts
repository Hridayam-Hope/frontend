import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  VolunteerApplicationListItem,
  VolunteerApplicationDetail,
  VolunteerProfileListItem,
  VolunteerProfile,
  VolunteerProfileDetail,
  VolunteerOpportunity,
  VolunteerOpportunityDetail,
  VolunteerActivity,
  VolunteerCertificate,
  CampaignVolunteerItem,
  VolunteerSkill,
  OpportunityApplicationItem,
  CareerApplicationItem,
  MessageResponse,
} from "@/types/api";

// ── Skills ──

export async function getSkills() {
  return apiFetch<VolunteerSkill[]>("/volunteers/skills");
}

// ── Applications ──

export async function getApplications(params?: Record<string, unknown>) {
  return apiFetch<PaginatedResponse<VolunteerApplicationListItem>>(
    "/volunteers/applications",
    { params: params as Record<string, string | number> }
  );
}

export async function getApplication(id: number) {
  return apiFetch<VolunteerApplicationDetail>(`/volunteers/applications/${id}`);
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

export async function submitVolunteerApplication(data: Record<string, unknown>) {
  return apiFetch<MessageResponse>("/volunteers/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitCareerApplication(
  opportunityId: number,
  data: {
    first_name: string;
    last_name: string;
    email: string;
    why_interested: string;
    resume_link: string;
  }
) {
  return apiFetch<MessageResponse>(
    `/volunteers/opportunities/${opportunityId}/apply`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// ── Volunteers ──

export async function getVolunteers(params?: Record<string, unknown>) {
  return apiFetch<PaginatedResponse<VolunteerProfileListItem>>(
    "/volunteers/volunteers",
    { params: params as Record<string, string | number | boolean> }
  );
}

export async function getVolunteer(id: number) {
  return apiFetch<VolunteerProfileDetail>(`/volunteers/volunteers/${id}`);
}

export async function createVolunteer(data: Record<string, unknown>) {
  return apiFetch<VolunteerProfile>("/volunteers/volunteers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateVolunteer(id: number, data: Record<string, unknown>) {
  return apiFetch<VolunteerProfile>(`/volunteers/volunteers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deactivateVolunteer(id: number) {
  return apiFetch<MessageResponse>(`/volunteers/volunteers/${id}/deactivate`, {
    method: "PATCH",
  });
}

// ── Volunteer Activities & Certificates ──

export async function getVolunteerActivities(id: number) {
  return apiFetch<VolunteerActivity[]>(`/volunteers/volunteers/${id}/activities`);
}

export async function recordActivity(volunteerId: number, data: Record<string, unknown>) {
  return apiFetch<VolunteerActivity>(`/volunteers/volunteers/${volunteerId}/activities`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getVolunteerCertificates(id: number) {
  return apiFetch<VolunteerCertificate[]>(`/volunteers/volunteers/${id}/certificates`);
}

// ── Campaign Volunteers ──

export async function getCampaignVolunteers(campaignId: number) {
  return apiFetch<CampaignVolunteerItem[]>(`/volunteers/campaigns/${campaignId}/volunteers`);
}

export async function assignCampaignVolunteer(campaignId: number, volunteerId: number) {
  return apiFetch<CampaignVolunteerItem>(`/volunteers/campaigns/${campaignId}/volunteers/assign`, {
    method: "POST",
    body: JSON.stringify({ volunteer_id: volunteerId }),
  });
}

export async function acceptCampaignVolunteer(assignmentId: number) {
  return apiFetch<MessageResponse>(`/volunteers/campaigns/volunteers/${assignmentId}/accept`, {
    method: "PATCH",
  });
}

export async function rejectCampaignVolunteer(assignmentId: number, notes: string) {
  return apiFetch<MessageResponse>(`/volunteers/campaigns/volunteers/${assignmentId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });
}

export async function recordCampaignHours(assignmentId: number, data: Record<string, unknown>) {
  return apiFetch<VolunteerActivity>(`/volunteers/campaigns/volunteers/${assignmentId}/hours`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Opportunities ──

export async function getOpportunities() {
  return apiFetch<VolunteerOpportunity[]>("/volunteers/opportunities");
}

export async function getAllOpportunities(params?: Record<string, unknown>) {
  return apiFetch<PaginatedResponse<VolunteerOpportunity>>("/volunteers/opportunities/all", {
    params: params as Record<string, string | number>,
  });
}

export async function getOpportunity(id: number) {
  return apiFetch<VolunteerOpportunityDetail>(`/volunteers/opportunities/${id}`);
}

export async function getPublicOpportunity(id: number) {
  return apiFetch<VolunteerOpportunityDetail>(`/volunteers/opportunities/public/${id}`);
}

export async function createOpportunity(data: Record<string, unknown>) {
  return apiFetch<VolunteerOpportunityDetail>("/volunteers/opportunities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function closeOpportunity(id: number) {
  return apiFetch<MessageResponse>(`/volunteers/opportunities/${id}/close`, {
    method: "PATCH",
  });
}

export async function updateOpportunity(id: number, data: Record<string, unknown>) {
  return apiFetch<VolunteerOpportunityDetail>(`/volunteers/opportunities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getOpportunityApplications(opportunityId: number) {
  return apiFetch<OpportunityApplicationItem[]>(
    `/volunteers/opportunities/${opportunityId}/applications`
  );
}

export async function assignOpportunityVolunteer(opportunityId: number, volunteerId: number) {
  return apiFetch<MessageResponse>(
    `/volunteers/opportunities/${opportunityId}/applications/assign`,
    {
      method: "POST",
      body: JSON.stringify({ volunteer_id: volunteerId }),
    }
  );
}

export async function getCareerApplications(opportunityId: number) {
  return apiFetch<CareerApplicationItem[]>(
    `/volunteers/opportunities/${opportunityId}/career-applications`
  );
}

export async function updateCareerApplicationStatus(
  applicationId: number,
  status: "pending" | "shortlisted" | "rejected"
) {
  return apiFetch<MessageResponse>(
    `/volunteers/opportunities/career-applications/${applicationId}/status?status=${status}`,
    { method: "PATCH" }
  );
}

export async function acceptOpportunityApplication(applicationId: number) {
  return apiFetch<MessageResponse>(
    `/volunteers/opportunities/applications/${applicationId}/accept`,
    { method: "PATCH" }
  );
}

export async function rejectOpportunityApplication(applicationId: number) {
  return apiFetch<MessageResponse>(
    `/volunteers/opportunities/applications/${applicationId}/reject`,
    { method: "PATCH" }
  );
}

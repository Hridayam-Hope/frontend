import { apiFetch } from "./client";
import type { MemberListItem, MemberDetail, MessageResponse, PaginatedResponse } from "@/types/api";

export async function getMembers(params?: {
  page?: number;
  page_size?: number;
  include_inactive?: boolean;
  search?: string;
  role?: string;
}) {
  return apiFetch<PaginatedResponse<MemberListItem>>("/members/", {
    params: params as Record<string, string | number>,
  });
}

export async function getMember(id: number) {
  return apiFetch<MemberDetail>(`/members/${id}`);
}

export async function createMember(data: Partial<MemberDetail>) {
  return apiFetch<MemberDetail>("/members/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMember(id: number, data: Partial<MemberDetail>) {
  return apiFetch<MemberDetail>(`/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deactivateMember(id: number) {
  return apiFetch<MessageResponse>(`/members/${id}/deactivate`, {
    method: "PATCH",
  });
}

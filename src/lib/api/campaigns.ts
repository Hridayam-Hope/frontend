import { apiFetch, apiUpload } from "./client";
import type {
  PaginatedResponse,
  CampaignListItem,
  CampaignDetail,
  CampaignMedia,
  CampaignUpdate,
  Category,
  MessageResponse,
} from "@/types/api";

export async function getCampaigns(params?: {
  page?: number;
  page_size?: number;
  status?: string;
  category_id?: number;
  campaign_type?: string;
  search?: string;
}) {
  return apiFetch<PaginatedResponse<CampaignListItem>>("/campaigns/campaigns", {
    params: params as Record<string, string | number>,
  });
}

export async function getCampaign(id: number) {
  return apiFetch<CampaignDetail>(`/campaigns/campaigns/id/${id}`);
}

export async function getCampaignBySlug(slug: string) {
  return apiFetch<CampaignDetail>(`/campaigns/campaigns/${slug}`);
}

export async function createCampaign(data: Record<string, unknown>) {
  return apiFetch<CampaignDetail>("/campaigns/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCampaign(id: number, data: Record<string, unknown>) {
  return apiFetch<CampaignDetail>(`/campaigns/campaigns/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCampaign(id: number) {
  return apiFetch<MessageResponse>(`/campaigns/campaigns/${id}`, {
    method: "DELETE",
  });
}

export async function updateCampaignStatus(id: number, status: string) {
  return apiFetch<MessageResponse>(`/campaigns/campaigns/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Categories
export async function getCategories() {
  return apiFetch<Category[]>("/campaigns/categories");
}

export async function createCategory(data: Partial<Category>) {
  return apiFetch<Category>("/campaigns/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number, data: Partial<Category>) {
  return apiFetch<Category>(`/campaigns/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number) {
  return apiFetch<MessageResponse>(`/campaigns/categories/${id}`, {
    method: "DELETE",
  });
}

// Campaign Media
export async function getCampaignMedia(campaignId: number) {
  return apiFetch<CampaignMedia[]>(`/campaigns/campaigns/${campaignId}/media`);
}

export async function uploadCampaignMedia(campaignId: number, file: File) {
  return apiUpload<MessageResponse>(
    `/campaigns/campaigns/${campaignId}/media/upload`,
    file
  );
}

export async function deleteCampaignMedia(mediaId: number) {
  return apiFetch<MessageResponse>(`/campaigns/campaigns/media/${mediaId}`, {
    method: "DELETE",
  });
}

// Campaign Updates
export async function getCampaignUpdates(campaignId: number) {
  return apiFetch<CampaignUpdate[]>(
    `/campaigns/campaigns/${campaignId}/updates`
  );
}

export async function createCampaignUpdate(
  campaignId: number,
  data: { title: string; content: string; is_published?: boolean }
) {
  return apiFetch<CampaignUpdate>(
    `/campaigns/campaigns/${campaignId}/updates`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

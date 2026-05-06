import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  ProgramListItem,
  ProgramDetail,
  ProgramCategory,
  ProgramSummary,
  ProgramMedia,
  ProgramHighlight,
  ProgramQuote,
  MessageResponse,
} from "@/types/api";

// ============================================================================
// PUBLIC ENDPOINTS
// ============================================================================

export async function getCategories() {
  return apiFetch<ProgramCategory[]>("/programs/categories");
}

export async function getPrograms(params?: {
  page?: number;
  page_size?: number;
  category_id?: number;
  is_featured?: boolean;
}) {
  return apiFetch<PaginatedResponse<ProgramListItem>>("/programs/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getProgramBySlug(slug: string) {
  return apiFetch<ProgramDetail>(`/programs/${slug}`);
}

// ============================================================================
// ADMIN ENDPOINTS - CRUD
// ============================================================================

export async function getAdminPrograms(params?: {
  page?: number;
  page_size?: number;
  status?: string;
  category_id?: number;
  is_featured?: boolean;
  search?: string;
}) {
  return apiFetch<PaginatedResponse<ProgramListItem>>("/programs/admin/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getProgramSummary() {
  return apiFetch<ProgramSummary>("/programs/admin/summary");
}

export async function getAdminProgram(id: number) {
  return apiFetch<ProgramDetail>(`/programs/admin/${id}`);
}

export async function createProgram(data: {
  title: string;
  short_description: string;
  full_story: string;
  category_id: number;
  badge_label?: string;
  location: string;
  city: string;
  state: string;
  event_date: string;
  volunteers_count?: number;
  beneficiaries_count?: number | null;
  trees_planted?: number | null;
  people_reached?: number | null;
  featured_image: string;
  featured_image_alt?: string;
  status?: string;
  is_featured?: boolean;
  display_order?: number;
  meta_title?: string;
  meta_description?: string;
}) {
  return apiFetch<ProgramDetail>("/programs/admin/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProgram(id: number, data: Record<string, unknown>) {
  return apiFetch<ProgramDetail>(`/programs/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProgram(id: number) {
  return apiFetch<MessageResponse>(`/programs/admin/${id}`, {
    method: "DELETE",
  });
}

export async function publishProgram(id: number) {
  return apiFetch<ProgramDetail>(`/programs/admin/${id}/publish`, {
    method: "POST",
  });
}

export async function archiveProgram(id: number) {
  return apiFetch<ProgramDetail>(`/programs/admin/${id}/archive`, {
    method: "POST",
  });
}

// ============================================================================
// ADMIN ENDPOINTS - MEDIA
// ============================================================================

export async function addProgramMedia(
  programId: number,
  data: {
    image_url: string;
    caption?: string;
    alt_text: string;
    order?: number;
    is_featured?: boolean;
  }
) {
  return apiFetch<ProgramMedia>(`/programs/admin/${programId}/media`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProgramMedia(
  programId: number,
  mediaId: number,
  data: {
    caption?: string;
    alt_text?: string;
    order?: number;
    is_featured?: boolean;
  }
) {
  return apiFetch<ProgramMedia>(
    `/programs/admin/${programId}/media/${mediaId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteProgramMedia(programId: number, mediaId: number) {
  return apiFetch<MessageResponse>(
    `/programs/admin/${programId}/media/${mediaId}`,
    { method: "DELETE" }
  );
}

export async function setFeaturedMedia(programId: number, mediaId: number) {
  return apiFetch<ProgramMedia>(
    `/programs/admin/${programId}/media/${mediaId}/set-featured`,
    { method: "POST" }
  );
}

// ============================================================================
// ADMIN ENDPOINTS - HIGHLIGHTS
// ============================================================================

export async function addHighlight(
  programId: number,
  data: { text: string; order?: number }
) {
  return apiFetch<ProgramHighlight>(`/programs/admin/${programId}/highlights`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateHighlight(
  programId: number,
  highlightId: number,
  data: { text: string; order?: number }
) {
  return apiFetch<ProgramHighlight>(
    `/programs/admin/${programId}/highlights/${highlightId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteHighlight(programId: number, highlightId: number) {
  return apiFetch<MessageResponse>(
    `/programs/admin/${programId}/highlights/${highlightId}`,
    { method: "DELETE" }
  );
}

// ============================================================================
// ADMIN ENDPOINTS - QUOTES
// ============================================================================

export async function addQuote(
  programId: number,
  data: {
    text: string;
    author_name: string;
    author_role: string;
    order?: number;
  }
) {
  return apiFetch<ProgramQuote>(`/programs/admin/${programId}/quotes`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateQuote(
  programId: number,
  quoteId: number,
  data: {
    text: string;
    author_name: string;
    author_role: string;
    order?: number;
  }
) {
  return apiFetch<ProgramQuote>(
    `/programs/admin/${programId}/quotes/${quoteId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteQuote(programId: number, quoteId: number) {
  return apiFetch<MessageResponse>(
    `/programs/admin/${programId}/quotes/${quoteId}`,
    { method: "DELETE" }
  );
}

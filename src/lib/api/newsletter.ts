import { apiFetch } from "./client";
import type {
  PaginatedResponse,
  NewsletterListItem,
  SubscriberListItem,
  NewsletterStats,
  MessageResponse,
} from "@/types/api";

export async function getNewsletters(params?: {
  page?: number;
  page_size?: number;
  status?: string;
}) {
  return apiFetch<PaginatedResponse<NewsletterListItem>>("/newsletter/", {
    params: params as Record<string, string | number>,
  });
}

export async function getSubscribers(params?: {
  page?: number;
  page_size?: number;
  status?: string;
}) {
  return apiFetch<PaginatedResponse<SubscriberListItem>>(
    "/newsletter/subscribers",
    { params: params as Record<string, string | number> }
  );
}

export async function getNewsletterStats() {
  return apiFetch<NewsletterStats>("/newsletter/stats/summary");
}

export async function createNewsletter(data: {
  subject: string;
  template_id: number;
  content_variables: Record<string, string>;
  target_segments?: string[];
}) {
  return apiFetch<unknown>("/newsletter/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTemplates() {
  return apiFetch<{ id: number; name: string; description: string; category: string }[]>(
    "/newsletter/templates"
  );
}

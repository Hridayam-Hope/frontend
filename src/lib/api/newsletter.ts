import { apiFetch } from "./client";
import type {
  EmailLogListItem,
  EmailTemplateDetail,
  EmailTemplateListItem,
  EmailTemplateVersionItem,
  PaginatedResponse,
  NewsletterListItem,
  SubscriberListItem,
  NewsletterStats,
  NewsletterSettings,
  MessageResponse,
  TemplatePreviewResponse,
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

export async function unsubscribeByToken(token: string) {
  return apiFetch<MessageResponse>(`/newsletter/unsubscribe/${token}`);
}

export async function confirmSubscriptionByToken(token: string) {
  return apiFetch<MessageResponse>(`/newsletter/confirm/${token}`);
}

export async function subscribeToNewsletter(data: {
  email: string;
  name?: string;
  segments?: string[];
  preferences?: Record<string, unknown>;
}) {
  return apiFetch<MessageResponse>("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify(data),
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

export async function getNewsletterSettings() {
  return apiFetch<NewsletterSettings>("/newsletter/settings");
}

export async function updateNewsletterSettings(
  data: Partial<Omit<NewsletterSettings, "updated_at" | "updated_by_id">>
) {
  return apiFetch<NewsletterSettings>("/newsletter/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
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
  return apiFetch<EmailTemplateListItem[]>("/newsletter/templates");
}

export async function getTemplate(templateId: number) {
  return apiFetch<EmailTemplateDetail>(`/newsletter/templates/${templateId}`);
}

export async function createTemplate(data: {
  slug?: string;
  name: string;
  description?: string;
  category?: string;
  subject_template?: string;
  html_content: string;
  text_content?: string;
  variables?: string[];
  required_variables?: string[];
  sample_context?: Record<string, unknown>;
  is_active?: boolean;
}) {
  return apiFetch<EmailTemplateDetail>("/newsletter/templates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTemplate(
  templateId: number,
  data: Partial<{
    slug: string;
    name: string;
    description: string;
    category: string;
    subject_template: string;
    html_content: string;
    text_content: string;
    variables: string[];
    required_variables: string[];
    sample_context: Record<string, unknown>;
    is_active: boolean;
  }>
) {
  return apiFetch<EmailTemplateDetail>(`/newsletter/templates/${templateId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTemplate(templateId: number) {
  return apiFetch<MessageResponse>(`/newsletter/templates/${templateId}`, {
    method: "DELETE",
  });
}

export async function previewTemplate(
  templateId: number,
  context: Record<string, unknown>
) {
  return apiFetch<TemplatePreviewResponse>(
    `/newsletter/templates/${templateId}/preview`,
    {
      method: "POST",
      body: JSON.stringify({ context }),
    }
  );
}

export async function testSendTemplate(templateId: number, email: string) {
  return apiFetch<MessageResponse>(`/newsletter/templates/${templateId}/test-send`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getTemplateVersions(templateId: number) {
  return apiFetch<EmailTemplateVersionItem[]>(
    `/newsletter/templates/${templateId}/versions`
  );
}

export async function getTemplateLogs(
  templateId: number,
  params?: { page?: number; page_size?: number }
) {
  return apiFetch<PaginatedResponse<EmailLogListItem>>(
    `/newsletter/templates/${templateId}/logs`,
    { params: params as Record<string, string | number> }
  );
}

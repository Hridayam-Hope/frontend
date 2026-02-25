// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  date_joined: string;
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// Pagination
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ============================================================================
// Campaign Types
// ============================================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string | null;
  parent_category_id: number | null;
  is_active: boolean;
  order: number;
}

export interface CampaignListItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  category_name: string;
  campaign_type: string;
  target_unit: string;
  target_value: number;
  achieved_value: number;
  target_currency: string;
  progress_percentage: number;
  status: string;
  featured_image: string | null;
  location: string;
  beneficiary_count: number;
  start_date: string;
  end_date: string | null;
  days_remaining: number | null;
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export interface CampaignDetail extends CampaignListItem {
  description: string;
  category_id: number;
  video_url: string | null;
  beneficiary_type: string;
  meta_title: string;
  meta_description: string;
  og_image: string | null;
  visibility: string;
  created_by_id: number;
  assigned_to_id: number | null;
  share_count: number;
  priority: number;
  is_active: boolean;
  updated_at: string;
}

export interface CampaignMedia {
  id: number;
  campaign_id: number;
  media_type: string;
  file_url: string;
  thumbnail_url: string | null;
  caption: string;
  order: number;
  uploaded_at: string;
}

export interface CampaignUpdate {
  id: number;
  campaign_id: number;
  title: string;
  content: string;
  created_by_id: number;
  created_by_name: string;
  created_at: string;
  is_published: boolean;
}

// ============================================================================
// Donation Types
// ============================================================================

export interface DonationListItem {
  id: number;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  status: string;
  donation_type: string;
  campaign_title: string | null;
  created_at: string;
}

export interface DonationDetail {
  id: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  currency: string;
  donation_type: string;
  campaign_id: number | null;
  campaign_title: string | null;
  status: string;
  payment_method: string;
  message: string;
  is_anonymous: boolean;
  receipt_sent: boolean;
  tax_certificate_number: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface DonationStats {
  total_donations: number;
  total_amount: number;
  completed_donations: number;
  pending_donations: number;
  failed_donations: number;
  average_donation: number;
}

// ============================================================================
// In-Kind Donation Types
// ============================================================================

export interface InKindDonationListItem {
  id: number;
  donor_name: string;
  donor_email: string;
  item_name: string;
  item_category: string;
  quantity: number;
  estimated_value: number;
  status: string;
  campaign_title: string | null;
  delivery_method: string;
  created_at: string;
}

export interface InKindDonationDetail {
  id: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_address: string;
  donor_city: string;
  donor_state: string;
  donor_pincode: string;
  item_name: string;
  item_category: string;
  item_description: string;
  item_condition: string;
  quantity: number;
  estimated_value: number;
  campaign_id: number | null;
  campaign_title: string | null;
  delivery_method: string;
  preferred_pickup_date: string | null;
  preferred_pickup_time: string | null;
  status: string;
  tracking_number: string | null;
  verification_notes: string | null;
  received_notes: string | null;
  donation_notes: string | null;
  rejection_reason: string | null;
  message: string;
  is_anonymous: boolean;
  receipt_sent: boolean;
  tax_certificate_number: string | null;
  created_at: string;
  verified_at: string | null;
  received_at: string | null;
  donated_at: string | null;
}

export interface InKindDonationStats {
  total_donations: number;
  pending_donations: number;
  verified_donations: number;
  in_transit_donations: number;
  received_donations: number;
  donated_donations: number;
  rejected_donations: number;
  total_estimated_value: number;
  total_items: number;
}

// ============================================================================
// Volunteer Types
// ============================================================================

export interface VolunteerApplicationListItem {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: string;
  application_date: string;
  reviewed_by_id: number | null;
  reviewed_at: string | null;
}

export interface VolunteerProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  skills: string[];
  total_hours: number;
  is_active: boolean;
  joined_date: string;
  profile_photo: string | null;
}

export interface VolunteerProfileListItem {
  id: number;
  full_name: string;
  email: string;
  city: string;
  state: string;
  total_hours: number;
  is_active: boolean;
  joined_date: string;
  last_activity_date: string | null;
}

export interface VolunteerOpportunity {
  id: number;
  title: string;
  description: string;
  city: string;
  state: string;
  event_date: string;
  event_time: string;
  duration_hours: number;
  volunteers_needed: number;
  volunteers_accepted: number;
  status: string;
  is_published: boolean;
}

// ============================================================================
// Member Types
// ============================================================================

export interface MemberListItem {
  id: number;
  full_name: string;
  email: string;
  role: string;
  position: string;
  is_active: boolean;
  joined_date: string;
  tenure_years: number;
}

export interface MemberDetail {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  role: string;
  position: string;
  responsibilities: string;
  bio: string;
  linkedin_url: string | null;
  joined_date: string;
  tenure_end_date: string | null;
  is_active: boolean;
  display_order: number;
  tenure_years: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Newsletter Types
// ============================================================================

export interface NewsletterListItem {
  id: number;
  subject: string;
  template_name: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  opened_count: number;
  created_at: string;
}

export interface SubscriberListItem {
  id: number;
  email: string;
  name: string;
  status: string;
  segments: string[];
  subscribed_at: string;
}

export interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  pending_subscribers: number;
  bounced_subscribers: number;
  unsubscribed_subscribers: number;
  total_newsletters: number;
  sent_newsletters: number;
  draft_newsletters: number;
  total_sends: number;
  total_opens: number;
  total_clicks: number;
  open_rate: number;
  click_rate: number;
}

// ============================================================================
// Audit Types
// ============================================================================

export interface AuditLogListItem {
  id: number;
  user_email: string;
  action: string;
  entity_type: string;
  entity_name: string;
  description: string;
  created_at: string;
}

export interface AuditLogDetail {
  id: number;
  user_email: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_name: string;
  description: string;
  changes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  ip_address: string;
  user_agent: string;
  request_path: string;
  request_method: string;
  created_at: string;
  archived: boolean;
}

export interface AuditLogStats {
  total_logs: number;
  logs_24h: number;
  logs_7d: number;
  logs_30d: number;
  archived_logs: number;
  by_action: Record<string, number>;
  by_entity_type: Record<string, number>;
}

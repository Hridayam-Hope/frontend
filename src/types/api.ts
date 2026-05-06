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

export interface UploadAssetResponse {
  path: string;
  url?: string | null;
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
  partner_type: string;
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

export interface VolunteerApplicationDetail {
  id: number;
  partner_type: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  address?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  skills: string[];
  interests: string;
  availability_weekdays: boolean;
  availability_weekends: boolean;
  hours_per_week?: number;
  languages: string[];

  // Org / Influencer specific
  org_registration_number?: string;
  website_url?: string;
  industry?: string;
  org_type?: string;
  contact_person_name?: string;
  social_handle?: string;
  platform?: string;
  follower_count?: number;
  niche?: string;

  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  status: string;
  application_date: string;
  reviewed_by_id: number | null;
  reviewed_at: string | null;
  review_notes: string;
  created_at: string;
  updated_at: string;
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
  partner_type: string;
  full_name: string;
  email: string;
  role: string;
  position: string;
  city: string;
  state: string;
  total_hours: number;
  is_active: boolean;
  joined_date: string;
  last_activity_date: string | null;
  display_order: number;
}

export interface IndividualDetails {
  date_of_birth?: string;
  skills: string[];
  availability_weekdays: boolean;
  availability_weekends: boolean;
  hours_per_week?: number;
  languages: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
}

export interface OrganisationDetails {
  registration_number?: string;
  industry?: string;
  website_url?: string;
  contact_person_name?: string;
  org_type?: string;
}

export interface InfluencerDetails {
  platform?: string;
  handle?: string;
  follower_count?: number;
  niche?: string;
}

export interface VolunteerProfileDetail {
  id: number;
  partner_type: string;
  full_name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  address?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  interests?: string;
  role: string;
  position?: string;
  responsibilities?: string;
  bio?: string;
  linkedin_url?: string | null;
  tenure_end_date?: string | null;
  display_order: number;
  is_active: boolean;
  joined_date: string;
  total_hours: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;

  // Type specific details
  individual_details?: IndividualDetails;
  organisation_details?: OrganisationDetails;
  influencer_details?: InfluencerDetails;
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

export interface VolunteerOpportunityDetail {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  event_date: string;
  event_time: string;
  duration_hours: number;
  required_skills: string[];
  volunteers_needed: number;
  volunteers_accepted: number;
  status: string;
  is_published: boolean;
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

export interface VolunteerActivity {
  id: number;
  volunteer_id: number;
  volunteer_name: string;
  activity_type: string;
  activity_date: string;
  hours: number;
  description: string;
  campaign_id: number | null;
  campaign_title: string | null;
  opportunity_id: number | null;
  opportunity_title: string | null;
  people_helped: number | null;
  funds_raised: number | null;
  recorded_by_id: number;
  created_at: string;
}

export interface VolunteerCertificate {
  id: number;
  volunteer_id: number;
  volunteer_name: string;
  certificate_type: string;
  milestone_value: number;
  issued_date: string;
  certificate_url: string | null;
}

export interface CampaignVolunteerItem {
  id: number;
  volunteer_id: number;
  volunteer_name: string;
  campaign_id: number;
  campaign_title: string;
  status: string;
  hours_contributed: number;
  applied_date: string;
  reviewed_by_id: number | null;
  reviewed_at: string | null;
}

export interface OpportunityApplicationItem {
  id: number;
  volunteer_id: number;
  volunteer_name: string;
  opportunity_id: number;
  opportunity_title: string;
  status: string;
  applied_date: string;
  reviewed_by_id: number | null;
  reviewed_at: string | null;
}

export interface VolunteerSkill {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  is_active: boolean;
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

export interface EmailTemplateListItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  subject_template: string;
  variables: string[];
  required_variables: string[];
  is_active: boolean;
  times_sent: number;
  last_sent_at: string | null;
  is_predefined: boolean;
  storage_key?: string | null;
}

export interface EmailTemplateDetail {
  id: number;
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
  is_predefined: boolean;
  is_active: boolean;
  times_sent: number;
  last_sent_at: string | null;
  storage_key?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateVersionItem {
  id: number;
  version_number: number;
  subject_template: string;
  change_note: string;
  created_by_id: number | null;
  created_at: string;
}

export interface EmailLogListItem {
  id: number;
  to_email: string;
  subject: string;
  status: string;
  sent_at: string | null;
  error_message: string;
  retry_count: number;
  provider_message_id: string;
  created_at: string;
}

export interface TemplatePreviewResponse {
  subject: string;
  html_body: string;
  text_body: string;
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

export interface NewsletterSettings {
  site_name: string;
  site_url: string;
  contact_email: string;
  contact_phone: string;
  organization_address: string;
  facebook_url: string;
  instagram_url: string;
  x_url: string;
  linkedin_url: string;
  youtube_url: string;
  donate_url: string;
  volunteer_url: string;
  privacy_policy_url: string;
  unsubscribe_url: string;
  updated_at: string;
  updated_by_id: number | null;
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

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardSummary {
  campaigns: {
    total: number;
    active: number;
    draft: number;
    completed: number;
    paused: number;
  };
  top_campaigns: {
    id: number;
    title: string;
    target_unit: string;
    target_value: number;
    achieved_value: number;
    target_currency: string;
    status: string;
    progress: number;
  }[];
  donations: {
    total: number;
    total_amount: number;
    completed: number;
    pending: number;
    failed: number;
    average_amount: number;
  };
  inkind: {
    total: number;
    pending: number;
    verified: number;
    donated: number;
    total_value: number;
  };
  volunteers: {
    total: number;
    active: number;
    total_hours: number;
    pending_applications: number;
  };
  opportunities: {
    total: number;
    open: number;
    closed: number;
  };
  leadership: {
    total: number;
    active: number;
  };
  subscribers: {
    total: number;
    active: number;
  };
  volunteer_donations: {
    total_amount: number;
    total_count: number;
    this_month_amount: number;
    this_month_count: number;
    contributing_volunteers: number;
  };
  recent_activity: {
    id: number;
    action: string;
    entity_type: string;
    entity_name: string;
    description: string;
    user_email: string;
    created_at: string;
  }[];
  cached_at: string;
}

// ============================================================================
// Volunteer Donation (Finance) Types
// ============================================================================

export interface VolunteerDonationListItem {
  id: number;
  volunteer_id: number;
  volunteer_name: string;
  amount: number;
  date: string;
  payment_method: string;
  recorded_by_email: string;
  created_at: string;
}

export interface VolunteerDonationDetail {
  id: number;
  volunteer_id: number;
  volunteer_name: string;
  volunteer_role: string;
  amount: number;
  date: string;
  payment_method: string;
  transaction_reference: string;
  notes: string;
  recorded_by_email: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteerDonationSummary {
  total_amount: number;
  total_count: number;
  this_month_amount: number;
  this_month_count: number;
  month_wise: {
    month: number;
    year: number;
    total: number;
    count: number;
  }[];
  top_volunteers: {
    volunteer_id: number;
    volunteer_name: string;
    volunteer_role: string;
    total_amount: number;
    donation_count: number;
    last_donation_date: string | null;
  }[];
}

export interface BulkDonationResult {
  created: number;
  failed: number;
  errors: string[];
}

// ============================================================================
// Expenses Types
// ============================================================================

export interface ExpenseListItem {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  category_label: string;
  payment_method: string;
  paid_to: string;
  campaign_title: string | null;
  status: string;
  is_recurring: boolean;
  recorded_by_email: string;
  created_at: string;
}

export interface ExpenseDetail {
  id: number;
  title: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  category_label: string;
  payment_method: string;
  paid_to: string;
  reference_number: string;
  campaign_id: number | null;
  campaign_title: string | null;
  receipt_url: string;
  status: string;
  is_recurring: boolean;
  recurrence_note: string;
  notes: string;
  rejection_reason: string;
  recorded_by_email: string;
  approved_by_email: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseSummary {
  total_amount: number;
  total_count: number;
  paid_amount: number;
  pending_amount: number;
  this_month_amount: number;
  this_month_count: number;
  by_category: {
    category: string;
    category_label: string;
    total: number;
    count: number;
  }[];
  by_month: {
    month: number;
    year: number;
    total: number;
    count: number;
  }[];
  by_campaign: {
    campaign_id: number;
    campaign_title: string;
    total: number;
    count: number;
  }[];
}

// ============================================================================
// Programs Types
// ============================================================================

export interface ProgramCategory {
  id: number;
  name: string;
  slug: string;
  color_class: string;
  icon?: string;
  description: string;
  is_active: boolean;
  program_count?: number;
}

export interface ProgramListItem {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  featured_image: string;
  category_name: string;
  category_color: string;
  badge_label: string;
  location: string;
  event_date: string;
  volunteers_count: number;
  status: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export interface ProgramMedia {
  id: number;
  image_url: string;
  caption: string;
  alt_text: string;
  order: number;
  is_featured: boolean;
  uploaded_at: string;
}

export interface ProgramHighlight {
  id: number;
  text: string;
  order: number;
}

export interface ProgramQuote {
  id: number;
  text: string;
  author_name: string;
  author_role: string;
  order: number;
}

export interface ProgramDetail {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  full_story: string;
  category_id: number;
  category_name: string;
  category_color: string;
  badge_label: string;
  location: string;
  city: string;
  state: string;
  event_date: string;
  volunteers_count: number;
  beneficiaries_count: number | null;
  trees_planted: number | null;
  people_reached: number | null;
  featured_image: string;
  featured_image_alt: string;
  status: string;
  is_featured: boolean;
  display_order: number;
  meta_title: string;
  meta_description: string;
  view_count: number;
  media: ProgramMedia[];
  highlights: ProgramHighlight[];
  quotes: ProgramQuote[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ProgramSummary {
  total_programs: number;
  published_programs: number;
  draft_programs: number;
  archived_programs: number;
  featured_programs: number;
  total_views: number;
}

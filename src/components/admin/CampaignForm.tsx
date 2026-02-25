"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import type { Category } from "@/types/api";

export interface CampaignFormData {
  title: string;
  short_description: string;
  description: string;
  category_id: number | "";
  campaign_type: string;
  target_unit: string;
  target_value: number;
  target_currency: string;
  start_date: string;
  end_date: string;
  location: string;
  beneficiary_count: number;
  beneficiary_type: string;
  featured_image: string;
  video_url: string;
  visibility: string;
  priority: number;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
  og_image: string;
}

const CAMPAIGN_TYPES = [
  { value: "fundraising", label: "Fundraising" },
  { value: "awareness", label: "Awareness" },
  { value: "volunteer", label: "Volunteer Drive" },
  { value: "in_kind", label: "In-Kind Collection" },
];

const CURRENCIES = [
  { value: "INR", label: "₹ INR" },
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
];

const TARGET_UNITS = [
  { value: "money", label: "Money" },
  { value: "items", label: "Items" },
  { value: "volunteers", label: "Volunteers" },
  { value: "people", label: "People" },
];

const TYPE_TO_UNIT: Record<string, string> = {
  fundraising: "money",
  awareness: "people",
  volunteer: "volunteers",
  in_kind: "items",
};

function targetLabel(unit: string): string {
  switch (unit) {
    case "money": return "Target Amount *";
    case "items": return "Target Items *";
    case "volunteers": return "Target Volunteers *";
    case "people": return "Target People *";
    default: return "Target Value *";
  }
}

function targetPlaceholder(unit: string): string {
  switch (unit) {
    case "money": return "100000";
    case "items": return "500";
    case "volunteers": return "50";
    case "people": return "10000";
    default: return "0";
  }
}

function formatGoalValue(value: number, unit: string, currency: string): string {
  if (unit === "money") {
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₹";
    return `${sym}${value.toLocaleString()}`;
  }
  return `${value.toLocaleString()} ${unit}`;
}

const VISIBILITY = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "unlisted", label: "Unlisted" },
];

const STEPS = [
  { id: "basic", label: "Basic Info", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "media", label: "Media", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { id: "seo", label: "SEO", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { id: "preview", label: "Preview", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface CampaignFormProps {
  initialData?: Partial<CampaignFormData>;
  categories: Category[];
  onSubmit: (data: CampaignFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function CampaignForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isEdit = false,
}: CampaignFormProps) {
  const [form, setForm] = useState<CampaignFormData>({
    title: initialData?.title || "",
    short_description: initialData?.short_description || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || "",
    campaign_type: initialData?.campaign_type || "fundraising",
    target_unit: initialData?.target_unit || TYPE_TO_UNIT[initialData?.campaign_type || "fundraising"] || "money",
    target_value: initialData?.target_value || 0,
    target_currency: initialData?.target_currency || "INR",
    start_date: initialData?.start_date
      ? new Date(initialData.start_date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    end_date: initialData?.end_date
      ? new Date(initialData.end_date).toISOString().slice(0, 16)
      : "",
    location: initialData?.location || "",
    beneficiary_count: initialData?.beneficiary_count || 0,
    beneficiary_type: initialData?.beneficiary_type || "",
    featured_image: initialData?.featured_image || "",
    video_url: initialData?.video_url || "",
    visibility: initialData?.visibility || "public",
    priority: initialData?.priority || 0,
    is_featured: initialData?.is_featured || false,
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
    og_image: initialData?.og_image || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [step, setStep] = useState(0);
  const [ogSameAsFeatured, setOgSameAsFeatured] = useState(
    !!(initialData?.og_image && initialData?.featured_image && initialData.og_image === initialData.featured_image)
  );
  const [formDirty, setFormDirty] = useState(false);

  // Warn on page close / reload when form has unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (formDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formDirty]);

  const currentStep = STEPS[step].id;

  const validateBasic = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.short_description.trim() || form.short_description.length < 10)
      errs.short_description = "Short description needs at least 10 characters";
    if (!form.description.trim() || form.description.length < 10)
      errs.description = "Description needs at least 10 characters";
    if (!form.category_id) errs.category_id = "Category is required";
    if (form.target_value <= 0) errs.target_value = "Target value must be > 0";
    if (!form.start_date) errs.start_date = "Start date is required";
    return errs;
  };

  const handleNext = () => {
    if (currentStep === "basic") {
      const errs = validateBasic();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    const errs = validateBasic();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setStep(0);
      return;
    }
    setSubmitting(true);
    setApiError("");
    try {
      setFormDirty(false);
      await onSubmit(form);
    } catch (err) {
      setFormDirty(true);
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof CampaignFormData, value: string | number | boolean) => {
    setFormDirty(true);
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "campaign_type" && typeof value === "string" && TYPE_TO_UNIT[value]) {
        next.target_unit = TYPE_TO_UNIT[value];
      }
      if (field === "featured_image" && ogSameAsFeatured && typeof value === "string") {
        next.og_image = value;
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const categoryName = categories.find((c) => c.id === form.category_id)?.name || "—";
  const typeLabel = CAMPAIGN_TYPES.find((t) => t.value === form.campaign_type)?.label || form.campaign_type;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center gap-0 bg-gray-50 rounded-xl p-2 overflow-x-auto">
        {STEPS.map((s, i) => {
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (i < step) setStep(i);
                else if (i === step + 1) handleNext();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : isCompleted
                  ? "text-brand-600 hover:text-brand-700"
                  : "text-gray-400"
              }`}
            >
              <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white"
                  : isCompleted
                  ? "bg-brand-100 text-brand-600"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {isCompleted ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Basic Info */}
      <div className={currentStep === "basic" ? "space-y-6" : "hidden"}>
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h2>
            <div className="space-y-4">
              <Input
                label="Title *"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                error={errors.title}
                placeholder="e.g., Clean Water for Rural Schools"
              />
              <Input
                label="Short Description *"
                value={form.short_description}
                onChange={(e) => update("short_description", e.target.value)}
                error={errors.short_description}
                placeholder="Brief summary for campaign cards (max 500 chars)"
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={6}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${
                    errors.description ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Full campaign description with impact details..."
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  value={form.category_id}
                  onChange={(e) => update("category_id", Number(e.target.value))}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${
                    errors.category_id ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Campaign Type</label>
                <select
                  value={form.campaign_type}
                  onChange={(e) => update("campaign_type", e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                >
                  {CAMPAIGN_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Goal & Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={targetLabel(form.target_unit)}
                type="number"
                value={form.target_value}
                onChange={(e) => update("target_value", Number(e.target.value))}
                error={errors.target_value}
                placeholder={targetPlaceholder(form.target_unit)}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Target Unit</label>
                <select
                  value={form.target_unit}
                  onChange={(e) => update("target_unit", e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                >
                  {TARGET_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
              {form.target_unit === "money" ? (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    value={form.target_currency}
                    onChange={(e) => update("target_currency", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  label="Location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              )}
            </div>
            {form.target_unit === "money" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Start Date & Time *"
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => update("start_date", e.target.value)}
                error={errors.start_date}
              />
              <Input
                label="End Date & Time"
                type="datetime-local"
                value={form.end_date}
                onChange={(e) => update("end_date", e.target.value)}
              />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Beneficiaries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Beneficiary Count"
                type="number"
                value={form.beneficiary_count}
                onChange={(e) => update("beneficiary_count", Number(e.target.value))}
                placeholder="0"
              />
              <Input
                label="Beneficiary Type"
                value={form.beneficiary_type}
                onChange={(e) => update("beneficiary_type", e.target.value)}
                placeholder="e.g., children, families, students"
              />
            </div>
          </section>
      </div>

      {/* Step 2: Media — always mounted so ImageUpload state persists */}
      <div className={currentStep === "media" ? "space-y-6" : "hidden"}>
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h2>
            <ImageUpload
              value={form.featured_image}
              onChange={(url) => update("featured_image", url)}
              folder="campaigns"
              label="Campaign Cover Image"
              variant="banner"
              deferred
              hint="Recommended: 1920×1080 or 16:9 aspect ratio, max 5MB"
            />
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Video</h2>
            <Input
              label="Video URL"
              type="url"
              value={form.video_url}
              onChange={(e) => update("video_url", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-400 mt-1">YouTube or Vimeo link</p>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Open Graph Image</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ogSameAsFeatured}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setOgSameAsFeatured(checked);
                    if (checked) {
                      setForm((prev) => ({ ...prev, og_image: prev.featured_image }));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                />
                <span className="text-sm text-gray-600">Same as featured image</span>
              </label>
            </div>

            {ogSameAsFeatured ? (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center gap-3">
                {form.featured_image ? (
                  <>
                    <img src={form.featured_image} alt="OG" className="h-16 w-28 rounded-lg object-cover border border-gray-200" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Using featured image</p>
                      <p className="text-xs text-gray-400 mt-0.5">The OG image will automatically use the same image as the campaign cover</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700">No featured image set</p>
                    <p className="text-xs text-gray-400 mt-0.5">Upload a featured image above first, and it will be used as the OG image too</p>
                  </div>
                )}
              </div>
            ) : (
              <ImageUpload
                value={form.og_image}
                onChange={(url) => update("og_image", url)}
                folder="campaigns/og"
                label="OG Image (Social Sharing)"
                variant="banner"
                deferred
                hint="1200×630 recommended. Shown when shared on social media."
              />
            )}
          </section>
      </div>

      {/* Step 3: Settings */}
      <div className={currentStep === "settings" ? "space-y-6" : "hidden"}>
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visibility & Priority</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Visibility</label>
                <select
                  value={form.visibility}
                  onChange={(e) => update("visibility", e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                >
                  {VISIBILITY.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Priority"
                type="number"
                value={form.priority}
                onChange={(e) => update("priority", Number(e.target.value))}
                placeholder="0 (higher = more important)"
              />
              <div className="space-y-1 flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => update("is_featured", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Campaign</span>
                </label>
              </div>
            </div>
          </section>
      </div>

      {/* Step 4: SEO */}
      <div className={currentStep === "seo" ? "space-y-6" : "hidden"}>
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Engine Optimization</h2>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={form.meta_title}
                onChange={(e) => update("meta_title", e.target.value)}
                placeholder="Defaults to campaign title if empty"
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => update("meta_description", e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  placeholder="Defaults to short description if empty"
                />
                <p className="text-xs text-gray-400">{form.meta_description.length}/500</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Google Preview</p>
              <p className="text-[#1a0dab] text-lg leading-snug truncate">
                {form.meta_title || form.title || "Campaign Title"}
              </p>
              <p className="text-[#006621] text-sm">hridayam.org/campaigns/...</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {form.meta_description || form.short_description || "Campaign description will appear here..."}
              </p>
            </div>
          </section>
      </div>

      {/* Step 5: Preview */}
      <div className={currentStep === "preview" ? "space-y-6" : "hidden"}>
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {form.featured_image ? (
              <div className="relative w-full bg-gray-100" style={{ aspectRatio: "16/9" }}>
                <img src={form.featured_image} alt={form.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="inline-block px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur rounded-full text-gray-800 capitalize mb-2">
                    {typeLabel}
                  </span>
                  <h2 className="text-2xl font-bold text-white leading-tight">{form.title || "Campaign Title"}</h2>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-brand-50 to-accent-50 p-8">
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-white rounded-full text-gray-800 capitalize mb-3">
                  {typeLabel}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">{form.title || "Campaign Title"}</h2>
              </div>
            )}

            <div className="p-6 space-y-5">
              <p className="text-gray-600">{form.short_description || "Short description will appear here..."}</p>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Goal</span>
                  <span className="font-bold text-gray-900">{formatGoalValue(form.target_value, form.target_unit, form.target_currency)}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-400 to-accent-400 rounded-full w-0" />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">0% achieved — Campaign will start as Draft</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Category", value: categoryName, icon: "🏷️" },
                  { label: "Location", value: form.location || "—", icon: "📍" },
                  { label: "Start Date", value: form.start_date ? new Date(form.start_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—", icon: "📅" },
                  { label: "End Date", value: form.end_date ? new Date(form.end_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—", icon: "🏁" },
                  { label: "Beneficiaries", value: form.beneficiary_count || "—", icon: "👥" },
                  { label: "Beneficiary Type", value: form.beneficiary_type || "—", icon: "🎯" },
                  { label: "Visibility", value: form.visibility, icon: "🔒" },
                  { label: "Priority", value: form.priority, icon: "⚡" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-lg border border-gray-100 p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      {/* <span>{item.icon}</span>  */}
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">{String(item.value)}</p>
                  </div>
                ))}
              </div>

              {form.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Description</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">{form.description}</p>
                </div>
              )}

              {form.video_url && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Video</h3>
                  <p className="text-sm text-brand-500 truncate">{form.video_url}</p>
                </div>
              )}

              {form.is_featured && (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                  ★ Featured Campaign
                </span>
              )}
            </div>
          </section>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div>
          {step === 0 ? (
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          ) : (
            <Button type="button" variant="secondary" onClick={handleBack}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-400 hidden sm:block">
          Step {step + 1} of {STEPS.length}
          {currentStep === "preview" && (isEdit ? " — Review your changes" : " — Campaign will be created as Draft")}
        </p>

        <div>
          {currentStep === "preview" ? (
            <Button type="button" loading={submitting} onClick={handleSubmit}>
              {isEdit ? "Save Changes" : "Create Campaign"}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Next
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

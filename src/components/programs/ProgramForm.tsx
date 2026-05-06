"use client";

import { useState, useEffect } from "react";
import { useProgramsStore } from "@/lib/stores/programs";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface FormData {
  title: string;
  short_description: string;
  full_story: string;
  category_id: string;
  badge_label: string;
  location: string;
  city: string;
  state: string;
  event_date: string;
  volunteers_count: string;
  beneficiaries_count: string;
  trees_planted: string;
  people_reached: string;
  featured_image: string;
  featured_image_alt: string;
  status: string;
  is_featured: boolean;
  display_order: string;
  meta_title: string;
  meta_description: string;
}

interface ProgramFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: {
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
  }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ProgramForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create Program",
}: ProgramFormProps) {
  const { categories, fetchCategories } = useProgramsStore();
  const [form, setForm] = useState<FormData>({
    title: initialData?.title ?? "",
    short_description: initialData?.short_description ?? "",
    full_story: initialData?.full_story ?? "",
    category_id: initialData?.category_id ?? "",
    badge_label: initialData?.badge_label ?? "",
    location: initialData?.location ?? "",
    city: initialData?.city ?? "",
    state: initialData?.state ?? "",
    event_date: initialData?.event_date ?? new Date().toISOString().split("T")[0],
    volunteers_count: initialData?.volunteers_count ?? "0",
    beneficiaries_count: initialData?.beneficiaries_count ?? "",
    trees_planted: initialData?.trees_planted ?? "",
    people_reached: initialData?.people_reached ?? "",
    featured_image: initialData?.featured_image ?? "",
    featured_image_alt: initialData?.featured_image_alt ?? "",
    status: initialData?.status ?? "draft",
    is_featured: initialData?.is_featured ?? false,
    display_order: initialData?.display_order ?? "0",
    meta_title: initialData?.meta_title ?? "",
    meta_description: initialData?.meta_description ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.short_description.trim()) errs.short_description = "Short description is required";
    if (form.short_description.length > 500) errs.short_description = "Max 500 characters";
    if (!form.full_story.trim()) errs.full_story = "Full story is required";
    if (!form.category_id) errs.category_id = "Category is required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.event_date) errs.event_date = "Event date is required";
    if (!form.featured_image.trim()) errs.featured_image = "Featured image URL is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        short_description: form.short_description.trim(),
        full_story: form.full_story.trim(),
        category_id: parseInt(form.category_id),
        badge_label: form.badge_label.trim() || undefined,
        location: form.location.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        event_date: form.event_date,
        volunteers_count: form.volunteers_count ? parseInt(form.volunteers_count) : 0,
        beneficiaries_count: form.beneficiaries_count ? parseInt(form.beneficiaries_count) : null,
        trees_planted: form.trees_planted ? parseInt(form.trees_planted) : null,
        people_reached: form.people_reached ? parseInt(form.people_reached) : null,
        featured_image: form.featured_image.trim(),
        featured_image_alt: form.featured_image_alt.trim() || undefined,
        status: form.status,
        is_featured: form.is_featured,
        display_order: form.display_order ? parseInt(form.display_order) : 0,
        meta_title: form.meta_title.trim() || undefined,
        meta_description: form.meta_description.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Tree Plantation Drive"
            error={errors.title}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Short Description <span className="text-gray-400">({form.short_description.length}/500)</span>
            </label>
            <textarea
              value={form.short_description}
              onChange={(e) => set("short_description", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Brief description for cards/previews"
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${
                errors.short_description ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.short_description && <p className="text-sm text-red-600">{errors.short_description}</p>}
          </div>

          <RichTextEditor
            label="Full Story"
            value={form.full_story}
            onChange={(value) => set("full_story", value)}
            placeholder="Write the full story with markdown formatting..."
            rows={10}
            error={errors.full_story}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${
                  errors.category_id ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
            </div>

            <Input
              label="Badge Label Override (optional)"
              value={form.badge_label}
              onChange={(e) => set("badge_label", e.target.value)}
              placeholder="Leave empty to use category name"
            />
          </div>
        </div>
      </div>

      {/* Location & Date */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Date</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Full Location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Bhimavaram, Andhra Pradesh"
              error={errors.location}
            />
          </div>
          <Input
            label="City"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="e.g. Bhimavaram"
            error={errors.city}
          />
          <Input
            label="State"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            placeholder="e.g. Andhra Pradesh"
            error={errors.state}
          />
          <Input
            label="Event Date"
            type="date"
            value={form.event_date}
            onChange={(e) => set("event_date", e.target.value)}
            error={errors.event_date}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Volunteers Count"
            type="number"
            min="0"
            value={form.volunteers_count}
            onChange={(e) => set("volunteers_count", e.target.value)}
          />
          <Input
            label="Beneficiaries Count (optional)"
            type="number"
            min="0"
            value={form.beneficiaries_count}
            onChange={(e) => set("beneficiaries_count", e.target.value)}
            placeholder="Number of people directly benefited"
          />
          <Input
            label="Trees Planted (optional)"
            type="number"
            min="0"
            value={form.trees_planted}
            onChange={(e) => set("trees_planted", e.target.value)}
            placeholder="For environmental programs"
          />
          <Input
            label="People Reached (optional)"
            type="number"
            min="0"
            value={form.people_reached}
            onChange={(e) => set("people_reached", e.target.value)}
            placeholder="For awareness programs"
          />
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
        <div className="space-y-4">
          <ImageUpload
            value={form.featured_image}
            onChange={(url) => set("featured_image", url)}
            label="Main Hero Image"
            folder="programs"
            aspectRatio="aspect-video"
          />
          <Input
            label="Alt Text (for accessibility)"
            value={form.featured_image_alt}
            onChange={(e) => set("featured_image_alt", e.target.value)}
            placeholder="Describe the image for screen readers"
          />
        </div>
      </div>

      {/* Status & Visibility */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Visibility</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <Input
            label="Display Order"
            type="number"
            min="0"
            value={form.display_order}
            onChange={(e) => set("display_order", e.target.value)}
            placeholder="Lower = first"
          />
          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              id="is_featured"
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
              Show on homepage (Featured)
            </label>
          </div>
        </div>
      </div>

      {/* SEO (collapsible) */}
      <details className="bg-white rounded-xl border border-gray-100">
        <summary className="cursor-pointer p-6 font-semibold text-gray-900">
          SEO Settings (optional)
        </summary>
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
          <Input
            label="Meta Title"
            value={form.meta_title}
            onChange={(e) => set("meta_title", e.target.value)}
            placeholder="Defaults to title"
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea
              value={form.meta_description}
              onChange={(e) => set("meta_description", e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Defaults to short description"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
            />
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>

    </form>
  );
}

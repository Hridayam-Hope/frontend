"use client";

import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";

export interface MemberFormData {
  full_name: string;
  email: string;
  phone: string;
  profile_photo: string;
  role: string;
  position: string;
  responsibilities: string;
  bio: string;
  linkedin_url: string;
  joined_date: string;
  tenure_end_date: string;
  display_order: number;
  is_active?: boolean;
}

const ROLES = [
  { value: "founder", label: "Founder" },
  { value: "co_founder", label: "Co-Founder" },
  { value: "trustee", label: "Trustee" },
  { value: "board_member", label: "Board Member" },
  { value: "advisor", label: "Advisor" },
];

const POSITIONS = [
  "Chairman",
  "Vice Chairman",
  "Secretary",
  "Treasurer",
  "Director",
  "Trustee",
  "Advisor",
  "Member",
];

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function MemberForm({ initialData, onSubmit, onCancel, isEdit = false }: MemberFormProps) {
  const [form, setForm] = useState<MemberFormData>({
    full_name: initialData?.full_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    profile_photo: initialData?.profile_photo || "",
    role: initialData?.role || "board_member",
    position: initialData?.position || "",
    responsibilities: initialData?.responsibilities || "",
    bio: initialData?.bio || "",
    linkedin_url: initialData?.linkedin_url || "",
    joined_date: initialData?.joined_date || new Date().toISOString().split("T")[0],
    tenure_end_date: initialData?.tenure_end_date || "",
    display_order: initialData?.display_order ?? 0,
    is_active: initialData?.is_active ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.full_name.trim()) errs.full_name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.role) errs.role = "Role is required";
    if (!form.position.trim()) errs.position = "Position is required";
    if (!form.joined_date) errs.joined_date = "Joined date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof MemberFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {/* Personal Information */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <ImageUpload
              value={form.profile_photo}
              onChange={(url) => update("profile_photo", url)}
              folder="members"
              label="Profile Photo"
            />
          </div>
          <Input
            label="Full Name *"
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            error={errors.full_name}
            placeholder="e.g., John Doe"
          />
          <Input
            label="Email *"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            placeholder="john@example.com"
          />
          <Input
            label="Phone *"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
            placeholder="+91 98765 43210"
          />
          <Input
            label="LinkedIn URL"
            type="url"
            value={form.linkedin_url}
            onChange={(e) => update("linkedin_url", e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </section>

      {/* Role & Position */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role & Position</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Role *</label>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${
                errors.role ? "border-red-400" : "border-gray-300"
              }`}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Position *</label>
            <div className="relative">
              <input
                list="position-options"
                value={form.position}
                onChange={(e) => update("position", e.target.value)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${
                  errors.position ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="e.g., Chairman, Secretary"
              />
              <datalist id="position-options">
                {POSITIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
            {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
          </div>

          <Input
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(e) => update("display_order", parseInt(e.target.value) || 0)}
            placeholder="0"
          />

          {isEdit && (
            <div className="space-y-1 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => update("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          )}
        </div>
      </section>

      {/* Tenure */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tenure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Joined Date *"
            type="date"
            value={form.joined_date}
            onChange={(e) => update("joined_date", e.target.value)}
            error={errors.joined_date}
          />
          <Input
            label="Tenure End Date"
            type="date"
            value={form.tenure_end_date}
            onChange={(e) => update("tenure_end_date", e.target.value)}
            placeholder="Leave blank for indefinite"
          />
        </div>
      </section>

      {/* Bio & Responsibilities */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bio & Responsibilities</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
            <textarea
              value={form.responsibilities}
              onChange={(e) => update("responsibilities", e.target.value)}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              placeholder="Key responsibilities and areas of focus..."
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              placeholder="Professional background and expertise..."
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? "Update Member" : "Create Member"}
        </Button>
      </div>
    </form>
  );
}

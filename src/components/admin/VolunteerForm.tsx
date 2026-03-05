"use client";

import { useState, useEffect, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useVolunteersStore } from "@/lib/stores/volunteers";

export interface VolunteerFormData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  skill_ids: number[];
  interests: string;
  availability_weekdays: boolean;
  availability_weekends: boolean;
  hours_per_week: number;
  languages: string[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  role: string;
  position: string;
  responsibilities: string;
  bio: string;
  linkedin_url: string;
  tenure_end_date: string;
  display_order: number;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

const LEADERSHIP_ROLES = [
  { value: "member", label: "Member" },
  { value: "founder", label: "Founder" },
  { value: "co_founder", label: "Co-Founder" },
  { value: "trustee", label: "Trustee" },
  { value: "board_member", label: "Board Member" },
  { value: "advisor", label: "Advisor" },
];

interface VolunteerFormProps {
  onSubmit: (data: VolunteerFormData) => Promise<void>;
  onCancel: () => void;
}

export default function VolunteerForm({ onSubmit, onCancel }: VolunteerFormProps) {
  const { skills, fetchSkills, skillsLoading } = useVolunteersStore();
  const [form, setForm] = useState<VolunteerFormData>({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    skill_ids: [],
    interests: "",
    availability_weekdays: true,
    availability_weekends: false,
    hours_per_week: 4,
    languages: [],
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
    role: "member",
    position: "",
    responsibilities: "",
    bio: "",
    linkedin_url: "",
    tenure_end_date: "",
    display_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [activeSection, setActiveSection] = useState<"basic" | "skills" | "leadership" | "emergency">("basic");
  const [languageInput, setLanguageInput] = useState("");

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.full_name.trim()) errs.full_name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.date_of_birth) errs.date_of_birth = "Date of birth is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.postal_code.trim()) errs.postal_code = "Postal code is required";
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const basicFields = ["full_name", "email", "phone", "date_of_birth", "address", "city", "state", "postal_code"];
      const firstErr = Object.keys(errs)[0];
      if (basicFields.includes(firstErr)) setActiveSection("basic");
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      // Clean up the data before sending
      const submitData: Record<string, unknown> = { ...form };
      
      // Remove empty optional fields
      if (!submitData.tenure_end_date) delete submitData.tenure_end_date;
      if (!submitData.position) delete submitData.position;
      if (!submitData.responsibilities) delete submitData.responsibilities;
      if (!submitData.bio) delete submitData.bio;
      if (!submitData.linkedin_url) delete submitData.linkedin_url;
      if (!submitData.interests) delete submitData.interests;
      if (!submitData.emergency_contact_name) delete submitData.emergency_contact_name;
      if (!submitData.emergency_contact_phone) delete submitData.emergency_contact_phone;
      if (!submitData.emergency_contact_relationship) delete submitData.emergency_contact_relationship;
      
      await onSubmit(submitData as any);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof VolunteerFormData, value: string | number | boolean | number[] | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleSkill = (skillId: number) => {
    const current = form.skill_ids;
    if (current.includes(skillId)) {
      update("skill_ids", current.filter((id) => id !== skillId));
    } else {
      update("skill_ids", [...current, skillId]);
    }
  };

  const addLanguage = () => {
    if (languageInput.trim() && !form.languages.includes(languageInput.trim())) {
      update("languages", [...form.languages, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    update("languages", form.languages.filter((l) => l !== lang));
  };

  const sections = [
    { id: "basic" as const, label: "Basic Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "skills" as const, label: "Skills & Availability", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "leadership" as const, label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "emergency" as const, label: "Emergency Contact", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {/* Section Nav */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
              activeSection === sec.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sec.icon} />
            </svg>
            {sec.label}
          </button>
        ))}
      </div>

      {/* Basic Info */}
      {activeSection === "basic" && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <Input label="Full Name *" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} error={errors.full_name} placeholder="John Doe" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Email *" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} placeholder="john@example.com" />
                <Input label="Phone *" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} placeholder="+91 9876543210" />
              </div>
              <Input label="Date of Birth *" type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} error={errors.date_of_birth} />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Address *</label>
                <textarea
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  rows={2}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${errors.address ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Street address, apartment, etc."
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} error={errors.city} placeholder="Mumbai" />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${errors.state ? "border-red-400" : "border-gray-300"}`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                </div>
                <Input label="Postal Code *" value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)} error={errors.postal_code} placeholder="400001" />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Skills & Availability */}
      {activeSection === "skills" && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            {skillsLoading ? (
              <p className="text-sm text-gray-500">Loading skills...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                      form.skill_ids.includes(skill.id)
                        ? "bg-brand-500 text-white border-brand-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.availability_weekdays}
                    onChange={(e) => update("availability_weekdays", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                  />
                  <span className="text-sm text-gray-700">Weekdays</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.availability_weekends}
                    onChange={(e) => update("availability_weekends", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                  />
                  <span className="text-sm text-gray-700">Weekends</span>
                </label>
              </div>
              <Input label="Hours per Week" type="number" value={form.hours_per_week} onChange={(e) => update("hours_per_week", Number(e.target.value))} />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages & Interests</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Languages</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                    placeholder="Add language"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  />
                  <button type="button" onClick={addLanguage} className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.languages.map((lang) => (
                    <span key={lang} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      {lang}
                      <button type="button" onClick={() => removeLanguage(lang)} className="text-gray-400 hover:text-gray-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <textarea
                  value={form.interests}
                  onChange={(e) => update("interests", e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  placeholder="Describe volunteer interests..."
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* About */}
      {activeSection === "leadership" && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                >
                  {LEADERSHIP_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <Input label="Position" value={form.position} onChange={(e) => update("position", e.target.value)} placeholder="e.g., Head of Operations" />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                <textarea
                  value={form.responsibilities}
                  onChange={(e) => update("responsibilities", e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  placeholder="Key responsibilities..."
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  placeholder="Professional bio..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="LinkedIn URL" value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
                <Input label="Tenure End Date" type="date" value={form.tenure_end_date} onChange={(e) => update("tenure_end_date", e.target.value)} />
              </div>
              <Input label="Display Order" type="number" value={form.display_order} onChange={(e) => update("display_order", Number(e.target.value))} />
            </div>
          </section>
        </div>
      )}

      {/* Emergency Contact */}
      {activeSection === "emergency" && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
            <div className="space-y-4">
              <Input label="Contact Name" value={form.emergency_contact_name} onChange={(e) => update("emergency_contact_name", e.target.value)} placeholder="Jane Doe" />
              <Input label="Contact Phone" value={form.emergency_contact_phone} onChange={(e) => update("emergency_contact_phone", e.target.value)} placeholder="+91 9876543210" />
              <Input label="Relationship" value={form.emergency_contact_relationship} onChange={(e) => update("emergency_contact_relationship", e.target.value)} placeholder="Spouse, Parent, Sibling, etc." />
            </div>
          </section>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs text-gray-400">Volunteer will be created with active status</p>
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create Volunteer</Button>
        </div>
      </div>
    </form>
  );
}

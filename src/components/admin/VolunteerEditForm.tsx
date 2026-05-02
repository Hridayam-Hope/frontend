"use client";

import { useState, useEffect, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import type { VolunteerProfileDetail } from "@/types/api";

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

type Section = "basic" | "details" | "role" | "emergency";

interface Props {
  volunteer: VolunteerProfileDetail;
  onSaved: (updated: VolunteerProfileDetail) => void;
  onCancel: () => void;
}

export default function VolunteerEditForm({ volunteer, onSaved, onCancel }: Props) {
  const { updateVolunteer, skills, fetchSkills, skillsLoading } = useVolunteersStore();
  const pt = volunteer.partner_type;

  const [activeSection, setActiveSection] = useState<Section>("basic");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  // ── Form state ──
  const [form, setForm] = useState({
    // Base
    full_name: volunteer.full_name,
    phone: volunteer.phone,
    address: volunteer.address ?? "",
    city: volunteer.city,
    state: volunteer.state,
    postal_code: volunteer.postal_code ?? "",
    country: volunteer.country ?? "India",
    interests: volunteer.interests ?? "",
    // Role / Leadership
    role: volunteer.role ?? "member",
    position: volunteer.position ?? "",
    responsibilities: volunteer.responsibilities ?? "",
    bio: volunteer.bio ?? "",
    linkedin_url: volunteer.linkedin_url ?? "",
    // Individual
    skill_ids: volunteer.individual_details?.skills
      ? [] as number[] // will be populated from skills list by name match
      : [] as number[],
    availability_weekdays: volunteer.individual_details?.availability_weekdays ?? false,
    availability_weekends: volunteer.individual_details?.availability_weekends ?? false,
    hours_per_week: volunteer.individual_details?.hours_per_week ?? 0,
    languages: volunteer.individual_details?.languages ?? ([] as string[]),
    emergency_contact_name: volunteer.individual_details?.emergency_contact_name ?? "",
    emergency_contact_phone: volunteer.individual_details?.emergency_contact_phone ?? "",
    emergency_contact_relationship: volunteer.individual_details?.emergency_contact_relationship ?? "",
    // Org
    org_registration_number: volunteer.organisation_details?.registration_number ?? "",
    website_url: volunteer.organisation_details?.website_url ?? "",
    industry: volunteer.organisation_details?.industry ?? "",
    org_type: volunteer.organisation_details?.org_type ?? "",
    contact_person_name: volunteer.organisation_details?.contact_person_name ?? "",
    // Influencer
    social_handle: volunteer.influencer_details?.handle ?? "",
    platform: volunteer.influencer_details?.platform ?? "",
    follower_count: volunteer.influencer_details?.follower_count ?? 0,
    niche: volunteer.influencer_details?.niche ?? "",
  });

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Once skills are loaded, resolve the volunteer's current skill IDs by name
  useEffect(() => {
    if (skills.length > 0 && volunteer.individual_details?.skills) {
      const currentSkillNames = new Set(volunteer.individual_details.skills);
      const ids = skills
        .filter((s) => currentSkillNames.has(s.name))
        .map((s) => s.id);
      setForm((prev) => ({ ...prev, skill_ids: ids }));
    }
  }, [skills, volunteer.individual_details?.skills]);

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (id: number) => {
    const current = form.skill_ids;
    update("skill_ids", current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };

  const addLanguage = () => {
    const lang = languageInput.trim();
    if (lang && !form.languages.includes(lang)) {
      update("languages", [...form.languages, lang]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    update("languages", form.languages.filter((l) => l !== lang));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setApiError("");
    try {
      const payload: Record<string, unknown> = {
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: form.country,
        interests: form.interests,
        role: form.role,
        position: form.position || undefined,
        responsibilities: form.responsibilities || undefined,
        bio: form.bio || undefined,
        linkedin_url: form.linkedin_url || undefined,
      };

      if (pt === "individual") {
        payload.skill_ids = form.skill_ids;
        payload.availability_weekdays = form.availability_weekdays;
        payload.availability_weekends = form.availability_weekends;
        payload.hours_per_week = form.hours_per_week;
        payload.languages = form.languages;
        payload.emergency_contact_name = form.emergency_contact_name;
        payload.emergency_contact_phone = form.emergency_contact_phone;
        payload.emergency_contact_relationship = form.emergency_contact_relationship;
      } else if (pt === "organisation") {
        payload.org_registration_number = form.org_registration_number;
        payload.website_url = form.website_url || undefined;
        payload.industry = form.industry;
        payload.org_type = form.org_type;
        payload.contact_person_name = form.contact_person_name;
      } else if (pt === "influencer") {
        payload.social_handle = form.social_handle;
        payload.platform = form.platform;
        payload.follower_count = form.follower_count;
        payload.niche = form.niche;
      }

      const updated = await updateVolunteer(volunteer.id, payload);
      onSaved(updated);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: "basic", label: "Basic Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "details", label: pt === "individual" ? "Skills" : pt === "organisation" ? "Org Details" : "Influencer", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "role", label: "Role & Bio", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    ...(pt === "individual" ? [{ id: "emergency" as Section, label: "Emergency", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }] : []),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
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
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all ${
              activeSection === sec.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sec.icon} />
            </svg>
            {sec.label}
          </button>
        ))}
      </div>

      {/* ── Basic Info ── */}
      {activeSection === "basic" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Personal / Contact</h3>
            <div className="space-y-3">
              <Input label="Full Name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Address</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  rows={2}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  >
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Input label="Postal Code" value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <textarea
                  value={form.interests}
                  onChange={(e) => update("interests", e.target.value)}
                  rows={2}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  placeholder="Volunteer interests..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Individual: Skills & Availability ── */}
      {activeSection === "details" && pt === "individual" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Skills</h3>
            {skillsLoading ? (
              <p className="text-sm text-gray-400">Loading skills...</p>
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
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.availability_weekdays} onChange={(e) => update("availability_weekdays", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400" />
                  <span className="text-sm text-gray-700">Weekdays</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.availability_weekends} onChange={(e) => update("availability_weekends", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400" />
                  <span className="text-sm text-gray-700">Weekends</span>
                </label>
              </div>
              <Input label="Hours per Week" type="number" value={form.hours_per_week} onChange={(e) => update("hours_per_week", Number(e.target.value))} />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Languages</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                    placeholder="Add language"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  />
                  <button type="button" onClick={addLanguage} className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.languages.map((lang) => (
                    <span key={lang} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      {lang}
                      <button type="button" onClick={() => removeLanguage(lang)} className="text-gray-400 hover:text-gray-600 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Organisation Details ── */}
      {activeSection === "details" && pt === "organisation" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Organisation Details</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Registration Number" value={form.org_registration_number} onChange={(e) => update("org_registration_number", e.target.value)} placeholder="REG-12345" />
              <Input label="Website URL" value={form.website_url} onChange={(e) => update("website_url", e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Industry" value={form.industry} onChange={(e) => update("industry", e.target.value)} />
              <Input label="Org Type" value={form.org_type} onChange={(e) => update("org_type", e.target.value)} />
            </div>
            <Input label="Contact Person Name" value={form.contact_person_name} onChange={(e) => update("contact_person_name", e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Influencer Details ── */}
      {activeSection === "details" && pt === "influencer" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Influencer Profile</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Social Handle" value={form.social_handle} onChange={(e) => update("social_handle", e.target.value)} placeholder="@handle" />
              <Input label="Platform" value={form.platform} onChange={(e) => update("platform", e.target.value)} placeholder="Instagram, YouTube..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Follower Count" type="number" value={form.follower_count} onChange={(e) => update("follower_count", Number(e.target.value))} />
              <Input label="Niche" value={form.niche} onChange={(e) => update("niche", e.target.value)} placeholder="Social Work, Education..." />
            </div>
          </div>
        </div>
      )}

      {/* ── Role & Bio ── */}
      {activeSection === "role" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Role & Bio</h3>
          <div className="space-y-3">
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
            <Input label="Position" value={form.position} onChange={(e) => update("position", e.target.value)} placeholder="Head of Operations..." />
            <Input label="LinkedIn URL" value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
              <textarea value={form.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} rows={3} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={4} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" />
            </div>
          </div>
        </div>
      )}

      {/* ── Emergency Contact ── */}
      {activeSection === "emergency" && pt === "individual" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Emergency Contact</h3>
          <div className="space-y-3">
            <Input label="Contact Name" value={form.emergency_contact_name} onChange={(e) => update("emergency_contact_name", e.target.value)} />
            <Input label="Contact Phone" value={form.emergency_contact_phone} onChange={(e) => update("emergency_contact_phone", e.target.value)} />
            <Input label="Relationship" value={form.emergency_contact_relationship} onChange={(e) => update("emergency_contact_relationship", e.target.value)} placeholder="Spouse, Parent, Sibling..." />
          </div>
        </div>
      )}

      {/* ── Footer Actions ── */}
      <div className="flex items-center justify-end gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getNewsletterSettings, updateNewsletterSettings } from "@/lib/api/newsletter";
import type { NewsletterSettings } from "@/types/api";

const EMPTY_SETTINGS: Omit<NewsletterSettings, "updated_at" | "updated_by_id"> = {
  site_name: "",
  site_url: "",
  contact_email: "",
  contact_phone: "",
  organization_address: "",
  facebook_url: "",
  instagram_url: "",
  x_url: "",
  linkedin_url: "",
  youtube_url: "",
  donate_url: "",
  volunteer_url: "",
  privacy_policy_url: "",
  unsubscribe_url: "",
};

export default function NewsletterSettingsPage() {
  const [form, setForm] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const settings = await getNewsletterSettings();
        setForm({
          site_name: settings.site_name,
          site_url: settings.site_url,
          contact_email: settings.contact_email,
          contact_phone: settings.contact_phone,
          organization_address: settings.organization_address,
          facebook_url: settings.facebook_url,
          instagram_url: settings.instagram_url,
          x_url: settings.x_url,
          linkedin_url: settings.linkedin_url,
          youtube_url: settings.youtube_url,
          donate_url: settings.donate_url,
          volunteer_url: settings.volunteer_url,
          privacy_policy_url: settings.privacy_policy_url,
          unsubscribe_url: settings.unsubscribe_url,
        });
        setUpdatedAt(settings.updated_at);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const setField = (key: keyof typeof form, value: string) => {
    setMessage("");
    setError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const updated = await updateNewsletterSettings(form);
      setUpdatedAt(updated.updated_at);
      setMessage("Newsletter settings saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-56">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            These values are used as global email context defaults.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          Back to Settings
        </Link>
      </div>

      {updatedAt && (
        <p className="text-xs text-gray-500">Last updated: {new Date(updatedAt).toLocaleString()}</p>
      )}

      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Organization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Site Name" value={form.site_name} onChange={(e) => setField("site_name", e.target.value)} />
          <Input label="Site URL" value={form.site_url} onChange={(e) => setField("site_url", e.target.value)} />
          <Input label="Contact Email" value={form.contact_email} onChange={(e) => setField("contact_email", e.target.value)} />
          <Input label="Contact Phone" value={form.contact_phone} onChange={(e) => setField("contact_phone", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Organization Address</label>
          <textarea
            value={form.organization_address}
            onChange={(e) => setField("organization_address", e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Social Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Facebook URL" value={form.facebook_url} onChange={(e) => setField("facebook_url", e.target.value)} />
          <Input label="Instagram URL" value={form.instagram_url} onChange={(e) => setField("instagram_url", e.target.value)} />
          <Input label="X URL" value={form.x_url} onChange={(e) => setField("x_url", e.target.value)} />
          <Input label="LinkedIn URL" value={form.linkedin_url} onChange={(e) => setField("linkedin_url", e.target.value)} />
          <Input label="YouTube URL" value={form.youtube_url} onChange={(e) => setField("youtube_url", e.target.value)} />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Website Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Donate URL" value={form.donate_url} onChange={(e) => setField("donate_url", e.target.value)} />
          <Input label="Volunteer URL" value={form.volunteer_url} onChange={(e) => setField("volunteer_url", e.target.value)} />
          <Input label="Privacy Policy URL" value={form.privacy_policy_url} onChange={(e) => setField("privacy_policy_url", e.target.value)} />
          <Input
            label="Unsubscribe URL Pattern"
            value={form.unsubscribe_url}
            onChange={(e) => setField("unsubscribe_url", e.target.value)}
            placeholder="https://example.com/newsletter/unsubscribe/{token}"
          />
        </div>
        <p className="text-xs text-gray-500">
          Use <span className="font-mono">{"{token}"}</span> in unsubscribe URL so each recipient gets a unique link.
        </p>
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => window.location.reload()} disabled={saving}>Reset</Button>
        <Button onClick={onSave} loading={saving}>Save Settings</Button>
      </div>
    </div>
  );
}

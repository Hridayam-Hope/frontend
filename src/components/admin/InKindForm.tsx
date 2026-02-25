"use client";

import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export interface InKindFormData {
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
  estimated_value: number | "";
  campaign_id: number | "";
  delivery_method: string;
  preferred_pickup_date: string;
  preferred_pickup_time: string;
  message: string;
  is_anonymous: boolean;
}

const ITEM_CATEGORIES = [
  "Books", "Clothes", "Electronics", "Furniture", "Food & Groceries",
  "Medical Supplies", "Stationery", "Sports Equipment", "Toys", "Blankets & Bedding",
  "Kitchen Utensils", "Hygiene Products", "Other",
];

const ITEM_CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

const DELIVERY_METHODS = [
  { value: "self_delivery", label: "Self Delivery" },
  { value: "pickup", label: "We Pick Up" },
  { value: "courier", label: "Courier" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

interface Campaign {
  id: number;
  title: string;
}

interface InKindFormProps {
  campaigns?: Campaign[];
  onSubmit: (data: InKindFormData) => Promise<void>;
  onCancel: () => void;
}

export default function InKindForm({ campaigns = [], onSubmit, onCancel }: InKindFormProps) {
  const [form, setForm] = useState<InKindFormData>({
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    donor_address: "",
    donor_city: "",
    donor_state: "",
    donor_pincode: "",
    item_name: "",
    item_category: "",
    item_description: "",
    item_condition: "good",
    quantity: 1,
    estimated_value: "",
    campaign_id: "",
    delivery_method: "self_delivery",
    preferred_pickup_date: "",
    preferred_pickup_time: "",
    message: "",
    is_anonymous: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [activeSection, setActiveSection] = useState<"donor" | "item" | "delivery">("donor");

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.donor_name.trim()) errs.donor_name = "Donor name is required";
    if (!form.donor_email.trim()) errs.donor_email = "Email is required";
    if (!form.donor_phone.trim()) errs.donor_phone = "Phone is required";
    if (!form.donor_address.trim()) errs.donor_address = "Address is required";
    if (!form.donor_city.trim()) errs.donor_city = "City is required";
    if (!form.donor_state.trim()) errs.donor_state = "State is required";
    if (!form.donor_pincode.trim()) errs.donor_pincode = "Pincode is required";
    if (!form.item_name.trim()) errs.item_name = "Item name is required";
    if (!form.item_category.trim()) errs.item_category = "Category is required";
    if (!form.item_description.trim()) errs.item_description = "Description is required";
    if (form.quantity < 1) errs.quantity = "Quantity must be at least 1";
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Switch to the section with the first error
      const donorFields = ["donor_name", "donor_email", "donor_phone", "donor_address", "donor_city", "donor_state", "donor_pincode"];
      const itemFields = ["item_name", "item_category", "item_description", "quantity"];
      const firstErr = Object.keys(errs)[0];
      if (donorFields.includes(firstErr)) setActiveSection("donor");
      else if (itemFields.includes(firstErr)) setActiveSection("item");
      else setActiveSection("delivery");
    }
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

  const update = (field: keyof InKindFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const sections = [
    { id: "donor" as const, label: "Donor Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "item" as const, label: "Item Details", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { id: "delivery" as const, label: "Delivery & Notes", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
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

      {/* Donor Info */}
      {activeSection === "donor" && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name *" value={form.donor_name} onChange={(e) => update("donor_name", e.target.value)} error={errors.donor_name} placeholder="John Doe" />
                <Input label="Email *" type="email" value={form.donor_email} onChange={(e) => update("donor_email", e.target.value)} error={errors.donor_email} placeholder="john@example.com" />
              </div>
              <Input label="Phone *" value={form.donor_phone} onChange={(e) => update("donor_phone", e.target.value)} error={errors.donor_phone} placeholder="+91 9876543210" />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Address *</label>
                <textarea
                  value={form.donor_address}
                  onChange={(e) => update("donor_address", e.target.value)}
                  rows={2}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${errors.donor_address ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Street address, apartment, etc."
                />
                {errors.donor_address && <p className="text-sm text-red-600">{errors.donor_address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="City *" value={form.donor_city} onChange={(e) => update("donor_city", e.target.value)} error={errors.donor_city} placeholder="Mumbai" />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">State *</label>
                  <select
                    value={form.donor_state}
                    onChange={(e) => update("donor_state", e.target.value)}
                    className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${errors.donor_state ? "border-red-400" : "border-gray-300"}`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.donor_state && <p className="text-sm text-red-600">{errors.donor_state}</p>}
                </div>
                <Input label="Pincode *" value={form.donor_pincode} onChange={(e) => update("donor_pincode", e.target.value)} error={errors.donor_pincode} placeholder="400001" />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Item Details */}
      {activeSection === "item" && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h2>
            <div className="space-y-4">
              <Input label="Item Name *" value={form.item_name} onChange={(e) => update("item_name", e.target.value)} error={errors.item_name} placeholder="e.g., School Textbooks, Winter Blankets" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Item Category *</label>
                  <select
                    value={form.item_category}
                    onChange={(e) => update("item_category", e.target.value)}
                    className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${errors.item_category ? "border-red-400" : "border-gray-300"}`}
                  >
                    <option value="">Select category</option>
                    {ITEM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.item_category && <p className="text-sm text-red-600">{errors.item_category}</p>}
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Condition</label>
                  <select
                    value={form.item_condition}
                    onChange={(e) => update("item_condition", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  >
                    {ITEM_CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={form.item_description}
                  onChange={(e) => update("item_description", e.target.value)}
                  rows={3}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${errors.item_description ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Describe the items being donated..."
                />
                {errors.item_description && <p className="text-sm text-red-600">{errors.item_description}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Quantity *" type="number" value={form.quantity} onChange={(e) => update("quantity", Number(e.target.value))} error={errors.quantity} />
                <Input label="Estimated Value (₹)" type="number" value={form.estimated_value} onChange={(e) => update("estimated_value", e.target.value ? Number(e.target.value) : "")} placeholder="Optional" />
              </div>
            </div>
          </section>

          {campaigns.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Link to Campaign</h2>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Campaign (optional)</label>
                <select
                  value={form.campaign_id}
                  onChange={(e) => update("campaign_id", e.target.value ? Number(e.target.value) : "")}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                >
                  <option value="">No specific campaign</option>
                  {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Link this donation to an active campaign if applicable</p>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Delivery & Notes */}
      {activeSection === "delivery" && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Method</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {DELIVERY_METHODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => update("delivery_method", m.value)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      form.delivery_method === m.value
                        ? "border-brand-400 bg-brand-50 text-brand-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <span className="text-2xl block mb-1">
                      {m.value === "self_delivery" ? "🚗" : m.value === "pickup" ? "🚛" : "📦"}
                    </span>
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>

              {form.delivery_method === "pickup" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Input label="Preferred Pickup Date" type="date" value={form.preferred_pickup_date} onChange={(e) => update("preferred_pickup_date", e.target.value)} />
                  <Input label="Preferred Time Slot" value={form.preferred_pickup_time} onChange={(e) => update("preferred_pickup_time", e.target.value)} placeholder="e.g., 10 AM - 2 PM" />
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  placeholder="Any message from the donor..."
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_anonymous}
                  onChange={(e) => update("is_anonymous", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                />
                <span className="text-sm text-gray-700">Anonymous donation (hide donor name publicly)</span>
              </label>
            </div>
          </section>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs text-gray-400">Donation will be created with status &quot;Pending&quot;</p>
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={submitting}>Record Donation</Button>
        </div>
      </div>
    </form>
  );
}

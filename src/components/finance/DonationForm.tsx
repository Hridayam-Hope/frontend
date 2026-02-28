"use client";

import { useEffect, useState } from "react";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface DonationFormData {
  volunteer_id: number;
  amount: string;
  date: string;
  payment_method: string;
  transaction_reference: string;
  notes: string;
}

interface DonationFormProps {
  initialData?: {
    volunteer_id?: number;
    volunteer_name?: string;
    amount?: number;
    date?: string;
    payment_method?: string;
    transaction_reference?: string;
    notes?: string;
  };
  onSubmit: (data: {
    volunteer_id: number;
    amount: number;
    date: string;
    payment_method: string;
    transaction_reference?: string;
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

export default function DonationForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Donation",
}: DonationFormProps) {
  const { volunteers, volLoading, fetchVolunteers } = useVolunteersStore();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState(initialData?.volunteer_name || "");

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<DonationFormData>({
    volunteer_id: initialData?.volunteer_id || 0,
    amount: initialData?.amount?.toString() || "",
    date: initialData?.date || today,
    payment_method: initialData?.payment_method || "upi",
    transaction_reference: initialData?.transaction_reference || "",
    notes: initialData?.notes || "",
  });

  useEffect(() => {
    fetchVolunteers({ page_size: 100, is_active: true });
  }, [fetchVolunteers]);

  const filteredVolunteers = volunteers.filter((v) =>
    v.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.volunteer_id) errs.volunteer_id = "Select a volunteer";
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = "Amount must be greater than 0";
    if (!form.date) errs.date = "Date is required";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit({
        volunteer_id: form.volunteer_id,
        amount: parseFloat(form.amount),
        date: form.date,
        payment_method: form.payment_method,
        transaction_reference: form.transaction_reference || undefined,
        notes: form.notes || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedVolunteer = volunteers.find((v) => v.id === form.volunteer_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Volunteer Select */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Volunteer</label>
        {selectedVolunteer && !initialData?.volunteer_id ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium">
              {selectedVolunteer.full_name}
              <button
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, volunteer_id: 0 }));
                  setSearchQuery("");
                }}
                className="text-brand-400 hover:text-brand-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        ) : initialData?.volunteer_id ? (
          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">
            {initialData.volunteer_name || `Volunteer #${initialData.volunteer_id}`}
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search volunteers by name or email..."
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 ${
                errors.volunteer_id ? "border-red-400" : "border-gray-300"
              }`}
            />
            {searchQuery && !form.volunteer_id && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {volLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
                ) : filteredVolunteers.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">No volunteers found</div>
                ) : (
                  filteredVolunteers.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, volunteer_id: v.id }));
                        setSearchQuery(v.full_name);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">{v.full_name}</span>
                      <span className="text-gray-400 text-xs">{v.role}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {errors.volunteer_id && <p className="text-sm text-red-600">{errors.volunteer_id}</p>}
      </div>

      {/* Amount + Date row */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount (₹)"
          type="number"
          min="1"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          error={errors.amount}
          placeholder="e.g. 500"
        />
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          error={errors.date}
          max={today}
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <div className="flex gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, payment_method: m.value }))}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                form.payment_method === m.value
                  ? "bg-brand-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Reference */}
      <Input
        label="Transaction Reference"
        value={form.transaction_reference}
        onChange={(e) => setForm((f) => ({ ...f, transaction_reference: e.target.value }))}
        placeholder="UPI ref, bank txn ID, etc."
      />

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={2}
          placeholder="Optional admin notes..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const CATEGORIES = [
  { value: "program", label: "Program & Activities" },
  { value: "salaries", label: "Salaries & Honorarium" },
  { value: "office", label: "Office & Admin" },
  { value: "travel", label: "Travel & Conveyance" },
  { value: "food", label: "Food & Refreshments" },
  { value: "medical", label: "Medical & Healthcare" },
  { value: "education", label: "Education & Stationery" },
  { value: "infrastructure", label: "Infrastructure & Equipment" },
  { value: "marketing", label: "Marketing & Outreach" },
  { value: "utilities", label: "Utilities" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

export const PAYMENT_METHODS = [
  { value: "upi", label: "UPI" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

interface FormData {
  title: string;
  description: string;
  amount: string;
  date: string;
  category: string;
  payment_method: string;
  paid_to: string;
  reference_number: string;
  receipt_url: string;
  is_recurring: boolean;
  recurrence_note: string;
  notes: string;
}

interface ExpenseFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: {
    title: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    payment_method: string;
    paid_to: string;
    reference_number: string;
    receipt_url: string;
    is_recurring: boolean;
    recurrence_note: string;
    notes: string;
  }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const [form, setForm] = useState<FormData>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    amount: initialData?.amount ?? "",
    date: initialData?.date ?? new Date().toISOString().split("T")[0],
    category: initialData?.category ?? "miscellaneous",
    payment_method: initialData?.payment_method ?? "upi",
    paid_to: initialData?.paid_to ?? "",
    reference_number: initialData?.reference_number ?? "",
    receipt_url: initialData?.receipt_url ?? "",
    is_recurring: initialData?.is_recurring ?? false,
    recurrence_note: initialData?.recurrence_note ?? "",
    notes: initialData?.notes ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = "Enter a valid amount";
    if (!form.date) errs.date = "Date is required";
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
        description: form.description.trim(),
        amount: Number(form.amount),
        date: form.date,
        category: form.category,
        payment_method: form.payment_method,
        paid_to: form.paid_to.trim(),
        reference_number: form.reference_number.trim(),
        receipt_url: form.receipt_url.trim(),
        is_recurring: form.is_recurring,
        recurrence_note: form.recurrence_note.trim(),
        notes: form.notes.trim(),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Office rent - March"
            error={errors.title}
          />
        </div>

        <Input
          label="Amount (₹)"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(e) => set("amount", e.target.value)}
          placeholder="0.00"
          error={errors.amount}
        />

        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
          error={errors.date}
        />

        {/* Category */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            value={form.payment_method}
            onChange={(e) => set("payment_method", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <Input
          label="Paid To (Vendor / Payee)"
          value={form.paid_to}
          onChange={(e) => set("paid_to", e.target.value)}
          placeholder="e.g. ABC Stationery"
        />

        <Input
          label="Reference Number"
          value={form.reference_number}
          onChange={(e) => set("reference_number", e.target.value)}
          placeholder="Invoice / bill / txn ID"
        />

        <div className="sm:col-span-2">
          <Input
            label="Receipt URL"
            value={form.receipt_url}
            onChange={(e) => set("receipt_url", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Optional details..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={2}
            placeholder="Internal notes..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          />
        </div>

        {/* Recurring */}
        <div className="sm:col-span-2 flex items-center gap-3">
          <input
            id="is_recurring"
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) => set("is_recurring", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
          />
          <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700">
            Recurring expense
          </label>
        </div>

        {form.is_recurring && (
          <div className="sm:col-span-2">
            <Input
              label="Recurrence Note"
              value={form.recurrence_note}
              onChange={(e) => set("recurrence_note", e.target.value)}
              placeholder="e.g. Monthly office rent"
            />
          </div>
        )}
      </div>

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

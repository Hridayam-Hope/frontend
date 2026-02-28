"use client";

import { useEffect, useState } from "react";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import Button from "@/components/ui/Button";

interface BulkEntry {
  volunteer_id: number;
  volunteer_name: string;
  amount: string;
  include: boolean;
}

interface BulkDonationFormProps {
  onSubmit: (
    donations: {
      volunteer_id: number;
      amount: number;
      date: string;
      payment_method: string;
    }[]
  ) => Promise<void>;
  onCancel: () => void;
}

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

export default function BulkDonationForm({ onSubmit, onCancel }: BulkDonationFormProps) {
  const { volunteers, volLoading, fetchVolunteers } = useVolunteersStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [entries, setEntries] = useState<BulkEntry[]>([]);

  useEffect(() => {
    fetchVolunteers({ page_size: 200, is_active: true });
  }, [fetchVolunteers]);

  // Populate entries when volunteers load
  useEffect(() => {
    if (volunteers.length > 0 && entries.length === 0) {
      setEntries(
        volunteers.map((v) => ({
          volunteer_id: v.id,
          volunteer_name: v.full_name,
          amount: "",
          include: false,
        }))
      );
    }
  }, [volunteers, entries.length]);

  function handleAmountChange(idx: number, value: string) {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === idx
          ? { ...e, amount: value, include: value !== "" && parseFloat(value) > 0 }
          : e
      )
    );
  }

  function handleToggle(idx: number) {
    setEntries((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, include: !e.include } : e))
    );
  }

  const included = entries.filter((e) => e.include && e.amount && parseFloat(e.amount) > 0);
  const totalAmount = included.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (included.length === 0) {
      setError("Enter at least one donation amount");
      return;
    }
    if (!date) {
      setError("Date is required");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(
        included.map((entry) => ({
          volunteer_id: entry.volunteer_id,
          amount: parseFloat(entry.amount),
          date,
          payment_method: paymentMethod,
        }))
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date + Payment Method */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setPaymentMethod(m.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  paymentMethod === m.value
                    ? "bg-brand-500 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteer table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase w-10">&nbsp;</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Volunteer</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase w-40">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {volLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                    Loading volunteers...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                    No active volunteers found
                  </td>
                </tr>
              ) : (
                entries.map((entry, idx) => (
                  <tr key={entry.volunteer_id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={entry.include}
                        onChange={() => handleToggle(idx)}
                        className="rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-sm font-medium text-gray-900">{entry.volunteer_name}</span>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={entry.amount}
                        onChange={(e) => handleAmountChange(idx, e.target.value)}
                        placeholder="0"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{included.length}</span> volunteer{included.length !== 1 ? "s" : ""} selected
        </div>
        <div className="text-sm font-semibold text-gray-900">
          Total: ₹{totalAmount.toLocaleString()}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} disabled={included.length === 0}>
          Add {included.length} Donation{included.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFinanceStore } from "@/lib/stores/finance";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import Button from "@/components/ui/Button";
import DonationForm from "@/components/finance/DonationForm";

const PAYMENT_LABELS: Record<string, string> = {
  upi: "UPI",
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  other: "Other",
};

export default function FinanceDetailSidebar() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const { donationCache, detailLoading, fetchDonation, updateDonation, deleteDonation } =
    useFinanceStore();

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [visible, setVisible] = useState(false);

  const donationId = parseInt(id, 10);
  const donation = donationCache[donationId];

  // Fetch data & trigger slide-in
  useEffect(() => {
    if (donationId) fetchDonation(donationId);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [donationId, fetchDonation]);

  // Reset editing state when switching between donations
  useEffect(() => {
    setEditing(false);
    setShowDeleteConfirm(false);
  }, [donationId]);

  const closeSidebar = useCallback(() => {
    setVisible(false);
    setTimeout(() => router.push("/admin/finance"), 200);
  }, [router]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !showDeleteConfirm) closeSidebar();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSidebar, showDeleteConfirm]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDonation(donationId);
      showToast("success", "Donation deleted");
      setVisible(false);
      setTimeout(() => router.push("/admin/finance"), 200);
    } catch (err) {
      handleError(err, "Failed to delete donation");
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-200 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div className="min-w-0">
              {donation ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    Donation #{donation.id}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    ₹{donation.amount.toLocaleString()} from {donation.volunteer_name}
                  </p>
                </>
              ) : (
                <h2 className="text-lg font-bold text-gray-900">Loading...</h2>
              )}
            </div>
            <button
              onClick={closeSidebar}
              className="ml-4 shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {detailLoading && !donation ? (
              <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : donation ? (
              <div>
                {/* Actions */}
                <div className="flex gap-2 px-6 py-3 border-b border-gray-50 shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>
                    {editing ? "Cancel Edit" : "Edit"}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                    Delete
                  </Button>
                </div>

                {editing ? (
                  <div className="p-6">
                    <DonationForm
                      initialData={{
                        volunteer_id: donation.volunteer_id,
                        volunteer_name: donation.volunteer_name,
                        amount: donation.amount,
                        date: donation.date,
                        payment_method: donation.payment_method,
                        transaction_reference: donation.transaction_reference,
                        notes: donation.notes,
                      }}
                      submitLabel="Save Changes"
                      onSubmit={async (data) => {
                        try {
                          const { volunteer_id: _vid, ...updateData } = data;
                          await updateDonation(donationId, updateData);
                          showToast("success", "Donation updated");
                          setEditing(false);
                        } catch (err) {
                          handleError(err, "Failed to update donation");
                        }
                      }}
                      onCancel={() => setEditing(false)}
                    />
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {/* Donation Info */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Donation Info
                      </h3>
                      <div className="space-y-3">
                        <DetailRow
                          label="Amount"
                          value={`₹${donation.amount.toLocaleString()}`}
                          highlight
                        />
                        <DetailRow
                          label="Date"
                          value={new Date(donation.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        />
                        <DetailRow
                          label="Payment Method"
                          value={
                            PAYMENT_LABELS[donation.payment_method] || donation.payment_method
                          }
                        />
                        <DetailRow
                          label="Transaction Ref"
                          value={donation.transaction_reference || "—"}
                        />
                        <DetailRow label="Notes" value={donation.notes || "—"} />
                      </div>
                    </div>

                    {/* Volunteer Info */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Volunteer Info
                      </h3>
                      <div className="space-y-3">
                        <DetailRow label="Name" value={donation.volunteer_name} />
                        <DetailRow
                          label="Role"
                          value={
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-brand-50 text-brand-700 capitalize">
                              {donation.volunteer_role.replace("_", " ")}
                            </span>
                          }
                        />
                      </div>
                    </div>

                    {/* Record Info */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Record Info
                      </h3>
                      <div className="space-y-3">
                        <DetailRow label="Recorded By" value={donation.recorded_by_email} />
                        <DetailRow
                          label="Created"
                          value={new Date(donation.created_at).toLocaleString("en-IN")}
                        />
                        <DetailRow
                          label="Last Updated"
                          value={new Date(donation.updated_at).toLocaleString("en-IN")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Delete confirmation overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Delete Donation</h3>
              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to delete the ₹{donation?.amount.toLocaleString()} donation
                from <strong>{donation?.volunteer_name}</strong>? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="danger" loading={deleting} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm text-right ml-4 ${
          highlight ? "text-lg font-bold text-gray-900" : "font-medium text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

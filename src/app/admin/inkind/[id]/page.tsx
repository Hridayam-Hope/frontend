"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInKindStore } from "@/lib/stores/inkind";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { InKindDonationDetail } from "@/types/api";

const STATUS_FLOW: Record<string, string[]> = {
  pending: ["verified", "rejected"],
  verified: ["in_transit"],
  in_transit: ["received"],
  received: ["donated"],
};

export default function InKindDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetchDonation, updateStatus, issueCertificate, detailLoading, donationCache } = useInKindStore();
  const [donation, setDonation] = useState<InKindDonationDetail | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      const numId = Number(id);
      if (donationCache[numId]) setDonation(donationCache[numId]);
      fetchDonation(numId).then(setDonation).catch(() => {});
    }
  }, [id, fetchDonation, donationCache]);

  if (detailLoading && !donation) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!donation) return <p className="p-6 text-gray-500">Donation not found</p>;

  const nextStatuses = STATUS_FLOW[donation.status] || [];

  const handleStatusUpdate = async (status: string) => {
    setActionLoading(true);
    try {
      await updateStatus(donation.id, status);
      const updated = await fetchDonation(donation.id, true);
      setDonation(updated);
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssueCert = async () => {
    const msg = await issueCertificate(donation.id);
    setMessage(msg);
    const updated = await fetchDonation(donation.id, true);
    setDonation(updated);
  };

  // Status flow visualization
  const allStatuses = ["pending", "verified", "in_transit", "received", "donated"];
  const currentIdx = allStatuses.indexOf(donation.status);

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to In-Kind Donations
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{donation.item_name}</h1>
            <p className="text-gray-500 mt-1">From {donation.donor_name} ({donation.donor_email})</p>
          </div>
          <StatusBadge status={donation.status} />
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 mb-6">
            {message}
          </div>
        )}

        {/* Status flow */}
        {donation.status !== "rejected" && (
          <div className="flex items-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
            {allStatuses.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentIdx
                      ? "bg-gradient-to-r from-brand-400 to-accent-400 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs ${i <= currentIdx ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                {i < allStatuses.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < currentIdx ? "bg-brand-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {nextStatuses.length > 0 && (
          <div className="flex gap-2 mb-6">
            {nextStatuses.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={s === "rejected" ? "danger" : "primary"}
                loading={actionLoading}
                onClick={() => handleStatusUpdate(s)}
              >
                Mark as {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </Button>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Category", value: donation.item_category },
            { label: "Condition", value: donation.item_condition },
            { label: "Quantity", value: donation.quantity },
            { label: "Est. Value", value: `₹${donation.estimated_value.toLocaleString()}` },
            { label: "Delivery", value: donation.delivery_method },
            { label: "Campaign", value: donation.campaign_title || "General" },
            { label: "Tracking #", value: donation.tracking_number || "—" },
            { label: "Certificate", value: donation.tax_certificate_number || "—" },
            { label: "Phone", value: donation.donor_phone },
            { label: "City", value: donation.donor_city },
            { label: "State", value: donation.donor_state },
            { label: "Created", value: new Date(donation.created_at).toLocaleString() },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {donation.item_description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Item Description</h3>
            <p className="text-sm text-gray-600">{donation.item_description}</p>
          </div>
        )}

        {donation.status === "donated" && !donation.tax_certificate_number && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Button onClick={handleIssueCert}>Issue 80G Tax Certificate</Button>
          </div>
        )}
      </div>
    </div>
  );
}

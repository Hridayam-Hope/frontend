"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDonationsStore } from "@/lib/stores/donations";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { DonationDetail } from "@/types/api";

export default function DonationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetchDonation, issueCertificate, detailLoading, donationCache } = useDonationsStore();
  const [donation, setDonation] = useState<DonationDetail | null>(null);
  const [certMessage, setCertMessage] = useState("");

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

  const handleIssueCert = async () => {
    const msg = await issueCertificate(donation.id);
    setCertMessage(msg);
    const updated = await fetchDonation(donation.id, true);
    setDonation(updated);
  };

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Donations
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donation #{donation.id}</h1>
            <p className="text-gray-500 mt-1">{donation.donor_name} ({donation.donor_email})</p>
          </div>
          <StatusBadge status={donation.status} />
        </div>

        {certMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 mb-6">
            {certMessage}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Amount", value: `₹${donation.amount.toLocaleString()}` },
            { label: "Currency", value: donation.currency },
            { label: "Type", value: donation.donation_type },
            { label: "Payment Method", value: donation.payment_method },
            { label: "Campaign", value: donation.campaign_title || "General" },
            { label: "Anonymous", value: donation.is_anonymous ? "Yes" : "No" },
            { label: "Receipt Sent", value: donation.receipt_sent ? "Yes" : "No" },
            { label: "Tax Certificate", value: donation.tax_certificate_number || "—" },
            { label: "Phone", value: donation.donor_phone || "—" },
            { label: "Created", value: new Date(donation.created_at).toLocaleString() },
            { label: "Completed", value: donation.completed_at ? new Date(donation.completed_at).toLocaleString() : "—" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {donation.message && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Donor Message</h3>
            <p className="text-sm text-gray-600">{donation.message}</p>
          </div>
        )}

        {donation.status === "completed" && !donation.tax_certificate_number && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Button onClick={handleIssueCert}>Issue 80G Tax Certificate</Button>
          </div>
        )}
      </div>
    </div>
  );
}

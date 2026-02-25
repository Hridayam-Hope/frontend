"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInKindStore } from "@/lib/stores/inkind";
import { useCampaignsStore } from "@/lib/stores/campaigns";
import InKindForm, { type InKindFormData } from "@/components/admin/InKindForm";

export default function NewInKindPage() {
  const router = useRouter();
  const { createDonation } = useInKindStore();
  const { campaigns, fetchCampaigns } = useCampaignsStore();

  useEffect(() => {
    fetchCampaigns({ page: 1, page_size: 100, status: "active" });
  }, [fetchCampaigns]);

  const handleSubmit = async (data: InKindFormData) => {
    const payload: Record<string, unknown> = { ...data };
    // Clean empty optionals
    if (!payload.estimated_value) delete payload.estimated_value;
    if (!payload.campaign_id) delete payload.campaign_id;
    if (!payload.preferred_pickup_date) delete payload.preferred_pickup_date;
    if (!payload.preferred_pickup_time) delete payload.preferred_pickup_time;
    if (!payload.message) delete payload.message;

    const donation = await createDonation(payload);
    router.push(`/admin/inkind/${donation.id}`);
  };

  const campaignOptions = campaigns.map((c) => ({ id: c.id, title: c.title }));

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to In-Kind Donations
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Record In-Kind Donation</h1>
      <InKindForm
        campaigns={campaignOptions}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}

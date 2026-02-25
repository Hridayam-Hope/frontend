"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCampaignsStore } from "@/lib/stores/campaigns";
import CampaignForm, { type CampaignFormData } from "@/components/admin/CampaignForm";

export default function NewCampaignPage() {
  const router = useRouter();
  const { createCampaign, fetchCategories, categories } = useCampaignsStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (data: CampaignFormData) => {
    const payload: Record<string, unknown> = { ...data };
    // Clean up empty optional fields
    if (!payload.end_date) delete payload.end_date;
    if (!payload.video_url) delete payload.video_url;
    if (!payload.featured_image) delete payload.featured_image;
    if (!payload.og_image) delete payload.og_image;
    if (!payload.meta_title) delete payload.meta_title;
    if (!payload.meta_description) delete payload.meta_description;
    if (!payload.beneficiary_type) delete payload.beneficiary_type;
    if (!payload.location) delete payload.location;
    if (payload.beneficiary_count === 0) delete payload.beneficiary_count;

    const campaign = await createCampaign(payload);
    router.push(`/admin/campaigns/${campaign.id}`);
  };

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Campaigns
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h1>
      <CampaignForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}

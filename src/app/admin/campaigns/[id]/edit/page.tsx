"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCampaignsStore } from "@/lib/stores/campaigns";
import CampaignForm, { type CampaignFormData } from "@/components/admin/CampaignForm";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { fetchCampaign, updateCampaign, fetchCategories, categories, detailLoading, campaignCache } =
    useCampaignsStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchCampaign(id, true).then(() => setLoaded(true));
  }, [id, fetchCampaign, fetchCategories]);

  const campaign = campaignCache[id];

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

    await updateCampaign(id, payload);
    router.push(`/admin/campaigns/${id}`);
  };

  if (detailLoading || !loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-brand-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Campaign not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Campaign</h1>
      <CampaignForm
        initialData={campaign as unknown as Partial<CampaignFormData>}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isEdit
      />
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCampaignsStore } from "@/lib/stores/campaigns";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { CampaignDetail, CampaignMedia, CampaignUpdate } from "@/types/api";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const router = useRouter();
  const {
    fetchCampaign, deleteCampaign, updateStatus, detailLoading, campaignCache,
    fetchMedia, uploadMedia, deleteMedia, media, mediaLoading,
    fetchUpdates, createUpdate, updates, updatesLoading,
  } = useCampaignsStore();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "media" | "updates">("overview");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<{ file: File; preview: string } | null>(null);

  useEffect(() => {
    if (numId) {
      if (campaignCache[numId]) setCampaign(campaignCache[numId]);
      fetchCampaign(numId).then(setCampaign).catch(() => {});
    }
  }, [numId, fetchCampaign]);

  useEffect(() => {
    if (numId && activeTab === "media") fetchMedia(numId);
    if (numId && activeTab === "updates") fetchUpdates(numId);
  }, [numId, activeTab, fetchMedia, fetchUpdates]);

  if (detailLoading && !campaign) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!campaign) return <p className="p-6 text-gray-500">Campaign not found</p>;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      await deleteCampaign(campaign.id);
      router.push("/admin/campaigns");
    }
  };

  const handleStatusChange = async (status: string) => {
    await updateStatus(campaign.id, status);
    const updated = await fetchCampaign(campaign.id, true);
    setCampaign(updated);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingMedia({ file, preview: url });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMediaConfirm = async () => {
    if (!pendingMedia) return;
    setUploading(true);
    try {
      await uploadMedia(numId, pendingMedia.file);
    } finally {
      URL.revokeObjectURL(pendingMedia.preview);
      setPendingMedia(null);
      setUploading(false);
    }
  };

  const handleMediaCancel = () => {
    if (pendingMedia) URL.revokeObjectURL(pendingMedia.preview);
    setPendingMedia(null);
  };

  const handleMediaDelete = async (mediaId: number) => {
    if (confirm("Delete this media?")) {
      await deleteMedia(mediaId, numId);
    }
  };

  const handleCreateUpdate = async () => {
    if (!updateTitle.trim() || !updateContent.trim()) return;
    setUpdateSubmitting(true);
    try {
      await createUpdate(numId, { title: updateTitle, content: updateContent });
      setUpdateTitle("");
      setUpdateContent("");
      setShowUpdateForm(false);
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const isMoney = campaign.target_unit === "money";
  const currencySymbol = isMoney
    ? campaign.target_currency === "USD" ? "$" : campaign.target_currency === "EUR" ? "€" : "₹"
    : "";
  const unitSuffix = !isMoney ? ` ${campaign.target_unit}` : "";
  const progressLabel = isMoney ? "Fundraising Progress" : `${campaign.target_unit.charAt(0).toUpperCase() + campaign.target_unit.slice(1)} Progress`;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "media" as const, label: "Media Gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "updates" as const, label: "Updates", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  ];

  return (
    <div>
      <button onClick={() => router.push("/admin/campaigns")} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Campaigns
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {campaign.featured_image && (
          <div className="relative h-48 bg-gray-100">
            <img src={campaign.featured_image} alt={campaign.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={campaign.status} />
                {campaign.is_featured && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                    ★ Featured
                  </span>
                )}
                <span className="text-xs text-gray-400 capitalize">{campaign.campaign_type}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
              <p className="text-gray-500 mt-1">{campaign.short_description}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
            </div>
          </div>

          {/* Status actions */}
          <div className="flex gap-2 mt-4">
            {campaign.status === "draft" && (
              <Button size="sm" onClick={() => handleStatusChange("active")}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Activate Campaign
              </Button>
            )}
            {campaign.status === "active" && (
              <>
                <Button size="sm" variant="secondary" onClick={() => handleStatusChange("paused")}>Pause</Button>
                <Button size="sm" onClick={() => handleStatusChange("completed")}>Mark Complete</Button>
              </>
            )}
            {campaign.status === "paused" && (
              <Button size="sm" onClick={() => handleStatusChange("active")}>Resume Campaign</Button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">{progressLabel}</span>
                {campaign.progress_percentage > 100 && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Goal Met!
                  </span>
                )}
              </div>
              <span className={`font-bold ${
                campaign.progress_percentage > 100 ? "text-emerald-600" : "text-gray-900"
              }`}>{campaign.progress_percentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  campaign.progress_percentage > 100
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : "bg-gradient-to-r from-brand-400 to-accent-400"
                }`}
                style={{ width: `${Math.min(campaign.progress_percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className={campaign.progress_percentage > 100 ? "text-emerald-600 font-medium" : "text-gray-500"}>
                {currencySymbol}{Number(campaign.achieved_value).toLocaleString()}{unitSuffix} raised
              </span>
              <span className="text-gray-500">{currencySymbol}{Number(campaign.target_value).toLocaleString()}{unitSuffix} goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Type", value: campaign.campaign_type, icon: "📋" },
              { label: "Location", value: campaign.location || "-", icon: "📍" },
              { label: "Beneficiaries", value: campaign.beneficiary_count || "-", icon: "👥" },
              { label: "Views", value: campaign.view_count, icon: "👁️" },
              { label: "Shares", value: campaign.share_count, icon: "🔗" },
              { label: "Priority", value: campaign.priority, icon: "⚡" },
              { label: "Visibility", value: campaign.visibility, icon: "🔒" },
              { label: "Days Left", value: campaign.days_remaining ?? "-", icon: "⏳" },
              { label: "Start Date", value: new Date(campaign.start_date).toLocaleDateString(), icon: "📅" },
              { label: "End Date", value: campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : "-", icon: "🏁" },
              { label: "Category", value: campaign.category_name || "-", icon: "🏷️" },
              { label: "Created", value: new Date(campaign.created_at).toLocaleDateString(), icon: "🕐" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  {/* <span>{item.icon}</span>  */}
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          {campaign.description && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{campaign.description}</p>
            </div>
          )}

          {campaign.video_url && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Video</h3>
              <a href={campaign.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                {campaign.video_url}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Media Gallery Tab */}
      {activeTab === "media" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Media Gallery</h3>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleMediaSelect}
                className="hidden"
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={uploading}
                disabled={!!pendingMedia}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Image
              </Button>
            </div>
          </div>

          {/* Pending preview */}
          {pendingMedia && (
            <div className="mb-6 rounded-xl border-2 border-brand-300 bg-brand-50/30 p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
              <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-gray-200" style={{ aspectRatio: "16/9" }}>
                <img src={pendingMedia.preview} alt="Preview" className="w-full h-full object-cover" />
                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-white border-t-transparent" />
                    <span className="text-sm text-white font-medium">Uploading…</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" onClick={handleMediaConfirm} loading={uploading}>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Upload
                </Button>
                <button type="button" onClick={handleMediaCancel} disabled={uploading} className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {mediaLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-gray-500 text-sm">No media uploaded yet</p>
              <p className="text-gray-400 text-xs mt-1">Upload images to build a gallery for this campaign</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="group relative rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                  {item.media_type === "image" ? (
                    <img src={item.file_url} alt={item.caption || ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleMediaDelete(item.id)}
                      className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white truncate">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Updates Tab */}
      {activeTab === "updates" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Updates</h3>
              {!showUpdateForm && (
                <Button size="sm" onClick={() => setShowUpdateForm(true)}>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Post Update
                </Button>
              )}
            </div>

            {showUpdateForm && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">New Update</h4>
                <div className="space-y-3">
                  <input
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    placeholder="Update title..."
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  />
                  <textarea
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    placeholder="Share progress, milestones, or updates..."
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateUpdate} loading={updateSubmitting}>
                      Publish Update
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => { setShowUpdateForm(false); setUpdateTitle(""); setUpdateContent(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {updatesLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : updates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                <p className="text-gray-500 text-sm">No updates posted yet</p>
                <p className="text-gray-400 text-xs mt-1">Post updates to keep donors informed about campaign progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((u) => (
                  <div key={u.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{u.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(u.created_at).toLocaleDateString("en-IN", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {u.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{u.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

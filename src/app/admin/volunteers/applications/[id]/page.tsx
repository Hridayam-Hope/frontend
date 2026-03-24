"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { VolunteerApplicationDetail } from "@/types/api";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const router = useRouter();
  const { fetchApplication, approveApplication, rejectApplication, appDetailLoading, applicationCache } = useVolunteersStore();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const [app, setApp] = useState<VolunteerApplicationDetail | null>(null);
  const [reviewModal, setReviewModal] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (numId) {
      if (applicationCache[numId]) setApp(applicationCache[numId]);
      fetchApplication(numId).then(setApp).catch(() => {});
    }
  }, [numId, fetchApplication]);

  const handleReview = async () => {
    if (!reviewModal) return;
    setReviewLoading(true);
    try {
      if (reviewModal === "approve") {
        await approveApplication(numId, reviewNotes);
        showToast("success", "Application approved successfully");
      } else {
        await rejectApplication(numId, reviewNotes);
        showToast("success", "Application rejected");
      }
      setReviewModal(null);
      setReviewNotes("");
      // Refresh
      const updated = await fetchApplication(numId, true);
      setApp(updated);
    } catch (error) {
      handleError(error, `Failed to ${reviewModal} application`);
    } finally {
      setReviewLoading(false);
    }
  };

  if (appDetailLoading && !app) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!app) return <p className="p-6 text-gray-500">Application not found</p>;

  return (
    <div>
      <button onClick={() => router.push("/admin/volunteers/applications")} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Applications
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-brand-400 to-accent-400 flex items-center justify-center text-white text-lg font-bold">
              {app.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{app.full_name}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  app.partner_type === "organisation" ? "bg-blue-100 text-blue-700" :
                  app.partner_type === "influencer" ? "bg-purple-100 text-purple-700" :
                  "bg-brand-100 text-brand-700"
                }`}>
                  {app.partner_type}
                </span>
              </div>
              <p className="text-sm text-gray-500">{app.email} · {app.phone}</p>
              <p className="text-xs text-gray-400 mt-0.5">Applied {new Date(app.application_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={app.status} />
            {app.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setReviewModal("approve")}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => setReviewModal("reject")}>Reject</Button>
              </div>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">Applied</p>
              <p className="text-xs text-gray-400">{new Date(app.application_date).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex-1 border-t border-dashed border-gray-200" />
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              app.status === "approved" ? "bg-green-100 text-green-600" :
              app.status === "rejected" ? "bg-red-100 text-red-600" :
              "bg-gray-100 text-gray-400"
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={app.status === "rejected" ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} /></svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">
                {app.status === "approved" ? "Approved" : app.status === "rejected" ? "Rejected" : "Pending Review"}
              </p>
              <p className="text-xs text-gray-400">
                {app.reviewed_at ? new Date(app.reviewed_at).toLocaleString() : "Awaiting admin review"}
              </p>
            </div>
          </div>
        </div>
        {app.review_notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-1">Review Notes</p>
            <p className="text-sm text-gray-700">{app.review_notes}</p>
          </div>
        )}
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal / Org Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {app.partner_type === "organisation" ? "Organisation Info" : 
             app.partner_type === "influencer" ? "Influencer Profile" : 
             "Personal Information"}
          </h3>
          <dl className="space-y-3">
            {[
              { label: "Name", value: app.full_name },
              { label: "Email", value: app.email },
              { label: "Phone", value: app.phone },
              ...(app.partner_type === "individual" ? [
                { label: "Date of Birth", value: app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString() : "-" }
              ] : []),
              ...(app.partner_type === "organisation" ? [
                { label: "Reg. Number", value: app.org_registration_number || "-" },
                { label: "Industry", value: app.industry || "-" },
                { label: "Org Type", value: app.org_type || "-" },
                { label: "Contact Person", value: app.contact_person_name || "-" },
                { label: "Website", value: app.website_url || "-" },
              ] : []),
              ...(app.partner_type === "influencer" ? [
                { label: "Platform", value: app.platform || "-" },
                { label: "Followers", value: app.follower_count?.toLocaleString() || "-" },
                { label: "Niche", value: app.niche || "-" },
                { label: "Social Handle", value: app.social_handle || "-" },
              ] : []),
            ].map((item) => (
              <div key={item.label} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
                <dt className="text-sm text-gray-500">{item.label}</dt>
                <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
          <dl className="space-y-3">
            {[
              { label: "Address", value: app.address },
              { label: "City", value: app.city },
              { label: "State", value: app.state },
              { label: "Postal Code", value: app.postal_code },
              { label: "Country", value: app.country },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <dt className="text-sm text-gray-500">{item.label}</dt>
                <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Availability & Skills - Only for Individuals */}
        {app.partner_type === "individual" ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability & Skills</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Availability</p>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${app.availability_weekdays ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-400"}`}>
                    Weekdays {app.availability_weekdays ? "✓" : "✗"}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${app.availability_weekends ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-400"}`}>
                    Weekends {app.availability_weekends ? "✓" : "✗"}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {app.hours_per_week}h/week
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {app.skills.length > 0 ? app.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-200">
                      {skill}
                    </span>
                  )) : <p className="text-sm text-gray-400">None listed</p>}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {app.languages.map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Interests</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.interests || "No specific interests listed"}</p>
          </div>
        )}

        {/* Emergency Contact & Interests */}
        {(app.partner_type === "individual" || app.emergency_contact_name) && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              Emergency Contact
            </h3>
            <dl className="space-y-3 mb-6">
              {[
                { label: "Name", value: app.emergency_contact_name || "-" },
                { label: "Phone", value: app.emergency_contact_phone || "-" },
                { label: "Relationship", value: app.emergency_contact_relationship || "-" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
            {app.partner_type === "individual" && (
              <>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Interests</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.interests || "None listed"}</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {reviewModal === "approve" ? "Approve Application" : "Reject Application"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {reviewModal === "approve"
                ? "This will create a volunteer profile for this applicant."
                : "The applicant will be notified of the rejection."}
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
              placeholder={reviewModal === "approve" ? "Optional notes..." : "Reason for rejection..."}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setReviewModal(null); setReviewNotes(""); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={reviewLoading}
              >
                Cancel
              </button>
              <Button
                onClick={handleReview}
                loading={reviewLoading}
                variant={reviewModal === "reject" ? "danger" : "primary"}
              >
                {reviewModal === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { useToast } from "@/lib/toast";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import VolunteerEditForm from "@/components/admin/VolunteerEditForm";
import type { VolunteerProfileDetail } from "@/types/api";

type Tab = "overview" | "activities" | "campaigns" | "certificates";

export default function VolunteerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const router = useRouter();
  const {
    fetchVolunteer, deactivateVolunteer, detailLoading, volunteerCache,
    activities, activitiesLoading, fetchActivities,
    certificates, certificatesLoading, fetchCertificates,
  } = useVolunteersStore();
  const [volunteer, setVolunteer] = useState<VolunteerProfileDetail | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (numId) {
      if (volunteerCache[numId]) setVolunteer(volunteerCache[numId]);
      fetchVolunteer(numId).then(setVolunteer).catch(() => {});
    }
  }, [numId, fetchVolunteer]);

  useEffect(() => {
    if (numId && activeTab === "activities") fetchActivities(numId);
    if (numId && activeTab === "certificates") fetchCertificates(numId);
  }, [numId, activeTab, fetchActivities, fetchCertificates]);

  if (detailLoading && !volunteer) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!volunteer) return <p className="p-6 text-gray-500">Volunteer not found</p>;

  const handleDeactivate = async () => {
    if (confirm("Are you sure you want to deactivate this volunteer?")) {
      await deactivateVolunteer(volunteer.id);
      router.push("/admin/volunteers");
    }
  };

  const initials = volunteer.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "activities", label: "Activities", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "campaigns", label: "Campaigns", icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm0 0h9" },
    { id: "certificates", label: "Certificates", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  ];

  const certIcon = (type: string) => {
    const map: Record<string, { label: string; color: string }> = {
      hours_10: { label: "10 Hours", color: "bg-blue-100 text-blue-700" },
      hours_50: { label: "50 Hours", color: "bg-purple-100 text-purple-700" },
      hours_100: { label: "100 Hours", color: "bg-amber-100 text-amber-700" },
      hours_500: { label: "500 Hours", color: "bg-red-100 text-red-700" },
      year_1: { label: "1 Year of Service", color: "bg-green-100 text-green-700" },
    };
    return map[type] || { label: type, color: "bg-gray-100 text-gray-700" };
  };

  return (
    <div>
      <button onClick={() => router.push("/admin/volunteers")} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Volunteers
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-brand-400 to-accent-400" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10">
            <div className="relative">
              {volunteer.profile_photo ? (
                <img src={volunteer.profile_photo} alt={volunteer.full_name} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm" />
              ) : (
                <div className="h-20 w-20 rounded-full border-4 border-white bg-gradient-to-r from-brand-400 to-accent-400 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                  {initials}
                </div>
              )}
              <div className={`absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-white ${volunteer.is_active ? "bg-green-400" : "bg-gray-300"}`} />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{volunteer.full_name}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  volunteer.partner_type === "organisation" ? "bg-blue-100 text-blue-700" :
                  volunteer.partner_type === "influencer" ? "bg-purple-100 text-purple-700" :
                  "bg-brand-100 text-brand-700"
                }`}>
                  {volunteer.partner_type}
                </span>
              </div>
              <p className="text-sm text-gray-500">{volunteer.email} · {volunteer.phone}</p>
            </div>
            <div className="flex gap-2 pb-1">
              <StatusBadge status={volunteer.is_active ? "active" : "inactive"} />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  setActiveTab("overview");
                }}
              >
                {isEditing ? "Cancel Edit" : "Edit"}
              </Button>
              {volunteer.is_active && !isEditing && (
                <Button size="sm" variant="danger" onClick={handleDeactivate}>Deactivate</Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total Contributions", value: `${volunteer.total_hours} units`, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Partner Since", value: new Date(volunteer.joined_date).toLocaleDateString(), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              ...(volunteer.partner_type === "individual" ? [
                { label: "Availability", value: [volunteer.individual_details?.availability_weekdays && "Weekdays", volunteer.individual_details?.availability_weekends && "Weekends"].filter(Boolean).join(", ") || "None", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                { label: "Commitment", value: `${volunteer.individual_details?.hours_per_week || 0}h/week`, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              ] : [
                { label: "City", value: volunteer.city, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                { label: "State", value: volunteer.state, icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L16 7m0 10V7" },
              ]),
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{stat.value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Tabs — disabled while editing */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-100 shadow-sm p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !isEditing && setActiveTab(tab.id)}
            disabled={isEditing && tab.id !== "overview"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-brand-50 text-brand-700 shadow-sm"
                : isEditing && tab.id !== "overview"
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Edit Form — replaces overview content when editing */}
      {isEditing && activeTab === "overview" && (
        <VolunteerEditForm
          volunteer={volunteer}
          onSaved={(updated) => {
            setVolunteer(updated);
            setIsEditing(false);
            showToast("success", "Volunteer updated successfully");
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
      {/* Overview Tab — hidden while editing */}
      {!isEditing && activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {volunteer.partner_type === "organisation" ? "Organisation Details" : 
               volunteer.partner_type === "influencer" ? "Influencer Profile" : 
               "Personal Information"}
            </h3>
            <dl className="space-y-3">
              {[
                { label: "Full Name", value: volunteer.full_name },
                { label: "Email", value: volunteer.email },
                { label: "Phone", value: volunteer.phone },
                ...(volunteer.partner_type === "individual" ? [
                  { label: "Date of Birth", value: volunteer.individual_details?.date_of_birth ? new Date(volunteer.individual_details.date_of_birth).toLocaleDateString() : "-" }
                ] : []),
                ...(volunteer.partner_type === "organisation" ? [
                  { label: "Reg. Number", value: volunteer.organisation_details?.registration_number || "-" },
                  { label: "Industry", value: volunteer.organisation_details?.industry || "-" },
                  { label: "Org Type", value: volunteer.organisation_details?.org_type || "-" },
                  { label: "Contact Person", value: volunteer.organisation_details?.contact_person_name || "-" },
                  { label: "Website", value: volunteer.organisation_details?.website_url ? (
                    <a href={volunteer.organisation_details.website_url} target="_blank" className="text-brand-600 hover:underline">{volunteer.organisation_details.website_url}</a>
                  ) : "-" },
                ] : []),
                ...(volunteer.partner_type === "influencer" ? [
                  { label: "Platform", value: volunteer.influencer_details?.platform || "-" },
                  { label: "Followers", value: volunteer.influencer_details?.follower_count?.toLocaleString() || "-" },
                  { label: "Niche", value: volunteer.influencer_details?.niche || "-" },
                  { label: "Handle", value: volunteer.influencer_details?.handle ? (
                    <span className="text-brand-600 font-bold">{volunteer.influencer_details.handle}</span>
                  ) : "-" },
                ] : []),
                { label: "City", value: volunteer.city },
                { label: "State", value: volunteer.state },
                { label: "Address", value: volunteer.address },
              ].map((item: any) => (
                <div key={item.label} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Type Specific Sections */}
          {volunteer.partner_type === "individual" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                Emergency Contact
              </h3>
              <dl className="space-y-3">
                {[
                  { label: "Name", value: volunteer.individual_details?.emergency_contact_name || "-" },
                  { label: "Phone", value: volunteer.individual_details?.emergency_contact_phone || "-" },
                  { label: "Relationship", value: volunteer.individual_details?.emergency_contact_relationship || "-" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt className="text-sm text-gray-500">{item.label}</dt>
                    <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Skills (for Individuals) or Bio (for others) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {volunteer.partner_type === "individual" ? "Skills" : "Bio / Description"}
            </h3>
            {volunteer.partner_type === "individual" ? (
              volunteer.individual_details?.skills && volunteer.individual_details.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {volunteer.individual_details.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-200">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No skills listed</p>
              )
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{volunteer.bio || "No bio available"}</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role & Position</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Role</span>
                <span className="text-sm font-bold text-brand-600 uppercase">{volunteer.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Position</span>
                <span className="text-sm font-medium text-gray-900">{volunteer.position || "Member"}</span>
              </div>
              <div className="border-t border-gray-50 pt-3">
                <span className="text-xs text-gray-400 block mb-1 uppercase tracking-wider">Responsibilities</span>
                <p className="text-sm text-gray-600">{volunteer.responsibilities || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Activities Tab */}
      {activeTab === "activities" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
          {activitiesLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-gray-500 text-sm">No activities recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Type</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Hours</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Description</th>
                    <th className="text-left py-2 font-medium text-gray-500">Linked To</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-700">{new Date(a.activity_date).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          a.activity_type === "campaign" ? "bg-blue-50 text-blue-700" :
                          a.activity_type === "opportunity" ? "bg-purple-50 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {a.activity_type.charAt(0).toUpperCase() + a.activity_type.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-medium text-gray-900">{a.hours}h</td>
                      <td className="py-3 pr-4 text-gray-600 max-w-xs truncate">{a.description}</td>
                      <td className="py-3 text-gray-500 text-xs">
                        {a.campaign_title || a.opportunity_title || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Assignments</h3>
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm0 0h9" /></svg>
            <p className="text-gray-500 text-sm">Campaign assignments are managed from individual campaign pages</p>
          </div>
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === "certificates" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestone Certificates</h3>
          {certificatesLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              <p className="text-gray-500 text-sm">No certificates earned yet</p>
              <p className="text-gray-400 text-xs mt-1">Certificates are auto-awarded at 10h, 50h, 100h, 500h milestones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => {
                const info = certIcon(cert.certificate_type);
                return (
                  <div key={cert.id} className="relative rounded-xl border border-gray-200 p-5 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${info.color} mb-3`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                      {info.label}
                    </div>
                    <p className="text-sm text-gray-500">Issued: {new Date(cert.issued_date).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

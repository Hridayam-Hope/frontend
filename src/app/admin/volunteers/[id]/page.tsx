"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
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
              <h1 className="text-2xl font-bold text-gray-900">{volunteer.full_name}</h1>
              <p className="text-sm text-gray-500">{volunteer.email} · {volunteer.phone}</p>
            </div>
            <div className="flex gap-2 pb-1">
              <StatusBadge status={volunteer.is_active ? "active" : "inactive"} />
              {volunteer.is_active && (
                <Button size="sm" variant="danger" onClick={handleDeactivate}>Deactivate</Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total Hours", value: `${volunteer.total_hours}h`, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Joined", value: new Date(volunteer.joined_date).toLocaleDateString(), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { label: "Availability", value: [volunteer.availability_weekdays && "Weekdays", volunteer.availability_weekends && "Weekends"].filter(Boolean).join(", ") || "None", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { label: "Hours/Week", value: `${volunteer.hours_per_week}h`, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-100 shadow-sm p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-brand-50 text-brand-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <dl className="space-y-3">
              {[
                { label: "Date of Birth", value: new Date(volunteer.date_of_birth).toLocaleDateString() },
                { label: "Address", value: volunteer.address },
                { label: "City", value: volunteer.city },
                { label: "State", value: volunteer.state },
                { label: "Postal Code", value: volunteer.postal_code },
                { label: "Country", value: volunteer.country },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              Emergency Contact
            </h3>
            <dl className="space-y-3">
              {[
                { label: "Name", value: volunteer.emergency_contact_name },
                { label: "Phone", value: volunteer.emergency_contact_phone },
                { label: "Relationship", value: volunteer.emergency_contact_relationship },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            {volunteer.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-200">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No skills listed</p>
            )}
          </div>

          {/* Languages & Interests */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
            {volunteer.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {volunteer.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-6">No languages listed</p>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{volunteer.interests || "No interests listed"}</p>
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

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import * as api from "@/lib/api/volunteers";
import type { VolunteerOpportunityDetail, OpportunityApplicationItem } from "@/types/api";

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const router = useRouter();
  const { fetchOpportunity, closeOpportunity, oppDetailLoading, opportunityCache, skills, fetchSkills } = useVolunteersStore();
  const [opp, setOpp] = useState<VolunteerOpportunityDetail | null>(null);
  const [applicants, setApplicants] = useState<OpportunityApplicationItem[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    state: "",
    event_date: "",
    event_time: "",
    duration_hours: 0,
    volunteers_needed: 0,
    is_published: true,
  });
  const [editSkillIds, setEditSkillIds] = useState<number[]>([]);

  const loadApplicants = useCallback(async () => {
    setApplicantsLoading(true);
    try {
      const data = await api.getOpportunityApplications(numId);
      setApplicants(data);
    } catch {
      /* ignore */
    } finally {
      setApplicantsLoading(false);
    }
  }, [numId]);

  useEffect(() => {
    if (numId) {
      if (opportunityCache[numId]) setOpp(opportunityCache[numId]);
      fetchOpportunity(numId).then(setOpp).catch(() => {});
      loadApplicants();
      fetchSkills();
    }
  }, [numId, fetchOpportunity, loadApplicants, fetchSkills]);

  const startEdit = () => {
    if (!opp) return;
    setEditForm({
      title: opp.title,
      description: opp.description,
      location: opp.location,
      city: opp.city,
      state: opp.state,
      event_date: opp.event_date,
      event_time: opp.event_time,
      duration_hours: Number(opp.duration_hours),
      volunteers_needed: opp.volunteers_needed,
      is_published: opp.is_published,
    });
    // Match skill names to IDs from the skills list
    const matchedIds = skills
      .filter((s) => opp.required_skills.includes(s.name))
      .map((s) => s.id);
    setEditSkillIds(matchedIds);
    setEditing(true);
  };

  const handleSave = async () => {
    setEditLoading(true);
    try {
      const updated = await api.updateOpportunity(numId, {
        ...editForm,
        duration_hours: Number(editForm.duration_hours),
        volunteers_needed: Number(editForm.volunteers_needed),
        required_skill_ids: editSkillIds,
      });
      setOpp(updated);
      setEditing(false);
      // Invalidate cache so list refreshes
      fetchOpportunity(numId, true).catch(() => {});
    } finally {
      setEditLoading(false);
    }
  };

  const handleClose = async () => {
    if (!confirm("Are you sure you want to close this opportunity?")) return;
    setCloseLoading(true);
    try {
      await closeOpportunity(numId);
      const updated = await fetchOpportunity(numId, true);
      setOpp(updated);
    } finally {
      setCloseLoading(false);
    }
  };

  const handleAccept = async (applicationId: number) => {
    setActionLoading(applicationId);
    try {
      await api.acceptOpportunityApplication(applicationId);
      await loadApplicants();
      const updated = await fetchOpportunity(numId, true);
      setOpp(updated);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: number) => {
    setActionLoading(applicationId);
    try {
      await api.rejectOpportunityApplication(applicationId);
      await loadApplicants();
    } finally {
      setActionLoading(null);
    }
  };

  if (oppDetailLoading && !opp) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!opp) return <p className="p-6 text-gray-500">Opportunity not found</p>;

  const capacityPct = opp.volunteers_needed > 0
    ? (opp.volunteers_accepted / opp.volunteers_needed) * 100
    : 0;
  const isFull = opp.volunteers_accepted >= opp.volunteers_needed;
  const eventDate = new Date(opp.event_date);
  const isPast = eventDate < new Date();
  const pendingApplicants = applicants.filter((a) => a.status === "pending");
  const acceptedApplicants = applicants.filter((a) => a.status === "accepted");
  const rejectedApplicants = applicants.filter((a) => a.status === "rejected");

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => router.push("/admin/opportunities")}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Opportunities
      </button>

      {/* Hero */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{opp.title}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {opp.location ? `${opp.location}, ` : ""}{opp.city}, {opp.state}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={opp.status} />
            <Button size="sm" variant="secondary" onClick={startEdit}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Edit
            </Button>
            {opp.status === "open" && (
              <Button size="sm" variant="danger" onClick={handleClose} loading={closeLoading}>
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {eventDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
            <p className="text-xs text-gray-500">Event Date</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{opp.event_time}</p>
            <p className="text-xs text-gray-500">Start Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{opp.duration_hours}h</p>
            <p className="text-xs text-gray-500">Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{applicants.length}</p>
            <p className="text-xs text-gray-500">Total Applicants</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Description & Applicants - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{opp.description}</p>
          </div>

          {/* Applicants */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Applicants
                {applicants.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-400">({applicants.length})</span>
                )}
              </h3>
              {pendingApplicants.length > 0 && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                  {pendingApplicants.length} pending
                </span>
              )}
            </div>

            {applicantsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-400">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...pendingApplicants, ...acceptedApplicants, ...rejectedApplicants].map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-brand-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                        {app.volunteer_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{app.volunteer_name}</p>
                        <p className="text-xs text-gray-400">
                          Applied {new Date(app.applied_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAccept(app.id)}
                            disabled={actionLoading === app.id || isFull}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === app.id ? "..." : "Accept"}
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            disabled={actionLoading === app.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === app.id ? "..." : "Reject"}
                          </button>
                        </>
                      ) : (
                        <StatusBadge status={app.status} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-6">
          {/* Capacity */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Volunteer Capacity</h3>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  {opp.volunteers_accepted}
                  <span className="text-sm font-normal text-gray-400">/{opp.volunteers_needed}</span>
                </span>
                <span className={`text-sm font-medium ${isFull ? "text-green-600" : "text-brand-600"}`}>
                  {Math.round(capacityPct)}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isFull ? "bg-green-500" : "bg-brand-400"}`}
                  style={{ width: `${Math.min(capacityPct, 100)}%` }}
                />
              </div>
              {isFull && (
                <p className="text-xs text-green-600 font-medium mt-2">✓ Fully staffed</p>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Event Details</h3>
            <dl className="space-y-3">
              {[
                {
                  label: "Date",
                  value: eventDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
                },
                { label: "Time", value: opp.event_time },
                { label: "Duration", value: `${opp.duration_hours} hours` },
                { label: "Location", value: opp.location || `${opp.city}, ${opp.state}` },
                { label: "Published", value: opp.is_published ? "Yes" : "No" },
                { label: "Created", value: new Date(opp.created_at).toLocaleDateString() },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-700 mt-0.5">{item.value}</dd>
                </div>
              ))}
            </dl>
            {isPast && opp.status === "open" && (
              <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">⚠ This event date has passed but the opportunity is still open.</p>
              </div>
            )}
          </div>

          {/* Required Skills */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h3>
            {opp.required_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {opp.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No specific skills required</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Opportunity</h2>
            <div className="space-y-4">
              <Input label="Title *" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                />
              </div>
              <Input label="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City *" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                <Input label="State" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Event Date *" type="date" value={editForm.event_date} onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })} />
                <Input label="Event Time *" type="time" value={editForm.event_time} onChange={(e) => setEditForm({ ...editForm, event_time: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Duration (hours)" type="number" value={editForm.duration_hours} onChange={(e) => setEditForm({ ...editForm, duration_hours: Number(e.target.value) })} />
                <Input label="Volunteers Needed" type="number" value={editForm.volunteers_needed} onChange={(e) => setEditForm({ ...editForm, volunteers_needed: Number(e.target.value) })} />
              </div>
              {/* Required Skills */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg max-h-36 overflow-y-auto">
                    {skills.map((skill) => {
                      const selected = editSkillIds.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() =>
                            setEditSkillIds((prev) =>
                              selected ? prev.filter((sid) => sid !== skill.id) : [...prev, skill.id]
                            )
                          }
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            selected
                              ? "bg-brand-500 text-white border-brand-500"
                              : "bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600"
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-2">No skills available</p>
                )}
                {editSkillIds.length > 0 && (
                  <p className="text-xs text-gray-500">{editSkillIds.length} skill{editSkillIds.length > 1 ? "s" : ""} selected</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.is_published}
                  onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                />
                <label className="text-sm text-gray-700">Published</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" disabled={editLoading}>
                Cancel
              </button>
              <Button onClick={handleSave} loading={editLoading}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import * as api from "@/lib/api/volunteers";
import type { VolunteerOpportunity } from "@/types/api";

export default function OpportunitiesPage() {
  const router = useRouter();
  const { opportunities, oppsTotal, oppsPage, oppsTotalPages, oppsLoading, fetchOpportunities, skills, fetchSkills } = useVolunteersStore();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    work_mode: "in_office" as "in_office" | "remote",
    event_date: "",
    is_published: true,
  });

  const buildParams = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const params: Record<string, unknown> = { page: 1 };
      const s = overrides.status !== undefined ? overrides.status : statusFilter;
      const q = overrides.search !== undefined ? overrides.search : search;
      if (s) params.status = s;
      if (q) params.search = q;
      if (overrides.page) params.page = overrides.page;
      return params;
    },
    [statusFilter, search]
  );

  useEffect(() => {
    fetchOpportunities();
    fetchSkills();
  }, [fetchOpportunities, fetchSkills]);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchOpportunities(buildParams({ status }));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchOpportunities(buildParams({ search: value }));
  };

  const handleCreate = async () => {
    if (!form.title || !form.event_date) {
      showToast("error", "Please fill in all required fields");
      return;
    }
    setCreateLoading(true);
    try {
      const isRemote = form.work_mode === "remote";
      const defaultLocation = isRemote ? "Remote" : "In-Office";

      await api.createOpportunity({
        ...form,
        location: defaultLocation,
        city: defaultLocation,
        state: defaultLocation,
        // Backward-compatible fields for older deployed APIs.
        event_time: "09:00:00",
        duration_hours: 1,
        volunteers_needed: 1,
        required_skill_ids: selectedSkillIds,
      });
      showToast("success", "Opportunity created successfully");
      setShowCreate(false);
      setSelectedSkillIds([]);
      setForm({ title: "", description: "", work_mode: "in_office", event_date: "", is_published: true });
      fetchOpportunities();
    } catch (error) {
      handleError(error, "Failed to create opportunity");
    } finally {
      setCreateLoading(false);
    }
  };

  const columns: Column<VolunteerOpportunity>[] = [
    {
      key: "title",
      label: "Title",
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.title}</p>
          <p className="text-xs text-gray-400 truncate max-w-xs">{item.description.slice(0, 60)}...</p>
        </div>
      ),
    },
    {
      key: "work_mode",
      label: "Mode",
      render: (item) => (
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
          {item.work_mode === "remote" ? "Remote" : "In-Office"}
        </span>
      ),
    },
    {
      key: "event_date",
      label: "Date",
      render: (item) => (
        <p className="text-sm text-gray-700">{new Date(item.event_date).toLocaleDateString()}</p>
      ),
    },
    {
      key: "applicants",
      label: "Applicants",
      render: (item) => (
        <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
          {item.applicants}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Opportunities</h1>
          <p className="text-gray-500 mt-1">{oppsTotal} opportunities</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Opportunity
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          />
        </div>
        <div className="flex gap-1.5">
          {[
            { value: "", label: "All" },
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
            { value: "cancelled", label: "Cancelled" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => handleFilter(s.value)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                statusFilter === s.value
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={opportunities}
        loading={oppsLoading}
        onRowClick={(item) => router.push(`/admin/opportunities/${item.id}`)}
        emptyMessage="No opportunities found"
      />

      <Pagination
        page={oppsPage}
        totalPages={oppsTotalPages}
        total={oppsTotal}
        onPageChange={(p) => fetchOpportunities(buildParams({ page: p }))}
      />

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Opportunity</h2>
            <div className="space-y-4">
              <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Community cleanup drive" />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Work Mode *</label>
                <select
                  value={form.work_mode}
                  onChange={(e) => setForm({ ...form, work_mode: e.target.value as "in_office" | "remote" })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                >
                  <option value="in_office">In-Office</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  placeholder="Describe the opportunity..."
                />
              </div>
              <Input label="Event Date *" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
              {/* Required Skills */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg max-h-36 overflow-y-auto">
                    {skills.map((skill) => {
                      const selected = selectedSkillIds.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() =>
                            setSelectedSkillIds((prev) =>
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
                {selectedSkillIds.length > 0 && (
                  <p className="text-xs text-gray-500">{selectedSkillIds.length} skill{selectedSkillIds.length > 1 ? "s" : ""} selected</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                />
                <label className="text-sm text-gray-700">Publish immediately</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" disabled={createLoading}>
                Cancel
              </button>
              <Button onClick={handleCreate} loading={createLoading}>
                Create Opportunity
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

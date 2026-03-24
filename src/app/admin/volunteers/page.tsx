"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import VolunteerForm, { type VolunteerFormData } from "@/components/admin/VolunteerForm";
import type { VolunteerProfileListItem } from "@/types/api";

export default function VolunteersPage() {
  const router = useRouter();
  const { volunteers, volTotal, volPage, volTotalPages, volLoading, fetchVolunteers, createVolunteer } = useVolunteersStore();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [activeType, setActiveType] = useState<string>("individual");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<string | null>(null);

  const buildParams = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const params: Record<string, unknown> = { page: 1, partner_type: overrides.partner_type || activeType };
      const q = overrides.search !== undefined ? overrides.search : search;
      const a = overrides.is_active !== undefined ? overrides.is_active : activeFilter;
      if (q) params.search = q;
      if (a !== "") params.is_active = a === "true";
      if (overrides.page) params.page = overrides.page;
      return params;
    },
    [search, activeFilter, activeType]
  );

  useEffect(() => {
    fetchVolunteers(buildParams());
  }, [fetchVolunteers, activeType]);

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchVolunteers(buildParams({ search: value }));
  };

  const handleFilter = (value: string) => {
    setActiveFilter(value);
    fetchVolunteers(buildParams({ is_active: value }));
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    // useEffect will trigger fetch
  };

  const handleCreateVolunteer = async (data: VolunteerFormData) => {
    try {
      await createVolunteer(data as any);
      showToast("success", "Volunteer created successfully");
      setShowForm(false);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const statCards = [
    { label: "Total Volunteers", value: volTotal, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "brand" },
    { label: "Active", value: volunteers.filter((v) => v.is_active).length, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "green" },
  ];

  const columns: Column<VolunteerProfileListItem>[] = [
    {
      key: "full_name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {item.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.full_name}</p>
            <p className="text-xs text-gray-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    ...(activeType === "individual" ? [
      {
        key: "total_hours",
        label: "Hours",
        render: (item: any) => (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
            <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {item.total_hours}h
          </span>
        ),
      }
    ] : []),
    {
      key: "is_active",
      label: "Status",
      render: (item) => <StatusBadge status={item.is_active ? "active" : "inactive"} />,
    },
    {
      key: "joined_date",
      label: "Joined",
      render: (item) => new Date(item.joined_date).toLocaleDateString(),
    },
    {
      key: "last_activity_date",
      label: "Last Active",
      render: (item) => item.last_activity_date ? new Date(item.last_activity_date).toLocaleDateString() : <span className="text-gray-300">-</span>,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
          <p className="text-gray-500 mt-1">Manage volunteer profiles and track contributions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Volunteer
            </span>
          </button>
          <Link
            href="/admin/volunteers/applications"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Applications
            </span>
          </Link>
          <Link
            href="/admin/opportunities"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Opportunities
            </span>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color === "brand" ? "bg-brand-50 text-brand-500" : "bg-green-50 text-green-500"}`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Type Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {[
          { id: "individual", label: "Individuals", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
          { id: "organisation", label: "Organisations", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          { id: "influencer", label: "Influencers", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => handleTypeChange(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeType === t.id
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          />
        </div>
        <div className="flex gap-1.5">
          {[
            { value: "", label: "All" },
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilter(f.value)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeFilter === f.value
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={volunteers}
        loading={volLoading}
        onRowClick={(item) => router.push(`/admin/volunteers/${item.id}`)}
      />

      <Pagination
        page={volPage}
        totalPages={volTotalPages}
        total={volTotal}
        onPageChange={(p) => fetchVolunteers(buildParams({ page: p }))}
      />

      {/* Create Volunteer Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {!formType ? "Select Partner Type" : `Add New ${formType.charAt(0).toUpperCase() + formType.slice(1)}`}
              </h2>
              <button 
                onClick={() => { setShowForm(false); setFormType(null); }}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              {!formType ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                  {[
                    { id: "individual", label: "Individual", desc: "A regular person wanting to volunteer", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                    { id: "organisation", label: "Organisation", desc: "NGOs, Corporates, or Local Groups", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                    { id: "influencer", label: "Influencer", desc: "Public figures and social leaders", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFormType(t.id)}
                      className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-brand-400 hover:shadow-lg transition-all text-center group"
                    >
                      <div className="h-16 w-16 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} /></svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{t.label}</h3>
                        <p className="text-sm text-gray-500">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <VolunteerForm 
                  partnerType={formType} 
                  onSubmit={handleCreateVolunteer} 
                  onCancel={() => setFormType(null)} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

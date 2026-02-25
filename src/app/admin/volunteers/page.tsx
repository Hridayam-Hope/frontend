"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import type { VolunteerProfileListItem } from "@/types/api";

export default function VolunteersPage() {
  const router = useRouter();
  const { volunteers, volTotal, volPage, volTotalPages, volLoading, fetchVolunteers } = useVolunteersStore();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("");

  const buildParams = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const params: Record<string, unknown> = { page: 1 };
      const q = overrides.search !== undefined ? overrides.search : search;
      const a = overrides.is_active !== undefined ? overrides.is_active : activeFilter;
      if (q) params.search = q;
      if (a !== "") params.is_active = a === "true";
      if (overrides.page) params.page = overrides.page;
      return params;
    },
    [search, activeFilter]
  );

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchVolunteers(buildParams({ search: value }));
  };

  const handleFilter = (value: string) => {
    setActiveFilter(value);
    fetchVolunteers(buildParams({ is_active: value }));
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
    {
      key: "total_hours",
      label: "Hours",
      render: (item) => (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
          <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {item.total_hours}h
        </span>
      ),
    },
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
    </div>
  );
}

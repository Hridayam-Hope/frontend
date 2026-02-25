"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCampaignsStore } from "@/lib/stores/campaigns";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { CampaignListItem } from "@/types/api";

export default function CampaignsPage() {
  const router = useRouter();
  const {
    campaigns, total, page, totalPages, listLoading,
    fetchCampaigns, fetchCategories, categories,
  } = useCampaignsStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchCampaigns();
    fetchCategories();
  }, [fetchCampaigns, fetchCategories]);

  const buildParams = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const params: Record<string, unknown> = { page: 1 };
      const s = overrides.status !== undefined ? overrides.status : statusFilter;
      const q = overrides.search !== undefined ? overrides.search : search;
      const cat = overrides.category_id !== undefined ? overrides.category_id : categoryFilter;
      const t = overrides.campaign_type !== undefined ? overrides.campaign_type : typeFilter;
      if (s) params.status = s;
      if (q) params.search = q;
      if (cat) params.category_id = cat;
      if (t) params.campaign_type = t;
      if (overrides.page) params.page = overrides.page;
      return params;
    },
    [statusFilter, search, categoryFilter, typeFilter]
  );

  const handlePageChange = (p: number) => fetchCampaigns(buildParams({ page: p }));

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchCampaigns(buildParams({ status }));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchCampaigns(buildParams({ search: value }));
  };

  const handleCategoryFilter = (val: number | "") => {
    setCategoryFilter(val);
    fetchCampaigns(buildParams({ category_id: val }));
  };

  const handleTypeFilter = (val: string) => {
    setTypeFilter(val);
    fetchCampaigns(buildParams({ campaign_type: val }));
  };

  const columns: Column<CampaignListItem>[] = [
    {
      key: "title",
      label: "Campaign",
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.featured_image ? (
            <img
              src={item.featured_image}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-600 text-xs font-bold">{item.title.charAt(0)}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
            <p className="text-xs text-gray-400 capitalize">{item.campaign_type}</p>
          </div>
        </div>
      ),
    },
    { key: "category_name", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "progress_percentage",
      label: "Progress",
      render: (item) => {
        const pct = item.progress_percentage;
        const overFunded = pct > 100;
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  overFunded
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : "bg-gradient-to-r from-brand-400 to-accent-400"
                }`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${
              overFunded ? "text-emerald-600" : "text-gray-500"
            }`}>{pct}%</span>
          </div>
        );
      },
    },
    {
      key: "achieved_value",
      label: "Achieved / Target",
      render: (item) => {
        const isMoney = item.target_unit === "money";
        const prefix = isMoney ? "₹" : "";
        const suffix = !isMoney ? ` ${item.target_unit}` : "";
        return (
          <div>
            <p className="text-sm font-medium text-gray-900">{prefix}{Number(item.achieved_value).toLocaleString()}{suffix}</p>
            <p className="text-xs text-gray-400">of {prefix}{Number(item.target_value).toLocaleString()}{suffix}</p>
          </div>
        );
      },
    },
    {
      key: "created_at",
      label: "Created",
      render: (item) => (
        <span className="text-sm text-gray-500">
          {new Date(item.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">{total} campaigns total</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/campaigns/categories">
            <Button variant="secondary" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              Categories
            </Button>
          </Link>
          <Button onClick={() => router.push("/admin/campaigns/new")}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Campaign
          </Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-300 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value ? Number(e.target.value) : "")}
            className="text-sm rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => handleTypeFilter(e.target.value)}
            className="text-sm rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          >
            <option value="">All Types</option>
            <option value="fundraising">Fundraising</option>
            <option value="awareness">Awareness</option>
            <option value="volunteer">Volunteer Drive</option>
            <option value="in_kind">In-Kind</option>
          </select>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2">
          {["", "draft", "active", "paused", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => handleFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                statusFilter === s
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={campaigns}
        loading={listLoading}
        onRowClick={(item) => router.push(`/admin/campaigns/${item.id}`)}
        emptyMessage="No campaigns found"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

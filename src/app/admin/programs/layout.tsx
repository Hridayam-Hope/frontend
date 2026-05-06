"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useProgramsStore } from "@/lib/stores/programs";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import type { ProgramListItem } from "@/types/api";
import Image from "next/image";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function ProgramsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  
  // Only show list on exact /admin/programs route
  const isListPage = pathname === "/admin/programs";

  const {
    programs,
    total,
    page,
    totalPages,
    listLoading,
    summary,
    summaryLoading,
    categories,
    fetchPrograms,
    fetchSummary,
    fetchCategories,
  } = useProgramsStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("");

  const selectedId = useMemo(() => {
    const match = pathname.match(/\/admin\/programs\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }, [pathname]);

  useEffect(() => {
    fetchPrograms();
    fetchSummary();
    fetchCategories();
  }, [fetchPrograms, fetchSummary, fetchCategories]);

  function currentFilters() {
    return {
      search: search || undefined,
      status: statusFilter || undefined,
      category_id: categoryFilter ? parseInt(categoryFilter) : undefined,
      is_featured: featuredFilter === "true" ? true : featuredFilter === "false" ? false : undefined,
    };
  }

  function applyFilters() {
    fetchPrograms({ page: 1, ...currentFilters() });
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setFeaturedFilter("");
    fetchPrograms({ page: 1 });
  }

  const hasFilters = search || statusFilter || categoryFilter || featuredFilter;

  const columns: Column<ProgramListItem>[] = [
    {
      key: "featured_image",
      label: "",
      render: (item) => (
        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.featured_image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-[300px]">{item.title}</p>
          <p className="text-xs text-gray-500">{item.location}</p>
        </div>
      ),
    },
    {
      key: "category_name",
      label: "Category",
      render: (item) => (
        <span
          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full text-white ${item.category_color}`}
        >
          {item.badge_label}
        </span>
      ),
    },
    {
      key: "event_date",
      label: "Date",
      render: (item) =>
        new Date(item.event_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "volunteers_count",
      label: "Volunteers",
      render: (item) => <span className="text-gray-700">{item.volunteers_count}</span>,
    },
    {
      key: "view_count",
      label: "Views",
      render: (item) => <span className="text-gray-500 text-sm">{item.view_count}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          {item.is_featured && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">★ Featured</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {isListPage ? (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Programs & Activities</h1>
              <p className="text-gray-500 mt-1">{total} program records</p>
            </div>
            <Button onClick={() => router.push("/admin/programs/new")}>
              Add Program
            </Button>
          </div>

          {/* Stats */}
          {summary && !summaryLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              <StatCard
                label="Total Programs"
                value={summary.total_programs}
                color="from-brand-400 to-brand-500"
              />
              <StatCard
                label="Published"
                value={summary.published_programs}
                color="from-emerald-400 to-emerald-500"
              />
              <StatCard
                label="Drafts"
                value={summary.draft_programs}
                color="from-amber-400 to-amber-500"
              />
              <StatCard
                label="Total Views"
                value={summary.total_views.toLocaleString()}
                color="from-blue-400 to-blue-500"
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3 mt-6 mb-3">
            <div className="flex-1 min-w-[200px] max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Search title, location..."
                className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              />
            </div>

            {/* Category select */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                fetchPrograms({
                  page: 1,
                  ...currentFilters(),
                  category_id: e.target.value ? parseInt(e.target.value) : undefined,
                });
              }}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Featured filter */}
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                fetchPrograms({
                  page: 1,
                  ...currentFilters(),
                  is_featured: e.target.value === "true" ? true : e.target.value === "false" ? false : undefined,
                });
              }}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
            >
              <option value="">All Programs</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>

            <Button variant="secondary" size="sm" onClick={applyFilters}>
              Apply
            </Button>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          {/* Status chips */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setStatusFilter(s.value);
                  fetchPrograms({ page: 1, ...currentFilters(), status: s.value || undefined });
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  statusFilter === s.value
                    ? "bg-brand-500 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={programs}
            loading={listLoading}
            selectedRowId={selectedId}
            onRowClick={(item) => router.push(`/admin/programs/${item.id}`)}
            emptyMessage="No programs found"
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={(p) => fetchPrograms({ page: p, ...currentFilters() })}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}

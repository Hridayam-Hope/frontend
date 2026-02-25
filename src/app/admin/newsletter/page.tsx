"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useNewsletterStore } from "@/lib/stores/newsletter";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import type { NewsletterListItem } from "@/types/api";

export default function NewsletterPage() {
  const {
    newsletters, nlTotal, nlPage, nlTotalPages, nlLoading,
    fetchNewsletters, stats, fetchStats,
  } = useNewsletterStore();
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchNewsletters();
    fetchStats();
  }, [fetchNewsletters, fetchStats]);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchNewsletters({ page: 1, status: status || undefined });
  };

  const columns: Column<NewsletterListItem>[] = [
    { key: "subject", label: "Subject" },
    { key: "template_name", label: "Template" },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: "total_recipients", label: "Recipients" },
    { key: "sent_count", label: "Sent" },
    { key: "opened_count", label: "Opened" },
    {
      key: "created_at",
      label: "Created",
      render: (item) => new Date(item.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/newsletter/subscribers"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Subscribers
          </Link>
          <Link
            href="/admin/newsletter/templates"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Templates
          </Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard label="Active Subscribers" value={stats.active_subscribers} color="from-brand-400 to-brand-500" />
          <StatCard label="Newsletters Sent" value={stats.sent_newsletters} color="from-accent-400 to-accent-500" />
          <StatCard label="Open Rate" value={`${(stats.open_rate * 100).toFixed(1)}%`} color="from-emerald-400 to-emerald-500" />
          <StatCard label="Click Rate" value={`${(stats.click_rate * 100).toFixed(1)}%`} color="from-amber-400 to-amber-500" />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {["", "draft", "sent", "scheduled"].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              statusFilter === s
                ? "bg-brand-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={newsletters} loading={nlLoading} />

      <Pagination
        page={nlPage}
        totalPages={nlTotalPages}
        total={nlTotal}
        onPageChange={(p) => fetchNewsletters({ page: p, status: statusFilter || undefined })}
      />
    </div>
  );
}

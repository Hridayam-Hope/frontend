"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useNewsletterStore } from "@/lib/stores/newsletter";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import type { SubscriberListItem } from "@/types/api";

export default function SubscribersPage() {
  const { subscribers, subTotal, subPage, subTotalPages, subLoading, fetchSubscribers } = useNewsletterStore();
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchSubscribers({ page: 1, status: status || undefined });
  };

  const columns: Column<SubscriberListItem>[] = [
    { key: "email", label: "Email" },
    { key: "name", label: "Name" },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "segments",
      label: "Segments",
      render: (item) => (
        <div className="flex gap-1">
          {item.segments?.map((seg) => (
            <span key={seg} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {seg}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "subscribed_at",
      label: "Subscribed",
      render: (item) => new Date(item.subscribed_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <Link
        href="/admin/newsletter"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Newsletter
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
      <p className="text-gray-500 mt-1">{subTotal} subscribers</p>

      <div className="flex gap-2 mt-6 mb-4">
        {["", "active", "pending", "unsubscribed", "bounced"].map((s) => (
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

      <DataTable columns={columns} data={subscribers} loading={subLoading} />

      <Pagination
        page={subPage}
        totalPages={subTotalPages}
        total={subTotal}
        onPageChange={(p) => fetchSubscribers({ page: p, status: statusFilter || undefined })}
      />
    </div>
  );
}

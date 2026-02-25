"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInKindStore } from "@/lib/stores/inkind";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import type { InKindDonationListItem } from "@/types/api";

export default function InKindPage() {
  const router = useRouter();
  const { donations, total, page, totalPages, listLoading, fetchDonations, stats, fetchStats } = useInKindStore();
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [fetchDonations, fetchStats]);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchDonations({ page: 1, status: status || undefined });
  };

  const columns: Column<InKindDonationListItem>[] = [
    { key: "donor_name", label: "Donor" },
    { key: "item_name", label: "Item" },
    { key: "item_category", label: "Category" },
    { key: "quantity", label: "Qty" },
    {
      key: "estimated_value",
      label: "Value",
      render: (item) => `₹${item.estimated_value.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: "delivery_method", label: "Delivery" },
    {
      key: "created_at",
      label: "Date",
      render: (item) => new Date(item.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">In-Kind Donations</h1>
          <p className="text-gray-500 mt-1">{total} donations total</p>
        </div>
        <button
          onClick={() => router.push("/admin/inkind/new")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Record Donation
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <StatCard label="Pending" value={stats.pending_donations} color="from-amber-400 to-amber-500" />
          <StatCard label="In Transit" value={stats.in_transit_donations} color="from-blue-400 to-blue-500" />
          <StatCard label="Received" value={stats.received_donations} color="from-brand-400 to-brand-500" />
          <StatCard label="Donated" value={stats.donated_donations} color="from-emerald-400 to-emerald-500" />
        </div>
      )}

      <div className="flex gap-2 mt-6 mb-4">
        {["", "pending", "verified", "in_transit", "received", "donated", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              statusFilter === s
                ? "bg-brand-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "All"}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={donations}
        loading={listLoading}
        onRowClick={(item) => router.push(`/admin/inkind/${item.id}`)}
      />

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={(p) => fetchDonations({ page: p, status: statusFilter || undefined })} />
    </div>
  );
}

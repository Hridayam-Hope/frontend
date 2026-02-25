"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDonationsStore } from "@/lib/stores/donations";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import type { DonationListItem } from "@/types/api";

export default function DonationsPage() {
  const router = useRouter();
  const { donations, total, page, totalPages, listLoading, fetchDonations, stats, fetchStats } = useDonationsStore();
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [fetchDonations, fetchStats]);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchDonations({ page: 1, status: status || undefined });
  };

  const columns: Column<DonationListItem>[] = [
    { key: "donor_name", label: "Donor" },
    { key: "donor_email", label: "Email" },
    {
      key: "amount",
      label: "Amount",
      render: (item) => `₹${item.amount.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: "donation_type", label: "Type" },
    { key: "campaign_title", label: "Campaign", render: (item) => item.campaign_title || "General" },
    {
      key: "created_at",
      label: "Date",
      render: (item) => new Date(item.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
      <p className="text-gray-500 mt-1">{total} donations total</p>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <StatCard label="Total Amount" value={`₹${stats.total_amount.toLocaleString()}`} color="from-brand-400 to-brand-500" />
          <StatCard label="Completed" value={stats.completed_donations} color="from-emerald-400 to-emerald-500" />
          <StatCard label="Pending" value={stats.pending_donations} color="from-amber-400 to-amber-500" />
          <StatCard label="Average" value={`₹${stats.average_donation.toLocaleString()}`} color="from-accent-400 to-accent-500" />
        </div>
      )}

      <div className="flex gap-2 mt-6 mb-4">
        {["", "completed", "pending", "failed"].map((s) => (
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

      <DataTable
        columns={columns}
        data={donations}
        loading={listLoading}
        onRowClick={(item) => router.push(`/admin/donations/${item.id}`)}
      />

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={(p) => fetchDonations({ page: p, status: statusFilter || undefined })} />
    </div>
  );
}

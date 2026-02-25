"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const columns: Column<VolunteerProfileListItem>[] = [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "total_hours", label: "Hours", render: (item) => `${item.total_hours}h` },
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
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
          <p className="text-gray-500 mt-1">{volTotal} volunteers</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/volunteers/applications"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Applications
          </Link>
          <Link
            href="/admin/volunteers/opportunities"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Opportunities
          </Link>
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
        onPageChange={(p) => fetchVolunteers({ page: p })}
      />
    </div>
  );
}

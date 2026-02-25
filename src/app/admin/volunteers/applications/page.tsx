"use client";

import { useEffect, useState } from "react";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { VolunteerApplicationListItem } from "@/types/api";

export default function ApplicationsPage() {
  const {
    applications, appsTotal, appsPage, appsTotalPages, appsLoading,
    fetchApplications, approveApplication, rejectApplication,
  } = useVolunteersStore();
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchApplications({ page: 1, status: status || undefined });
  };

  const columns: Column<VolunteerApplicationListItem>[] = [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "application_date",
      label: "Applied",
      render: (item) => new Date(item.application_date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) =>
        item.status === "pending" ? (
          <div className="flex gap-1">
            <Button size="sm" onClick={(e) => { e.stopPropagation(); approveApplication(item.id); }}>
              Approve
            </Button>
            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); rejectApplication(item.id); }}>
              Reject
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Volunteer Applications</h1>
      <p className="text-gray-500 mt-1">{appsTotal} applications</p>

      <div className="flex gap-2 mt-6 mb-4">
        {["", "pending", "approved", "rejected"].map((s) => (
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

      <DataTable columns={columns} data={applications} loading={appsLoading} />

      <Pagination
        page={appsPage}
        totalPages={appsTotalPages}
        total={appsTotal}
        onPageChange={(p) => fetchApplications({ page: p, status: statusFilter || undefined })}
      />
    </div>
  );
}

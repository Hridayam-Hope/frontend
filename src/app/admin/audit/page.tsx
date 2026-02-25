"use client";

import { useEffect, useState } from "react";
import { useAuditStore } from "@/lib/stores/audit";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import Input from "@/components/ui/Input";
import type { AuditLogListItem } from "@/types/api";

export default function AuditPage() {
  const { logs, total, page, totalPages, listLoading, fetchLogs, stats, fetchStats } = useAuditStore();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  const handleSearch = () => {
    fetchLogs({
      page: 1,
      search: search || undefined,
      action: actionFilter || undefined,
      entity_type: entityFilter || undefined,
    });
  };

  const columns: Column<AuditLogListItem>[] = [
    { key: "user_email", label: "User" },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
          {item.action}
        </span>
      ),
    },
    {
      key: "entity_type",
      label: "Entity",
      render: (item) => (
        <span className="text-xs">
          <span className="text-gray-400">{item.entity_type}/</span>
          <span className="font-medium">{item.entity_name}</span>
        </span>
      ),
    },
    { key: "description", label: "Description" },
    {
      key: "created_at",
      label: "Time",
      render: (item) => new Date(item.created_at).toLocaleString(),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
      <p className="text-gray-500 mt-1">Track all admin actions</p>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6 mb-6">
          <StatCard label="Last 24 Hours" value={stats.logs_24h} color="from-brand-400 to-accent-400" />
          <StatCard label="Last 7 Days" value={stats.logs_7d} color="from-accent-400 to-accent-500" />
          <StatCard label="Last 30 Days" value={stats.logs_30d} color="from-brand-500 to-brand-600" />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4 items-end">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
        </select>
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Entities</option>
          <option value="campaign">Campaign</option>
          <option value="donation">Donation</option>
          <option value="inkind_donation">In-Kind</option>
          <option value="volunteer">Volunteer</option>
          <option value="member">Member</option>
          <option value="newsletter">Newsletter</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-500 text-white hover:bg-brand-600"
        >
          Filter
        </button>
      </div>

      <DataTable columns={columns} data={logs} loading={listLoading} />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={(p) =>
          fetchLogs({
            page: p,
            search: search || undefined,
            action: actionFilter || undefined,
            entity_type: entityFilter || undefined,
          })
        }
      />
    </div>
  );
}

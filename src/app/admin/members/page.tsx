"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMembersStore } from "@/lib/stores/members";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { MemberListItem } from "@/types/api";

const ROLES = [
  { value: "", label: "All Roles" },
  { value: "founder", label: "Founder" },
  { value: "co_founder", label: "Co-Founder" },
  { value: "trustee", label: "Trustee" },
  { value: "board_member", label: "Board Member" },
  { value: "advisor", label: "Advisor" },
];

export default function MembersPage() {
  const router = useRouter();
  const { members, total, page, totalPages, listLoading, fetchMembers } = useMembersStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSearch = () => {
    fetchMembers({ page: 1, search: search || undefined, role: roleFilter || undefined });
  };

  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    fetchMembers({ page: 1, search: search || undefined, role: role || undefined });
  };

  const columns: Column<MemberListItem>[] = [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "position", label: "Position" },
    {
      key: "is_active",
      label: "Status",
      render: (item) => <StatusBadge status={item.is_active ? "active" : "inactive"} />,
    },
    { key: "tenure_years", label: "Tenure", render: (item) => `${item.tenure_years}y` },
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
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500 mt-1">{total} members</p>
        </div>
        <Button onClick={() => router.push("/admin/members/new")}>+ New Member</Button>
      </div>

      <div className="flex gap-3 mb-4 items-end">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-500 text-white hover:bg-brand-600"
        >
          Search
        </button>
      </div>

      <DataTable
        columns={columns}
        data={members}
        loading={listLoading}
        onRowClick={(item) => router.push(`/admin/members/${item.id}`)}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={(p) => fetchMembers({ page: p, search: search || undefined, role: roleFilter || undefined })}
      />
    </div>
  );
}

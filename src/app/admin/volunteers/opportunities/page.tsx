"use client";

import { useEffect } from "react";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import type { VolunteerOpportunity } from "@/types/api";

export default function OpportunitiesPage() {
  const { opportunities, oppsLoaded, fetchOpportunities } = useVolunteersStore();

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const columns: Column<VolunteerOpportunity>[] = [
    { key: "title", label: "Title" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    {
      key: "event_date",
      label: "Date",
      render: (item) => new Date(item.event_date).toLocaleDateString(),
    },
    { key: "duration_hours", label: "Duration", render: (item) => `${item.duration_hours}h` },
    {
      key: "volunteers_accepted",
      label: "Filled",
      render: (item) => `${item.volunteers_accepted}/${item.volunteers_needed}`,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Volunteer Opportunities</h1>
      <p className="text-gray-500 mt-1">{opportunities.length} opportunities</p>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={opportunities}
          loading={!oppsLoaded}
          emptyMessage="No opportunities found"
        />
      </div>
    </div>
  );
}

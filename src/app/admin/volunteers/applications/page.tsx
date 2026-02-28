"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { VolunteerApplicationListItem } from "@/types/api";

export default function ApplicationsPage() {
  const router = useRouter();
  const {
    applications, appsTotal, appsPage, appsTotalPages, appsLoading,
    fetchApplications, approveApplication, rejectApplication,
  } = useVolunteersStore();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [reviewModal, setReviewModal] = useState<{ id: number; action: "approve" | "reject" } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const buildParams = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const params: Record<string, unknown> = { page: 1 };
      const s = overrides.status !== undefined ? overrides.status : statusFilter;
      const q = overrides.search !== undefined ? overrides.search : search;
      if (s) params.status = s;
      if (q) params.search = q;
      if (overrides.page) params.page = overrides.page;
      return params;
    },
    [statusFilter, search]
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchApplications(buildParams({ status }));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchApplications(buildParams({ search: value }));
  };

  const handleReviewSubmit = async () => {
    if (!reviewModal) return;
    setReviewLoading(true);
    try {
      if (reviewModal.action === "approve") {
        await approveApplication(reviewModal.id, reviewNotes);
        showToast("success", "Application approved successfully");
      } else {
        await rejectApplication(reviewModal.id, reviewNotes);
        showToast("success", "Application rejected");
      }
      setReviewModal(null);
      setReviewNotes("");
    } catch (error) {
      handleError(error, `Failed to ${reviewModal.action} application`);
    } finally {
      setReviewLoading(false);
    }
  };

  const columns: Column<VolunteerApplicationListItem>[] = [
    {
      key: "full_name",
      label: "Name",
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.full_name}</p>
          <p className="text-xs text-gray-400">{item.email}</p>
        </div>
      ),
    },
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
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" onClick={() => setReviewModal({ id: item.id, action: "approve" })}>
              Approve
            </Button>
            <Button size="sm" variant="danger" onClick={() => setReviewModal({ id: item.id, action: "reject" })}>
              Reject
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Applications</h1>
          <p className="text-gray-500 mt-1">{appsTotal} applications</p>
        </div>
        <button onClick={() => router.push("/admin/volunteers")} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Volunteers
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          />
        </div>
        <div className="flex gap-1.5">
          {[
            { value: "", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => handleFilter(s.value)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                statusFilter === s.value
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        loading={appsLoading}
        onRowClick={(item) => router.push(`/admin/volunteers/applications/${item.id}`)}
      />

      <Pagination
        page={appsPage}
        totalPages={appsTotalPages}
        total={appsTotal}
        onPageChange={(p) => fetchApplications(buildParams({ page: p }))}
      />

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {reviewModal.action === "approve" ? "Approve Application" : "Reject Application"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {reviewModal.action === "approve"
                ? "This will create a volunteer profile from the application."
                : "The applicant will be notified of the rejection."}
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
              placeholder={reviewModal.action === "approve" ? "Optional notes..." : "Reason for rejection..."}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setReviewModal(null); setReviewNotes(""); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={reviewLoading}
              >
                Cancel
              </button>
              <Button
                onClick={handleReviewSubmit}
                loading={reviewLoading}
                variant={reviewModal.action === "reject" ? "danger" : "primary"}
              >
                {reviewModal.action === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

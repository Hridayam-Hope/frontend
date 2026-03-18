"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useExpensesStore } from "@/lib/stores/expenses";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import ExpenseForm, { CATEGORIES, PAYMENT_METHODS } from "@/components/expenses/ExpenseForm";
import type { ExpenseListItem } from "@/types/api";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "pending_approval", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "rejected", label: "Rejected" },
];

export default function ExpensesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { handleError } = useApiError();

  const {
    expenses, total, page, totalPages, listLoading,
    summary, summaryLoading,
    fetchExpenses, fetchSummary, createExpense,
  } = useExpensesStore();

  const [showForm, setShowForm] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const selectedId = useMemo(() => {
    const match = pathname.match(/\/admin\/expenses\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }, [pathname]);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [fetchExpenses, fetchSummary]);

  // Current filter state — used by pagination so it preserves filters across pages
  function currentFilters() {
    return {
      search: search || undefined,
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      payment_method: paymentFilter || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    };
  }

  function applyFilters() {
    fetchExpenses({ page: 1, ...currentFilters() });
  }

  function clearFilters() {
    setSearch(""); setStatusFilter(""); setCategoryFilter("");
    setPaymentFilter(""); setDateFrom(""); setDateTo("");
    fetchExpenses({ page: 1 });
  }

  const hasFilters = search || statusFilter || categoryFilter || paymentFilter || dateFrom || dateTo;

  const columns: Column<ExpenseListItem>[] = [
    {
      key: "title",
      label: "Title",
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-[200px]">{item.title}</p>
          {item.is_recurring && (
            <span className="text-xs text-brand-500">↻ Recurring</span>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) => (
        <span className="font-semibold text-gray-900">₹{Number(item.amount).toLocaleString()}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (item) =>
        new Date(item.date).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        }),
    },
    {
      key: "category_label",
      label: "Category",
      render: (item) => (
        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
          {item.category_label}
        </span>
      ),
    },
    {
      key: "paid_to",
      label: "Paid To",
      render: (item) => (
        <span className="text-gray-600 text-sm">{item.paid_to || "—"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-500 mt-1">{total} expense records</p>
          </div>
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Add Expense"}
          </Button>
        </div>

        {/* Stats */}
        {summary && !summaryLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            <StatCard label="Total Expenses" value={`₹${Number(summary.total_amount).toLocaleString()}`} color="from-red-400 to-rose-500" />
            <StatCard label="Paid" value={`₹${Number(summary.paid_amount).toLocaleString()}`} color="from-emerald-400 to-emerald-500" />
            <StatCard label="Pending / Approved" value={`₹${Number(summary.pending_amount).toLocaleString()}`} color="from-amber-400 to-amber-500" />
            <StatCard label="This Month" value={`₹${Number(summary.this_month_amount).toLocaleString()}`} color="from-brand-400 to-brand-500" />
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Expense</h2>
            <ExpenseForm
              onSubmit={async (data) => {
                try {
                  await createExpense(data);
                  showToast("success", "Expense recorded");
                  setShowForm(false);
                  fetchSummary(true);
                } catch (err) {
                  handleError(err, "Failed to create expense");
                }
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 mt-6 mb-3">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Search title, payee, reference..."
              className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
            />
          </div>

          {/* Category select */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); fetchExpenses({ page: 1, ...currentFilters(), category: e.target.value || undefined }); }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          {/* Payment method select */}
          <select
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); fetchExpenses({ page: 1, ...currentFilters(), payment_method: e.target.value || undefined }); }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
          >
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" />
            <span className="text-gray-400 text-sm">to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" />
          </div>

          <Button variant="secondary" size="sm" onClick={applyFilters}>Apply</Button>
          {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>}
        </div>

        {/* Status chips */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatusFilter(s.value); fetchExpenses({ page: 1, ...currentFilters(), status: s.value || undefined }); }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                statusFilter === s.value
                  ? "bg-brand-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={expenses}
          loading={listLoading}
          selectedRowId={selectedId}
          onRowClick={(item) => router.push(`/admin/expenses/${item.id}`)}
          emptyMessage="No expenses found"
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={(p) => fetchExpenses({ page: p, ...currentFilters() })}
        />

        {/* Category breakdown */}
        {summary && summary.by_category.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
            <div className="space-y-3">
              {summary.by_category.map((row) => {
                const pct = summary.total_amount > 0
                  ? Math.round((Number(row.total) / Number(summary.total_amount)) * 100)
                  : 0;
                return (
                  <div key={row.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{row.category_label}</span>
                      <span className="font-medium text-gray-900">
                        ₹{Number(row.total).toLocaleString()}
                        <span className="text-gray-400 font-normal ml-1">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-400 to-accent-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monthly breakdown */}
        {summary && summary.by_month.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {summary.by_month.map((m) => {
                const label = new Date(m.year, m.month - 1).toLocaleDateString("en-IN", {
                  month: "short", year: "2-digit",
                });
                return (
                  <div key={`${m.year}-${m.month}`} className="text-center p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase">{label}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">₹{Number(m.total).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{m.count} expense{m.count !== 1 ? "s" : ""}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {children}
    </>
  );
}

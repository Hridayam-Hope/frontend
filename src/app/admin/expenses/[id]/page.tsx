"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExpensesStore } from "@/lib/stores/expenses";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import ExpenseForm from "@/components/expenses/ExpenseForm";

const PAYMENT_LABELS: Record<string, string> = {
  upi: "UPI", cash: "Cash", bank_transfer: "Bank Transfer",
  cheque: "Cheque", other: "Other",
};

// Status workflow: what transitions are allowed from each state
const NEXT_ACTIONS: Record<string, { label: string; status: string; variant: "primary" | "secondary" | "danger" }[]> = {
  draft: [
    { label: "Submit for Approval", status: "pending_approval", variant: "primary" },
    { label: "Reject", status: "rejected", variant: "danger" },
  ],
  pending_approval: [
    { label: "Approve", status: "approved", variant: "primary" },
    { label: "Back to Draft", status: "draft", variant: "secondary" },
    { label: "Reject", status: "rejected", variant: "danger" },
  ],
  approved: [
    { label: "Mark as Paid", status: "paid", variant: "primary" },
    { label: "Reject", status: "rejected", variant: "danger" },
  ],
  rejected: [
    { label: "Re-open as Draft", status: "draft", variant: "secondary" },
  ],
  paid: [],
};

export default function ExpenseDetailSidebar() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const { expenseCache, detailLoading, fetchExpense, updateExpense, updateStatus, deleteExpense, fetchSummary } =
    useExpensesStore();

  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  const expenseId = parseInt(id, 10);
  const expense = expenseCache[expenseId];

  useEffect(() => {
    if (expenseId) fetchExpense(expenseId);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [expenseId, fetchExpense]);

  useEffect(() => {
    setEditing(false);
    setShowDeleteConfirm(false);
    setShowRejectInput(false);
    setRejectReason("");
  }, [expenseId]);

  const closeSidebar = useCallback(() => {
    setVisible(false);
    setTimeout(() => router.push("/admin/expenses"), 200);
  }, [router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !showDeleteConfirm && !showRejectInput) closeSidebar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSidebar, showDeleteConfirm, showRejectInput]);

  async function handleStatusChange(status: string) {
    if (status === "rejected") {
      setPendingStatus(status);
      setShowRejectInput(true);
      return;
    }
    setStatusLoading(true);
    try {
      await updateStatus(expenseId, status);
      showToast("success", `Expense marked as ${status.replace("_", " ")}`);
      fetchSummary(true);
    } catch (err) {
      handleError(err, "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleRejectConfirm() {
    if (!rejectReason.trim()) return;
    setStatusLoading(true);
    try {
      await updateStatus(expenseId, pendingStatus, rejectReason.trim());
      showToast("success", "Expense rejected");
      setShowRejectInput(false);
      setRejectReason("");
      fetchSummary(true);
    } catch (err) {
      handleError(err, "Failed to reject expense");
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteExpense(expenseId);
      showToast("success", "Expense deleted");
      setVisible(false);
      setTimeout(() => router.push("/admin/expenses"), 200);
    } catch (err) {
      handleError(err, "Failed to delete expense");
      setDeleting(false);
    }
  }

  const nextActions = expense ? (NEXT_ACTIONS[expense.status] ?? []) : [];
  const canEdit = expense && ["draft", "pending_approval"].includes(expense.status);
  const canDelete = expense && ["draft", "rejected"].includes(expense.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-200 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div className="min-w-0">
              {expense ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 truncate">{expense.title}</h2>
                  <p className="text-sm text-gray-500">₹{Number(expense.amount).toLocaleString()} · {expense.category_label}</p>
                </>
              ) : (
                <h2 className="text-lg font-bold text-gray-900">Loading...</h2>
              )}
            </div>
            <button
              onClick={closeSidebar}
              className="ml-4 shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {detailLoading && !expense ? (
              <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : expense ? (
              <div>
                {/* Action bar */}
                <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-gray-50 shrink-0">
                  {canEdit && (
                    <Button variant="secondary" size="sm" onClick={() => setEditing((v) => !v)}>
                      {editing ? "Cancel Edit" : "Edit"}
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                      Delete
                    </Button>
                  )}
                  {nextActions.map((action) => (
                    <Button
                      key={action.status}
                      variant={action.variant}
                      size="sm"
                      loading={statusLoading}
                      onClick={() => handleStatusChange(action.status)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>

                {/* Reject reason input */}
                {showRejectInput && (
                  <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                    <p className="text-sm font-medium text-red-700 mb-2">Rejection reason</p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={2}
                      placeholder="Explain why this expense is being rejected..."
                      className="block w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="danger" loading={statusLoading} onClick={handleRejectConfirm}
                        disabled={!rejectReason.trim()}>
                        Confirm Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setShowRejectInput(false); setRejectReason(""); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {editing ? (
                  <div className="p-6">
                    <ExpenseForm
                      initialData={{
                        title: expense.title,
                        description: expense.description,
                        amount: String(expense.amount),
                        date: expense.date,
                        category: expense.category,
                        payment_method: expense.payment_method,
                        paid_to: expense.paid_to,
                        reference_number: expense.reference_number,
                        receipt_url: expense.receipt_url,
                        is_recurring: expense.is_recurring,
                        recurrence_note: expense.recurrence_note,
                        notes: expense.notes,
                      }}
                      submitLabel="Save Changes"
                      onSubmit={async (data) => {
                        try {
                          await updateExpense(expenseId, data);
                          showToast("success", "Expense updated");
                          setEditing(false);
                        } catch (err) {
                          handleError(err, "Failed to update expense");
                        }
                      }}
                      onCancel={() => setEditing(false)}
                    />
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <StatusBadge status={expense.status} />
                      {expense.is_recurring && (
                        <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                          ↻ Recurring
                        </span>
                      )}
                    </div>

                    {expense.rejection_reason && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
                        <span className="font-medium">Rejection reason: </span>{expense.rejection_reason}
                      </div>
                    )}

                    {/* Expense details */}
                    <Section title="Expense Details">
                      <Row label="Amount" value={`₹${Number(expense.amount).toLocaleString()}`} highlight />
                      <Row label="Date" value={new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
                      <Row label="Category" value={expense.category_label} />
                      <Row label="Payment Method" value={PAYMENT_LABELS[expense.payment_method] || expense.payment_method} />
                      <Row label="Paid To" value={expense.paid_to || "—"} />
                      <Row label="Reference No." value={expense.reference_number || "—"} />
                      {expense.campaign_title && <Row label="Campaign" value={expense.campaign_title} />}
                      {expense.receipt_url && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-500">Receipt</span>
                          <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-brand-600 hover:underline">View Receipt</a>
                        </div>
                      )}
                    </Section>

                    {(expense.description || expense.notes) && (
                      <Section title="Notes">
                        {expense.description && <Row label="Description" value={expense.description} />}
                        {expense.notes && <Row label="Notes" value={expense.notes} />}
                        {expense.is_recurring && expense.recurrence_note && (
                          <Row label="Recurrence" value={expense.recurrence_note} />
                        )}
                      </Section>
                    )}

                    <Section title="Record Info">
                      <Row label="Recorded By" value={expense.recorded_by_email} />
                      {expense.approved_by_email && <Row label="Approved By" value={expense.approved_by_email} />}
                      {expense.approved_at && (
                        <Row label="Approved At" value={new Date(expense.approved_at).toLocaleString("en-IN")} />
                      )}
                      <Row label="Created" value={new Date(expense.created_at).toLocaleString("en-IN")} />
                      <Row label="Last Updated" value={new Date(expense.updated_at).toLocaleString("en-IN")} />
                    </Section>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Delete confirm overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
              <p className="text-sm text-gray-600 mt-2">
                Delete <strong>{expense?.title}</strong>? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className={`text-sm text-right ${highlight ? "text-lg font-bold text-gray-900" : "font-medium text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProgramsStore } from "@/lib/stores/programs";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface QuoteFormData {
  text: string;
  author_name: string;
  author_role: string;
}

export default function ProgramQuotesList({ programId }: { programId: number }) {
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const { programCache, addQuote, updateQuote, deleteQuote } = useProgramsStore();
  const program = programCache[programId];

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<QuoteFormData>({
    text: "",
    author_name: "",
    author_role: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<QuoteFormData>({
    text: "",
    author_name: "",
    author_role: "",
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function resetForm() {
    setForm({ text: "", author_name: "", author_role: "" });
    setShowForm(false);
  }

  async function handleAdd() {
    if (!form.text.trim() || !form.author_name.trim() || !form.author_role.trim()) {
      showToast("error", "All fields are required");
      return;
    }
    setLoading(true);
    try {
      await addQuote(programId, {
        text: form.text.trim(),
        author_name: form.author_name.trim(),
        author_role: form.author_role.trim(),
        order: (program?.quotes?.length ?? 0) + 1,
      });
      showToast("success", "Quote added");
      resetForm();
    } catch (err) {
      handleError(err, "Failed to add quote");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(quoteId: number) {
    if (!editForm.text.trim() || !editForm.author_name.trim() || !editForm.author_role.trim()) {
      showToast("error", "All fields are required");
      return;
    }
    setLoading(true);
    try {
      await updateQuote(programId, quoteId, {
        text: editForm.text.trim(),
        author_name: editForm.author_name.trim(),
        author_role: editForm.author_role.trim(),
      });
      showToast("success", "Quote updated");
      setEditingId(null);
    } catch (err) {
      handleError(err, "Failed to update quote");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(quoteId: number) {
    setDeletingId(quoteId);
    try {
      await deleteQuote(programId, quoteId);
      showToast("success", "Quote deleted");
    } catch (err) {
      handleError(err, "Failed to delete quote");
    } finally {
      setDeletingId(null);
    }
  }

  const quotes = program?.quotes ?? [];

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {quotes.length} {quotes.length === 1 ? "quote" : "quotes"}
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Quote"}
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Quote</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Quote Text</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                rows={3}
                placeholder="The quote text..."
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              />
            </div>
            <Input
              label="Author Name"
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              placeholder="e.g. John Doe"
            />
            <Input
              label="Author Role"
              value={form.author_role}
              onChange={(e) => setForm((f) => ({ ...f, author_role: e.target.value }))}
              placeholder="e.g. Volunteer, Beneficiary"
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button loading={loading} onClick={handleAdd}>
                Add Quote
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {quotes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500">No quotes yet. Add your first quote above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              {editingId === item.id ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Quote Text</label>
                    <textarea
                      value={editForm.text}
                      onChange={(e) => setEditForm((f) => ({ ...f, text: e.target.value }))}
                      rows={3}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                    />
                  </div>
                  <Input
                    label="Author Name"
                    value={editForm.author_name}
                    onChange={(e) => setEditForm((f) => ({ ...f, author_name: e.target.value }))}
                  />
                  <Input
                    label="Author Role"
                    value={editForm.author_role}
                    onChange={(e) => setEditForm((f) => ({ ...f, author_role: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" loading={loading} onClick={() => handleUpdate(item.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <svg className="w-8 h-8 text-brand-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 italic mb-3">{item.text}</p>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{item.author_name}</p>
                        <p className="text-gray-500">{item.author_role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditForm({
                          text: item.text,
                          author_name: item.author_name,
                          author_role: item.author_role,
                        });
                      }}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

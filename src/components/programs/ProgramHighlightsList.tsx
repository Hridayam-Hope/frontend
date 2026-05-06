"use client";

import { useState } from "react";
import { useProgramsStore } from "@/lib/stores/programs";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import Button from "@/components/ui/Button";

export default function ProgramHighlightsList({ programId }: { programId: number }) {
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const { programCache, addHighlight, updateHighlight, deleteHighlight } = useProgramsStore();
  const program = programCache[programId];

  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleAdd() {
    if (!text.trim()) {
      showToast("error", "Highlight text is required");
      return;
    }
    setLoading(true);
    try {
      await addHighlight(programId, {
        text: text.trim(),
        order: (program?.highlights?.length ?? 0) + 1,
      });
      showToast("success", "Highlight added");
      setText("");
      setShowForm(false);
    } catch (err) {
      handleError(err, "Failed to add highlight");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(highlightId: number) {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      await updateHighlight(programId, highlightId, { text: editText.trim() });
      showToast("success", "Highlight updated");
      setEditingId(null);
      setEditText("");
    } catch (err) {
      handleError(err, "Failed to update highlight");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(highlightId: number) {
    setDeletingId(highlightId);
    try {
      await deleteHighlight(programId, highlightId);
      showToast("success", "Highlight deleted");
    } catch (err) {
      handleError(err, "Failed to delete highlight");
    } finally {
      setDeletingId(null);
    }
  }

  const highlights = program?.highlights ?? [];

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {highlights.length} {highlights.length === 1 ? "highlight" : "highlights"}
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Highlight"}
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Highlight</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Highlight Text <span className="text-gray-400">({text.length}/500)</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="e.g. Planted 500+ trees in rural areas"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setShowForm(false); setText(""); }}>
                Cancel
              </Button>
              <Button loading={loading} onClick={handleAdd}>
                Add Highlight
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {highlights.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500">No highlights yet. Add your first highlight above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {highlights.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-semibold">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      maxLength={500}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" loading={loading} onClick={() => handleUpdate(item.id)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-900">{item.text}</p>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditText(item.text);
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

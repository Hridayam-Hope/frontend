"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgramsStore } from "@/lib/stores/programs";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import ProgramForm from "@/components/programs/ProgramForm";
import ProgramMediaManager from "@/components/programs/ProgramMediaManager";
import ProgramHighlightsList from "@/components/programs/ProgramHighlightsList";
import ProgramQuotesList from "@/components/programs/ProgramQuotesList";

type Tab = "basic" | "media" | "highlights" | "quotes";

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const {
    programCache,
    detailLoading,
    fetchProgram,
    updateProgram,
    deleteProgram,
    publishProgram,
    archiveProgram,
  } = useProgramsStore();

  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const programId = parseInt(id, 10);
  const program = programCache[programId];

  useEffect(() => {
    if (programId) fetchProgram(programId);
  }, [programId, fetchProgram]);

  async function handlePublish() {
    setStatusLoading(true);
    try {
      await publishProgram(programId);
      showToast("success", "Program published");
    } catch (err) {
      handleError(err, "Failed to publish program");
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleArchive() {
    setStatusLoading(true);
    try {
      await archiveProgram(programId);
      showToast("success", "Program archived");
    } catch (err) {
      handleError(err, "Failed to archive program");
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProgram(programId);
      showToast("success", "Program deleted");
      router.push("/admin/programs");
    } catch (err) {
      handleError(err, "Failed to delete program");
      setDeleting(false);
    }
  }

  if (detailLoading && !program) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500">Program not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{program.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {program.location} · {new Date(program.event_date).toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={program.status} />
            {program.is_featured && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                ★ Featured
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => router.push("/admin/programs")}>
            ← Back to List
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/programs/${programId}/preview`)}>
            👁 Preview
          </Button>
          {program.status === "draft" && (
            <Button variant="primary" size="sm" loading={statusLoading} onClick={handlePublish}>
              Publish
            </Button>
          )}
          {program.status === "published" && (
            <Button variant="secondary" size="sm" loading={statusLoading} onClick={handleArchive}>
              Archive
            </Button>
          )}
          {program.status === "draft" && (
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "media", label: "Media Gallery" },
            { id: "highlights", label: "Highlights" },
            { id: "quotes", label: "Quotes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "basic" && (
        <ProgramForm
          initialData={{
            title: program.title,
            short_description: program.short_description,
            full_story: program.full_story,
            category_id: String(program.category_id),
            badge_label: program.badge_label,
            location: program.location,
            city: program.city,
            state: program.state,
            event_date: program.event_date,
            volunteers_count: String(program.volunteers_count),
            beneficiaries_count: program.beneficiaries_count ? String(program.beneficiaries_count) : "",
            trees_planted: program.trees_planted ? String(program.trees_planted) : "",
            people_reached: program.people_reached ? String(program.people_reached) : "",
            featured_image: program.featured_image,
            featured_image_alt: program.featured_image_alt,
            status: program.status,
            is_featured: program.is_featured,
            display_order: String(program.display_order),
            meta_title: program.meta_title,
            meta_description: program.meta_description,
          }}
          submitLabel="Save Changes"
          onSubmit={async (data) => {
            try {
              await updateProgram(programId, data);
              showToast("success", "Program updated");
            } catch (err) {
              handleError(err, "Failed to update program");
              throw err;
            }
          }}
          onCancel={() => router.push("/admin/programs")}
        />
      )}

      {activeTab === "media" && <ProgramMediaManager programId={programId} />}
      {activeTab === "highlights" && <ProgramHighlightsList programId={programId} />}
      {activeTab === "quotes" && <ProgramQuotesList programId={programId} />}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-6 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Delete Program</h3>
            <p className="text-sm text-gray-600 mt-2">
              Delete <strong>{program.title}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

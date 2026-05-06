"use client";

import { useState } from "react";
import { useProgramsStore } from "@/lib/stores/programs";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";

interface MediaFormData {
  image_url: string;
  caption: string;
  alt_text: string;
}

export default function ProgramMediaManager({ programId }: { programId: number }) {
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const { programCache, addMedia, deleteMedia, setFeaturedMedia } = useProgramsStore();
  const program = programCache[programId];

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MediaFormData>({
    image_url: "",
    caption: "",
    alt_text: "",
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function resetForm() {
    setForm({ image_url: "", caption: "", alt_text: "" });
    setShowForm(false);
  }

  async function handleAdd() {
    if (!form.image_url.trim() || !form.alt_text.trim()) {
      showToast("error", "Image URL and alt text are required");
      return;
    }
    setLoading(true);
    try {
      await addMedia(programId, {
        image_url: form.image_url.trim(),
        caption: form.caption.trim() || undefined,
        alt_text: form.alt_text.trim(),
        order: (program?.media?.length ?? 0) + 1,
      });
      showToast("success", "Media added");
      resetForm();
    } catch (err) {
      handleError(err, "Failed to add media");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetFeatured(mediaId: number) {
    try {
      await setFeaturedMedia(programId, mediaId);
      showToast("success", "Featured image updated");
    } catch (err) {
      handleError(err, "Failed to set featured image");
    }
  }

  async function handleDelete(mediaId: number) {
    setDeletingId(mediaId);
    try {
      await deleteMedia(programId, mediaId);
      showToast("success", "Media deleted");
    } catch (err) {
      handleError(err, "Failed to delete media");
    } finally {
      setDeletingId(null);
    }
  }

  const media = program?.media ?? [];

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {media.length} {media.length === 1 ? "image" : "images"} in gallery
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Image"}
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Image</h3>
          <div className="space-y-4">
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              label="Upload Image"
              folder="programs/gallery"
              aspectRatio="aspect-video"
            />
            <Input
              label="Alt Text (required)"
              value={form.alt_text}
              onChange={(e) => setForm((f) => ({ ...f, alt_text: e.target.value }))}
              placeholder="Describe the image for accessibility"
            />
            <Input
              label="Caption (optional)"
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              placeholder="Optional caption"
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button loading={loading} onClick={handleAdd}>
                Add Image
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {media.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500">No images yet. Add your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
            >
              <div className="relative aspect-video">
                <img
                  src={item.image_url}
                  alt={item.alt_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ★ Featured
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                {item.caption && (
                  <p className="text-sm text-gray-700 line-clamp-2">{item.caption}</p>
                )}
                <p className="text-xs text-gray-500">{item.alt_text}</p>
                <div className="flex gap-2 pt-2">
                  {!item.is_featured && (
                    <button
                      onClick={() => handleSetFeatured(item.id)}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Set as Featured
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

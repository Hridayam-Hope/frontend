"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { apiUpload } from "@/lib/api/client";

type Variant = "avatar" | "banner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
  /** "avatar" = small circle (default), "banner" = large 16:9 rectangle */
  variant?: Variant;
  /** When true, file selection only shows a local preview; upload happens on "Save Image" click */
  deferred?: boolean;
  /** Hint text below the upload area */
  hint?: string;
}

interface UploadResponse {
  url: string;
  message: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Profile Photo",
  className = "",
  variant = "avatar",
  deferred = false,
  hint,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(value || null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview when value changes externally
  useEffect(() => {
    if (value && !pendingFile) setPreview(value);
  }, [value, pendingFile]);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return "Only JPEG, PNG, and WebP images are allowed";
    if (file.size > 5 * 1024 * 1024) return "Image must be under 5MB";
    return null;
  };

  const doUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const result = await apiUpload<UploadResponse>("/upload/image", file, { folder });
      setPreview(result.url);
      onChange(result.url);
      setPendingFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError("");

    if (deferred) {
      setPendingFile(file);
    } else {
      await doUpload(file);
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleSave = async () => {
    if (!pendingFile) return;
    await doUpload(pendingFile);
  };

  const handleRemove = () => {
    if (pendingFile && preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPendingFile(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isBanner = variant === "banner";

  // ── Avatar variant (original small circle) ──
  if (!isBanner) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} className="hidden" disabled={uploading} />
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {uploading ? "Uploading…" : preview ? "Change" : "Upload"}
            </button>
            {deferred && pendingFile && !uploading && (
              <button type="button" onClick={handleSave} className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:from-brand-600 hover:to-accent-600 transition-colors">
                Save Image
              </button>
            )}
            {preview && !uploading && (
              <button type="button" onClick={handleRemove} className="text-xs text-red-500 hover:text-red-700 transition-colors text-left">Remove</button>
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }

  // ── Banner variant (large 16:9 rectangle) ──
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} className="hidden" disabled={uploading} />

      {preview ? (
        <div className="relative w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50" style={{ aspectRatio: "16/9" }}>
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-white border-t-transparent" />
              <span className="text-sm text-white font-medium">Uploading…</span>
            </div>
          )}
          {/* Overlay controls */}
          {!uploading && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end justify-between">
              <div className="flex gap-2">
                <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-gray-800 shadow hover:bg-white transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Change
                </button>
                <button type="button" onClick={handleRemove} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-600 transition-colors">
                  Remove
                </button>
              </div>
              {deferred && pendingFile && (
                <button type="button" onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-brand-600 hover:to-accent-600 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Save Image
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-brand-300 transition-colors cursor-pointer"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
            <svg className="h-7 w-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Click to upload image</p>
            <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG or WebP · Max 5MB</p>
          </div>
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

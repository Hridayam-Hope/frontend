"use client";

import { useState, useRef } from "react";
import { Upload, X, Check } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/lib/api/uploads";
import Button from "./Button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  aspectRatio?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  folder = "programs",
  aspectRatio = "aspect-video",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndPreviewFile(file: File) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setPreviewFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function handleUpload() {
    if (!previewFile) return;

    setUploading(true);
    try {
      const response = await uploadImage(previewFile, folder);
      onChange(response.url || response.path);
      setPreviewFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndPreviewFile(file);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) validateAndPreviewFile(file);
  }

  function handleRemove() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleCancelPreview() {
    setPreviewFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {value ? (
        // Uploaded image
        <div className="relative">
          <div className={`relative w-full ${aspectRatio} rounded-lg overflow-hidden border border-gray-200`}>
            <Image src={value} alt="Uploaded" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
      ) : previewUrl ? (
        // Preview before upload
        <div className="space-y-3">
          <div className={`relative w-full ${aspectRatio} rounded-lg overflow-hidden border-2 border-brand-400`}>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              loading={uploading}
              className="flex-1"
            >
              <Check size={16} className="mr-1" />
              Upload Image
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleCancelPreview}
              disabled={uploading}
            >
              <X size={16} className="mr-1" />
              Cancel
            </Button>
          </div>
          <p className="text-xs text-gray-600">
            Preview your image before uploading. Click "Upload Image" to confirm.
          </p>
        </div>
      ) : (
        // Upload area
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-brand-500 bg-brand-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload size={24} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop image here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

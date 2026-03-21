import type { UploadAssetResponse } from "@/types/api";

import { apiUpload } from "./client";

export async function uploadImage(file: File, folder = "general") {
  return apiUpload<UploadAssetResponse>("/upload/image", file, { folder });
}

export async function uploadDocument(file: File, folder = "documents") {
  return apiUpload<UploadAssetResponse>("/upload/document", file, { folder });
}

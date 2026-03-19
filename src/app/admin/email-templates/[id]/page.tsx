"use client";

import { useParams, useRouter } from "next/navigation";

import EmailTemplateEditor from "@/components/admin/EmailTemplateEditor";

export default function EmailTemplateDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const templateId = Number(params.id);

  if (!Number.isFinite(templateId) || templateId <= 0) {
    return (
      <div className="max-w-3xl">
        <button
          onClick={() => router.push("/admin/email-templates")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Email Templates
        </button>
        <p className="text-sm text-gray-600">Invalid template id.</p>
      </div>
    );
  }

  return <EmailTemplateEditor templateId={templateId} />;
}

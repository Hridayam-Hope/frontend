"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import DataTable, { type Column } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplateLogs,
  getTemplateVersions,
  previewTemplate,
  testSendTemplate,
  updateTemplate,
} from "@/lib/api/newsletter";
import type {
  EmailLogListItem,
  EmailTemplateDetail,
  EmailTemplateVersionItem,
  TemplatePreviewResponse,
} from "@/types/api";

type FormState = {
  slug: string;
  name: string;
  description: string;
  category: string;
  subject_template: string;
  html_content: string;
  text_content: string;
  variables: string;
  required_variables: string;
  sample_context: string;
  is_active: boolean;
};

const defaultFormState: FormState = {
  slug: "",
  name: "",
  description: "",
  category: "custom",
  subject_template: "",
  html_content: "",
  text_content: "",
  variables: "",
  required_variables: "",
  sample_context:
    '{\n  "volunteer_name": "William",\n  "skills": ["Teaching"],\n  "opportunities_url": "https://hridayamhopefoundation.com/join-us"\n}',
  is_active: true,
};

function parseCSVList(input: string): string[] {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

interface EmailTemplateEditorProps {
  templateId?: number;
}

export default function EmailTemplateEditor({ templateId }: EmailTemplateEditorProps) {
  const router = useRouter();
  const isEditMode = typeof templateId === "number";

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [message, setMessage] = useState("");
  const [templateDetail, setTemplateDetail] = useState<EmailTemplateDetail | null>(null);
  const [preview, setPreview] = useState<TemplatePreviewResponse | null>(null);

  const [versions, setVersions] = useState<EmailTemplateVersionItem[]>([]);
  const [logs, setLogs] = useState<EmailLogListItem[]>([]);
  const [logPage, setLogPage] = useState(1);
  const [logTotal, setLogTotal] = useState(0);
  const [logTotalPages, setLogTotalPages] = useState(0);

  const title = useMemo(
    () => (isEditMode ? "Edit Email Template" : "Create Email Template"),
    [isEditMode]
  );

  const loadTemplateDetail = async (id: number) => {
    const detail = await getTemplate(id);
    setTemplateDetail(detail);
    setForm({
      slug: detail.slug,
      name: detail.name,
      description: detail.description,
      category: detail.category,
      subject_template: detail.subject_template,
      html_content: detail.html_content,
      text_content: detail.text_content,
      variables: detail.variables.join(", "),
      required_variables: detail.required_variables.join(", "),
      sample_context: JSON.stringify(detail.sample_context, null, 2),
      is_active: detail.is_active,
    });
  };

  const loadTemplateMeta = async (id: number, page = 1) => {
    const [versionData, logData] = await Promise.all([
      getTemplateVersions(id),
      getTemplateLogs(id, { page, page_size: 10 }),
    ]);

    setVersions(versionData);
    setLogs(logData.items);
    setLogPage(logData.page);
    setLogTotal(logData.total);
    setLogTotalPages(logData.total_pages);
  };

  useEffect(() => {
    if (!isEditMode || !templateId) {
      return;
    }

    (async () => {
      setLoading(true);
      try {
        await loadTemplateDetail(templateId);
        await loadTemplateMeta(templateId, 1);
      } catch (error) {
        setMessage(getErrorMessage(error, "Failed to load template details"));
      } finally {
        setLoading(false);
      }
    })();
  }, [isEditMode, templateId]);

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = () => {
    const parsedContext = JSON.parse(form.sample_context || "{}");

    return {
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description,
      category: form.category,
      subject_template: form.subject_template,
      html_content: form.html_content,
      text_content: form.text_content,
      variables: parseCSVList(form.variables),
      required_variables: parseCSVList(form.required_variables),
      sample_context: parsedContext,
      is_active: form.is_active,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    let payload: ReturnType<typeof buildPayload>;
    try {
      payload = buildPayload();
    } catch {
      setSaving(false);
      setMessage("Sample context must be valid JSON");
      return;
    }

    try {
      if (!isEditMode || !templateId) {
        const created = await createTemplate(payload);
        setMessage("Template created");
        router.push(`/admin/email-templates/${created.id}`);
        return;
      }

      await updateTemplate(templateId, payload);
      setMessage("Template updated");
      setPreview(null);
      await loadTemplateDetail(templateId);
      await loadTemplateMeta(templateId, 1);
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to save template"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!templateDetail || !templateId) {
      return;
    }

    if (templateDetail.is_predefined) {
      setMessage("Predefined templates cannot be deleted");
      return;
    }

    const confirmed = window.confirm(
      `Delete template \"${templateDetail.name}\"? This cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteTemplate(templateId);
      router.push("/admin/email-templates");
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to delete template"));
    }
  };

  const handlePreview = async () => {
    if (!templateId) {
      setMessage("Save the template first, then preview.");
      return;
    }

    try {
      const context = JSON.parse(form.sample_context || "{}");
      const result = await previewTemplate(templateId, context);
      setPreview(result);
      setMessage("Preview generated");
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to generate preview"));
    }
  };

  const handleTestSend = async () => {
    if (!templateId) {
      setMessage("Save the template first, then run test send.");
      return;
    }

    const email = window.prompt("Send test email to:", "admin@hridayam.com")?.trim();
    if (!email) {
      return;
    }

    try {
      const res = await testSendTemplate(templateId, email);
      setMessage(res.message);
      await loadTemplateMeta(templateId, logPage);
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to send test email"));
      await loadTemplateMeta(templateId, logPage);
    }
  };

  const versionColumns: Column<EmailTemplateVersionItem>[] = [
    { key: "version_number", label: "Version" },
    { key: "subject_template", label: "Subject" },
    { key: "change_note", label: "Change Note" },
    {
      key: "created_at",
      label: "Created",
      render: (item) => new Date(item.created_at).toLocaleString(),
    },
  ];

  const logColumns: Column<EmailLogListItem>[] = [
    { key: "to_email", label: "To" },
    { key: "subject", label: "Subject" },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "sent_at",
      label: "Sent",
      render: (item) => (item.sent_at ? new Date(item.sent_at).toLocaleString() : "-"),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <button
        onClick={() => router.push("/admin/email-templates")}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
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

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode ? "Review, update and test this template." : "Build a reusable transactional email template."}
          </p>
          {templateDetail?.storage_key && (
            <p className="text-xs font-mono text-gray-400 mt-1">
              File-Backed: {templateDetail.storage_key}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditMode && (
            <Button variant="secondary" onClick={handlePreview}>
              Preview
            </Button>
          )}
          {isEditMode && (
            <Button variant="secondary" onClick={handleTestSend}>
              Test Send
            </Button>
          )}
          <Button onClick={handleSave} loading={saving}>
            {isEditMode ? "Save Changes" : "Create Template"}
          </Button>
          {isEditMode && (
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={templateDetail?.is_predefined}
              title={templateDetail?.is_predefined ? "Predefined templates cannot be deleted" : "Delete template"}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm text-gray-700">
            Slug
            <input
              value={form.slug}
              onChange={(e) => onChange("slug", e.target.value)}
              disabled={templateDetail?.is_predefined}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </label>

          <label className="text-sm text-gray-700">
            Name
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              disabled={templateDetail?.is_predefined}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </label>

          <label className="text-sm text-gray-700">
            Category
            <select
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
              disabled={templateDetail?.is_predefined}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500"
            >
              {["campaign", "donation", "digest", "update", "event", "volunteer", "transactional", "custom"].map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="text-sm text-gray-700 flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => onChange("is_active", e.target.checked)}
            />
            Active Template
          </label>
        </div>

        <label className="block text-sm text-gray-700">
          Description
          <textarea
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm text-gray-700">
          Subject Template
          <input
            value={form.subject_template}
            onChange={(e) => onChange("subject_template", e.target.value)}
            disabled={templateDetail?.is_predefined}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm text-gray-700">
            Variables (comma-separated)
            <input
              value={form.variables}
              onChange={(e) => onChange("variables", e.target.value)}
              disabled={templateDetail?.is_predefined}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </label>

          <label className="block text-sm text-gray-700">
            Required Variables (comma-separated)
            <input
              value={form.required_variables}
              onChange={(e) => onChange("required_variables", e.target.value)}
              disabled={templateDetail?.is_predefined}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </label>
        </div>

        <label className="block text-sm text-gray-700">
          HTML Content
          <textarea
            value={form.html_content}
            onChange={(e) => onChange("html_content", e.target.value)}
            rows={12}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
          />
        </label>

        <label className="block text-sm text-gray-700">
          Text Content
          <textarea
            value={form.text_content}
            onChange={(e) => onChange("text_content", e.target.value)}
            rows={7}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
          />
        </label>

        <label className="block text-sm text-gray-700">
          Sample Context (JSON)
          <textarea
            value={form.sample_context}
            onChange={(e) => onChange("sample_context", e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
          />
        </label>
      </div>

      {preview && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
          <p className="text-sm text-gray-700">
            <strong>Subject:</strong> {preview.subject}
          </p>
          <div className="rounded-lg border border-gray-200 p-4">
            <div dangerouslySetInnerHTML={{ __html: preview.html_body }} />
          </div>
          <details>
            <summary className="cursor-pointer text-sm text-gray-600">View text body</summary>
            <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 whitespace-pre-wrap">
              {preview.text_body}
            </pre>
          </details>
        </div>
      )}

      {isEditMode && templateId && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Version History</h3>
            <DataTable columns={versionColumns} data={versions} emptyMessage="No versions found" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Send Logs</h3>
            <DataTable columns={logColumns} data={logs} emptyMessage="No logs found" />
            <Pagination
              page={logPage}
              totalPages={logTotalPages}
              total={logTotal}
              onPageChange={async (nextPage) => {
                await loadTemplateMeta(templateId, nextPage);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

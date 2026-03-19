"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DataTable, { type Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { getTemplates } from "@/lib/api/newsletter";
import type { EmailTemplateListItem } from "@/types/api";

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTemplates = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch {
      setMessage("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const columns: Column<EmailTemplateListItem>[] = [
    { key: "name", label: "Template" },
    { key: "slug", label: "Slug" },
    { key: "category", label: "Category" },
    {
      key: "is_active",
      label: "Status",
      render: (item) => <StatusBadge status={item.is_active ? "active" : "inactive"} />,
    },
    { key: "times_sent", label: "Sent" },
    {
      key: "last_sent_at",
      label: "Last Sent",
      render: (item) => (item.last_sent_at ? new Date(item.last_sent_at).toLocaleString() : "-"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-500 mt-1">
            Manage reusable transactional email templates in a dedicated section.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadTemplates}>
            Refresh
          </Button>
          <Button onClick={() => router.push("/admin/email-templates/new")}>New Template</Button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={templates}
        loading={loading}
        onRowClick={(item) => router.push(`/admin/email-templates/${item.id}`)}
        emptyMessage="No templates found"
      />
    </div>
  );
}

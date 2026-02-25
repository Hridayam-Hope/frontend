"use client";

import { useEffect, useState } from "react";
import { getTemplates } from "@/lib/api/newsletter";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
      <p className="text-gray-500 mt-1">{templates.length} templates</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">{t.name}</h3>
              <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                {t.category}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{t.description}</p>
          </div>
        ))}

        {templates.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full text-center py-8">No templates found</p>
        )}
      </div>
    </div>
  );
}

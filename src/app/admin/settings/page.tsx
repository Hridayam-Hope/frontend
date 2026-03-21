"use client";

import Link from "next/link";

const cards = [
  {
    title: "Newsletter Settings",
    description: "Manage global email branding, contact details, social links, and unsubscribe URL pattern.",
    href: "/admin/settings/newsletter",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Centralized admin settings. More modules can be added here over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-5 hover:border-brand-300 hover:shadow-sm transition-all"
          >
            <h2 className="text-base font-semibold text-gray-900">{card.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{card.description}</p>
            <span className="inline-block mt-4 text-sm font-medium text-brand-600">Open settings</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

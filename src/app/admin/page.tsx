"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardSummary } from "@/types/api";
import { getDashboardSummary } from "@/lib/api/dashboard";

/* ────────────────── Tiny SVG chart components ────────────────── */

function DonutChart({
  segments,
  size = 160,
  stroke = 22,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circ;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-700"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          );
          offset += dash;
          return el;
        })}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold fill-gray-800">
          {total}
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-gray-600">{seg.label}</span>
            <span className="font-semibold text-gray-800 ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressCard({
  title,
  target,
  achieved,
  unit,
  currency,
}: {
  title: string;
  target: number;
  achieved: number;
  unit: string;
  currency: string;
}) {
  const pct = target > 0 ? Math.min((achieved / target) * 100, 100) : 0;
  const fmt = (v: number) =>
    unit === "money" ? `${currency === "INR" ? "₹" : "$"}${v.toLocaleString()}` : v.toLocaleString();
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm font-medium text-gray-700 truncate mb-2">{title}</p>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{fmt(achieved)} raised</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

/* ────────────────── Activity helpers ────────────────── */

const actionColors: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  payment: "bg-amber-100 text-amber-700",
  approve: "bg-green-100 text-green-700",
  reject: "bg-rose-100 text-rose-700",
  deactivate: "bg-gray-200 text-gray-600",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ────────────────── Main page ────────────────── */

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Failed to load dashboard data</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-sm text-brand-500 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  const { campaigns, donations, inkind, volunteers, opportunities, members, subscribers, top_campaigns, recent_activity } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Hridayam Hope Foundation — Admin Overview</p>
      </div>

      {/* ─── Hero Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <HeroStat
          label="Total Raised"
          value={`₹${donations.total_amount.toLocaleString()}`}
          sub={`${donations.completed} completed donations`}
          gradient="from-emerald-500 to-teal-400"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          }
        />
        <HeroStat
          label="Active Campaigns"
          value={campaigns.active}
          sub={`${campaigns.total} total campaigns`}
          gradient="from-brand-500 to-brand-400"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          }
        />
        <HeroStat
          label="Active Volunteers"
          value={volunteers.active}
          sub={`${volunteers.total_hours.toLocaleString()} total hours`}
          gradient="from-accent-500 to-blue-400"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          }
        />
        <HeroStat
          label="Subscribers"
          value={subscribers.active}
          sub={`${subscribers.total} total`}
          gradient="from-amber-500 to-orange-400"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          }
        />
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Status Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5">Campaign Status</h3>
          <DonutChart
            segments={[
              { value: campaigns.active, color: "#10b981", label: "Active" },
              { value: campaigns.draft, color: "#94a3b8", label: "Draft" },
              { value: campaigns.paused, color: "#f59e0b", label: "Paused" },
              { value: campaigns.completed, color: "#3b82f6", label: "Completed" },
            ]}
          />
        </div>

        {/* Donation Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5">Donations Breakdown</h3>
          <HBar
            items={[
              { label: "Completed", value: donations.completed, color: "#10b981" },
              { label: "Pending", value: donations.pending, color: "#f59e0b" },
              { label: "Failed", value: donations.failed, color: "#ef4444" },
            ]}
          />
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">₹{donations.total_amount.toLocaleString()}</span>
            <span className="text-sm text-gray-500">total collected</span>
          </div>
        </div>
      </div>

      {/* ─── Middle Row: In-Kind + Quick Stats ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In-Kind Pipeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5">In-Kind Pipeline</h3>
          <DonutChart
            size={130}
            stroke={18}
            segments={[
              { value: inkind.pending, color: "#f59e0b", label: "Pending" },
              { value: inkind.verified, color: "#3b82f6", label: "Verified" },
              { value: inkind.donated, color: "#10b981", label: "Donated" },
            ]}
          />
          <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
            Estimated value: <span className="font-semibold text-gray-800">₹{inkind.total_value.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-5">Quick Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MiniStat label="Members" value={members.active} total={members.total} color="text-purple-600" />
            <MiniStat label="Opportunities" value={opportunities.open} total={opportunities.total} color="text-brand-600" suffix="open" />
            <MiniStat label="Vol. Apps" value={volunteers.pending_applications} color="text-amber-600" suffix="pending" />
            <MiniStat label="Vol. Hours" value={volunteers.total_hours} color="text-accent-600" />
          </div>
        </div>
      </div>

      {/* ─── Bottom Row: Campaign Progress + Activity Feed ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Campaigns */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-800">Active Campaigns Progress</h3>
            <Link href="/admin/campaigns" className="text-xs text-brand-500 hover:underline">
              View all →
            </Link>
          </div>
          {top_campaigns.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No active campaigns</p>
          ) : (
            <div className="space-y-4">
              {top_campaigns.map((c) => (
                <Link key={c.id} href={`/admin/campaigns/${c.id}`}>
                  <ProgressCard
                    title={c.title}
                    target={c.target_value}
                    achieved={c.achieved_value}
                    unit={c.target_unit}
                    currency={c.target_currency}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
            <Link href="/admin/audit" className="text-xs text-brand-500 hover:underline">
              View all →
            </Link>
          </div>
          {recent_activity.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No recent activity</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {recent_activity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 group">
                  <span
                    className={`mt-0.5 px-2 py-0.5 rounded text-xs font-medium capitalize shrink-0 ${
                      actionColors[log.action] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {log.action}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 truncate">
                      <span className="font-medium">{log.entity_name || log.entity_type}</span>
                      {log.description && (
                        <span className="text-gray-400"> — {log.description}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {log.user_email} · {timeAgo(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Sub-components ────────────────── */

function HeroStat({
  label,
  value,
  sub,
  gradient,
  icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  total,
  color,
  suffix,
}: {
  label: string;
  value: number;
  total?: number;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="text-center p-3 rounded-xl bg-gray-50">
      <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">
        {suffix ? suffix : total !== undefined ? `of ${total}` : ""} {label.toLowerCase()}
      </p>
    </div>
  );
}

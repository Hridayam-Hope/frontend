"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { DashboardSummary } from "@/types/api";
import { getDashboardSummary } from "@/lib/api/dashboard";

import { DonutChart, HBar } from "@/components/dashboard/Charts";
import { HeroStat, MiniStat } from "@/components/dashboard/StatCards";
import { CampaignProgressSection } from "@/components/dashboard/CampaignProgress";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  HeroStatSkeleton,
  ChartCardSkeleton,
  SkeletonText,
} from "@/components/dashboard/Skeletons";

const REFRESH_INTERVAL = 120; // seconds

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(false);
    try {
      const result = await getDashboardSummary();
      setData(result);
      setCountdown(REFRESH_INTERVAL);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { load(true); return REFRESH_INTERVAL; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [load]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Hridayam Hope Foundation - Admin Overview</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 shrink-0">
          {data && <span>Updated {timeAgo(data.cached_at)}</span>}
          <button
            onClick={() => load(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh in {countdown}s
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center justify-between">
          <span>Failed to load dashboard data.</span>
          <button onClick={() => load()} className="font-medium underline ml-2">Retry</button>
        </div>
      )}

      {/* ─── Hero Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading || !data ? (
          [1, 2, 3, 4].map((i) => <HeroStatSkeleton key={i} />)
        ) : (
          <>
            <HeroStat
              label="Total Raised"
              value={`₹${data.donations.total_amount.toLocaleString()}`}
              sub={`avg ₹${parseFloat(data.donations.average_amount.toFixed(2)).toLocaleString()} · ${data.donations.completed} donations`}
              gradient="from-emerald-500 to-teal-400"
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
            <HeroStat
              label="Active Campaigns"
              value={data.campaigns.active}
              sub={`${data.campaigns.total} total campaigns`}
              gradient="from-brand-500 to-brand-400"
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />}
            />
            <HeroStat
              label="Active Volunteers"
              value={data.volunteers.active}
              sub={`${data.volunteers.total_hours.toLocaleString()} total hours logged`}
              gradient="from-accent-500 to-blue-400"
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />}
            />
            <HeroStat
              label="Subscribers"
              value={data.subscribers.active}
              sub={`${data.subscribers.total} total · ${data.leadership.active} leadership`}
              gradient="from-amber-500 to-orange-400"
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />}
            />
          </>
        )}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading || !data ? (
          [1, 2].map((i) => <ChartCardSkeleton key={i} />)
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-5">Campaign Status</h3>
              <DonutChart
                segments={[
                  { value: data.campaigns.active, color: "#10b981", label: "Active" },
                  { value: data.campaigns.draft, color: "#94a3b8", label: "Draft" },
                  { value: data.campaigns.paused, color: "#f59e0b", label: "Paused" },
                  { value: data.campaigns.completed, color: "#3b82f6", label: "Completed" },
                ]}
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-5">Donations Breakdown</h3>
              <HBar
                items={[
                  { label: "Completed", value: data.donations.completed, color: "#10b981" },
                  { label: "Pending", value: data.donations.pending, color: "#f59e0b" },
                  { label: "Failed", value: data.donations.failed, color: "#ef4444" },
                ]}
              />
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">₹{data.donations.total_amount.toLocaleString()}</span>
                <span className="text-sm text-gray-500">total collected</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Middle Row: In-Kind + Quick Overview ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading || !data ? (
          <>
            <ChartCardSkeleton />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
              <SkeletonText className="h-4 w-36 mb-5" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 text-center">
                    <div className="h-8 w-16 mx-auto animate-pulse bg-gray-200 rounded" />
                    <div className="h-3 w-20 mx-auto animate-pulse bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-5">In-Kind Pipeline</h3>
              <DonutChart
                size={130}
                stroke={18}
                segments={[
                  { value: data.inkind.pending, color: "#f59e0b", label: "Pending" },
                  { value: data.inkind.verified, color: "#3b82f6", label: "Verified" },
                  { value: data.inkind.donated, color: "#10b981", label: "Donated" },
                ]}
              />
              <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                Est. value: <span className="font-semibold text-gray-800">₹{data.inkind.total_value.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-800 mb-5">Quick Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MiniStat label="Leadership" value={data.leadership.active} total={data.leadership.total} color="text-purple-600" />
                <MiniStat label="Opportunities" value={data.opportunities.open} total={data.opportunities.total} color="text-brand-600" suffix="open" />
                <MiniStat label="Vol. Apps" value={data.volunteers.pending_applications} color="text-amber-600" suffix="pending" />
                <MiniStat label="Vol. Hours" value={Math.round(data.volunteers.total_hours)} color="text-accent-600" />
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "New Campaign", href: "/admin/campaigns/new" },
                  { label: "View Donations", href: "/admin/donations" },
                  { label: "Volunteers", href: "/admin/volunteers" },
                  { label: "Audit Logs", href: "/admin/audit" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-center text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg py-2 px-3 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Bottom Row: Campaign Progress + Activity Feed ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignProgressSection campaigns={data?.top_campaigns ?? null} loading={loading} />
        <ActivityFeed logs={data?.recent_activity ?? null} loading={loading} />
      </div>
    </div>
  );
}
/** Recent audit activity feed. */

import Link from "next/link";
import type { DashboardSummary } from "@/types/api";
import { ActivityItemSkeleton } from "./Skeletons";

type ActivityLog = DashboardSummary["recent_activity"][number];

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  payment: "bg-amber-100 text-amber-700",
  status_change: "bg-purple-100 text-purple-700",
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
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ActivityFeed({
  logs,
  loading,
}: {
  logs: ActivityLog[] | null;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
        <Link href="/admin/audit" className="text-xs text-brand-500 hover:underline">
          View all →
        </Link>
      </div>

      {loading || !logs ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <ActivityItemSkeleton key={i} />)}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No recent activity</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <span
                className={`mt-0.5 px-2 py-0.5 rounded text-xs font-medium capitalize shrink-0 ${
                  ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {log.action.replace("_", " ")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 truncate">
                  <span className="font-medium">{log.entity_name || log.entity_type}</span>
                  {log.description && (
                    <span className="text-gray-400"> - {log.description}</span>
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
  );
}

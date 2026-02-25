/** Campaign progress cards for active fundraisers. */

import Link from "next/link";
import type { DashboardSummary } from "@/types/api";
import { ProgressCardSkeleton } from "./Skeletons";

type TopCampaign = DashboardSummary["top_campaigns"][number];

function ProgressCard({ c }: { c: TopCampaign }) {
  const isMoney = c.target_unit === "money";
  const symbol = c.target_currency === "INR" ? "₹" : "$";
  const fmt = (v: number) =>
    isMoney ? `${symbol}${v.toLocaleString()}` : v.toLocaleString();

  const overFunded = c.progress > 100;
  const barPct = Math.min(c.progress, 100);

  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
      <p className="text-sm font-medium text-gray-700 truncate mb-2">{c.title}</p>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            overFunded
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-brand-400 to-accent-400"
          }`}
          style={{ width: `${barPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span className={overFunded ? "text-emerald-600 font-medium" : ""}>
          {fmt(c.achieved_value)} raised
          {overFunded && (
            <span className="ml-1 text-emerald-500 font-semibold">Goal Met!</span>
          )}
        </span>
        <span className={overFunded ? "text-emerald-600 font-semibold" : ""}>
          {c.progress}%
        </span>
      </div>
    </div>
  );
}

export function CampaignProgressSection({
  campaigns,
  loading,
}: {
  campaigns: TopCampaign[] | null;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-800">Active Campaigns Progress</h3>
        <Link href="/admin/campaigns" className="text-xs text-brand-500 hover:underline">
          View all →
        </Link>
      </div>

      {loading || !campaigns ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <ProgressCardSkeleton key={i} />)}
        </div>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No active campaigns</p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/admin/campaigns/${c.id}`}>
              <ProgressCard c={c} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

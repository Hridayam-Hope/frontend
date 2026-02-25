"use client";

import { useEffect } from "react";
import { useDonationsStore } from "@/lib/stores/donations";
import { useInKindStore } from "@/lib/stores/inkind";
import { useNewsletterStore } from "@/lib/stores/newsletter";
import { useAuditStore } from "@/lib/stores/audit";
import StatCard from "@/components/ui/StatCard";

export default function AdminDashboard() {
  const { stats: donationStats, fetchStats: fetchDonationStats } = useDonationsStore();
  const { stats: inkindStats, fetchStats: fetchInKindStats } = useInKindStore();
  const { stats: nlStats, fetchStats: fetchNlStats } = useNewsletterStore();
  const { stats: auditStats, fetchStats: fetchAuditStats } = useAuditStore();

  useEffect(() => {
    fetchDonationStats();
    fetchInKindStats();
    fetchNlStats();
    fetchAuditStats();
  }, [fetchDonationStats, fetchInKindStats, fetchNlStats, fetchAuditStats]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 mt-1">Welcome to Hridayam Hope Foundation Admin Portal</p>

      {/* Donation Stats */}
      <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Donations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Donations"
          value={donationStats?.total_donations ?? "—"}
          color="from-brand-400 to-brand-500"
        />
        <StatCard
          label="Total Amount"
          value={donationStats?.total_amount ? `₹${donationStats.total_amount.toLocaleString()}` : "—"}
          color="from-accent-400 to-accent-500"
        />
        <StatCard
          label="Completed"
          value={donationStats?.completed_donations ?? "—"}
          color="from-emerald-400 to-emerald-500"
        />
        <StatCard
          label="Average Donation"
          value={donationStats?.average_donation ? `₹${donationStats.average_donation.toLocaleString()}` : "—"}
          color="from-amber-400 to-amber-500"
        />
      </div>

      {/* In-Kind Stats */}
      <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">In-Kind Donations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total" value={inkindStats?.total_donations ?? "—"} color="from-brand-400 to-brand-500" />
        <StatCard label="Pending" value={inkindStats?.pending_donations ?? "—"} color="from-amber-400 to-amber-500" />
        <StatCard label="Donated" value={inkindStats?.donated_donations ?? "—"} color="from-emerald-400 to-emerald-500" />
        <StatCard
          label="Estimated Value"
          value={inkindStats?.total_estimated_value ? `₹${inkindStats.total_estimated_value.toLocaleString()}` : "—"}
          color="from-accent-400 to-accent-500"
        />
      </div>

      {/* Newsletter Stats */}
      <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Newsletter</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Subscribers" value={nlStats?.total_subscribers ?? "—"} color="from-brand-400 to-brand-500" />
        <StatCard label="Active Subscribers" value={nlStats?.active_subscribers ?? "—"} color="from-emerald-400 to-emerald-500" />
        <StatCard label="Newsletters Sent" value={nlStats?.sent_newsletters ?? "—"} color="from-accent-400 to-accent-500" />
        <StatCard
          label="Open Rate"
          value={nlStats?.open_rate ? `${(nlStats.open_rate * 100).toFixed(1)}%` : "—"}
          color="from-amber-400 to-amber-500"
        />
      </div>

      {/* Activity Overview */}
      <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Activity</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Actions (24h)" value={auditStats?.logs_24h ?? "—"} color="from-brand-400 to-accent-400" />
        <StatCard label="Actions (7d)" value={auditStats?.logs_7d ?? "—"} color="from-accent-400 to-accent-500" />
        <StatCard label="Actions (30d)" value={auditStats?.logs_30d ?? "—"} color="from-brand-500 to-brand-600" />
      </div>
    </div>
  );
}

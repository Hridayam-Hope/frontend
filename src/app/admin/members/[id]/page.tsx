"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMembersStore } from "@/lib/stores/members";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { MemberDetail } from "@/types/api";

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetchMember, deactivateMember, detailLoading, memberCache } = useMembersStore();
  const [member, setMember] = useState<MemberDetail | null>(null);

  useEffect(() => {
    if (id) {
      const numId = Number(id);
      if (memberCache[numId]) setMember(memberCache[numId]);
      fetchMember(numId).then(setMember).catch(() => {});
    }
  }, [id, fetchMember, memberCache]);

  if (detailLoading && !member) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) return <p className="p-6 text-gray-500">Member not found</p>;

  const handleDeactivate = async () => {
    if (confirm("Are you sure you want to deactivate this member?")) {
      await deactivateMember(member.id);
      router.push("/admin/members");
    }
  };

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Members
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {member.profile_photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.profile_photo}
                alt={member.full_name}
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-brand-400 to-accent-400 flex items-center justify-center text-white text-xl font-bold">
                {member.full_name.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{member.full_name}</h1>
              <p className="text-gray-500">{member.position} • {member.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={member.is_active ? "active" : "inactive"} />
            <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/members/${member.id}/edit`)}>
              Edit
            </Button>
            {member.is_active && (
              <Button variant="danger" size="sm" onClick={handleDeactivate}>Deactivate</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Email", value: member.email },
            { label: "Phone", value: member.phone || "-" },
            { label: "Role", value: member.role },
            { label: "Position", value: member.position },
            { label: "Tenure", value: `${member.tenure_years} years` },
            { label: "Joined", value: new Date(member.joined_date).toLocaleDateString() },
            { label: "Tenure End", value: member.tenure_end_date ? new Date(member.tenure_end_date).toLocaleDateString() : "-" },
            { label: "Display Order", value: member.display_order },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {member.bio && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Bio</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{member.bio}</p>
          </div>
        )}

        {member.responsibilities && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Responsibilities</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{member.responsibilities}</p>
          </div>
        )}

        {member.linkedin_url && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-500 hover:underline">
              LinkedIn Profile →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

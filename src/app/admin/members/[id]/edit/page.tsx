"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMembersStore } from "@/lib/stores/members";
import MemberForm, { type MemberFormData } from "@/components/admin/MemberForm";
import type { MemberDetail } from "@/types/api";

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetchMember, updateMember, memberCache, detailLoading } = useMembersStore();
  const [member, setMember] = useState<MemberDetail | null>(null);

  useEffect(() => {
    if (id) {
      const numId = Number(id);
      if (memberCache[numId]) setMember(memberCache[numId]);
      fetchMember(numId).then(setMember).catch(() => {});
    }
  }, [id, fetchMember, memberCache]);

  const handleSubmit = async (data: MemberFormData) => {
    const payload: Record<string, unknown> = { ...data };
    if (!data.linkedin_url) payload.linkedin_url = null;
    if (!data.tenure_end_date) payload.tenure_end_date = null;

    await updateMember(Number(id), payload);
    router.push(`/admin/members/${id}`);
  };

  if (detailLoading && !member) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) return <p className="p-6 text-gray-500">Member not found</p>;

  const initialData: Partial<MemberFormData> = {
    full_name: member.full_name,
    email: member.email,
    phone: member.phone,
    role: member.role,
    position: member.position,
    responsibilities: member.responsibilities,
    bio: member.bio,
    linkedin_url: member.linkedin_url || "",
    joined_date: member.joined_date,
    tenure_end_date: member.tenure_end_date || "",
    display_order: member.display_order,
    is_active: member.is_active,
  };

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Member
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Member - {member.full_name}</h1>
      <MemberForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/admin/members/${id}`)}
        isEdit
      />
    </div>
  );
}

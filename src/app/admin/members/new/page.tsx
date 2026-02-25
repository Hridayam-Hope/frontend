"use client";

import { useRouter } from "next/navigation";
import { useMembersStore } from "@/lib/stores/members";
import MemberForm, { type MemberFormData } from "@/components/admin/MemberForm";

export default function NewMemberPage() {
  const router = useRouter();
  const { createMember } = useMembersStore();

  const handleSubmit = async (data: MemberFormData) => {
    const payload: Record<string, unknown> = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      position: data.position,
      responsibilities: data.responsibilities,
      bio: data.bio,
      joined_date: data.joined_date,
      display_order: data.display_order,
    };
    if (data.linkedin_url) payload.linkedin_url = data.linkedin_url;
    if (data.tenure_end_date) payload.tenure_end_date = data.tenure_end_date;

    const member = await createMember(payload);
    router.push(`/admin/members/${member.id}`);
  };

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Members
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Member</h1>
      <MemberForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}

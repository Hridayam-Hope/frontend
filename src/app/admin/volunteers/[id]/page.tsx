"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVolunteersStore } from "@/lib/stores/volunteers";
import { StatusBadge } from "@/components/ui/Badge";
import type { VolunteerProfile } from "@/types/api";

export default function VolunteerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetchVolunteer, detailLoading, volunteerCache } = useVolunteersStore();
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(null);

  useEffect(() => {
    if (id) {
      const numId = Number(id);
      if (volunteerCache[numId]) setVolunteer(volunteerCache[numId]);
      fetchVolunteer(numId).then(setVolunteer).catch(() => {});
    }
  }, [id, fetchVolunteer, volunteerCache]);

  if (detailLoading && !volunteer) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!volunteer) return <p className="p-6 text-gray-500">Volunteer not found</p>;

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Volunteers
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-brand-400 to-accent-400 flex items-center justify-center text-white text-xl font-bold">
              {volunteer.full_name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{volunteer.full_name}</h1>
              <p className="text-gray-500">{volunteer.email}</p>
            </div>
          </div>
          <StatusBadge status={volunteer.is_active ? "active" : "inactive"} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Phone", value: volunteer.phone },
            { label: "City", value: volunteer.city },
            { label: "State", value: volunteer.state },
            { label: "Total Hours", value: `${volunteer.total_hours}h` },
            { label: "Joined", value: new Date(volunteer.joined_date).toLocaleDateString() },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {volunteer.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

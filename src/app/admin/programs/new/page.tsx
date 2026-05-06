"use client";

import { useRouter } from "next/navigation";
import { useProgramsStore } from "@/lib/stores/programs";
import { useToast } from "@/lib/toast";
import { useApiError } from "@/lib/hooks/useApiError";
import ProgramForm from "@/components/programs/ProgramForm";

export default function NewProgramPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { handleError } = useApiError();
  const { createProgram } = useProgramsStore();

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Program</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new program or activity</p>
      </div>

      <ProgramForm
        submitLabel="Create Program"
        onSubmit={async (data) => {
          try {
            const program = await createProgram(data);
            showToast("success", "Program created successfully");
            router.push(`/admin/programs/${program.id}`);
          } catch (err) {
            handleError(err, "Failed to create program");
            throw err;
          }
        }}
        onCancel={() => router.push("/admin/programs")}
      />
    </div>
  );
}

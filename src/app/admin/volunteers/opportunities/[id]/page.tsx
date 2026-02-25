"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OpportunityDetailRedirectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/admin/opportunities/${id}`);
  }, [router, id]);
  return null;
}

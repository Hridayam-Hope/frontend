"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OpportunitiesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/opportunities");
  }, [router]);
  return null;
}

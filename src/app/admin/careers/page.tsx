"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCareersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/opportunities");
  }, [router]);

  return null;
}

import { redirect } from "next/navigation";

export default function LegacyNewsletterTemplatesPage() {
  redirect("/admin/email-templates");
}

type Variant = "default" | "success" | "warning" | "danger" | "info";

const styles: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

const statusVariantMap: Record<string, Variant> = {
  active: "success",
  completed: "success",
  donated: "success",
  approved: "success",
  accepted: "success",
  shortlisted: "success",
  sent: "success",
  pending: "warning",
  draft: "warning",
  in_transit: "info",
  verified: "info",
  received: "info",
  scheduled: "info",
  paused: "warning",
  failed: "danger",
  rejected: "danger",
  cancelled: "danger",
  inactive: "default",
  closed: "default",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = statusVariantMap[status] || "default";
  return (
    <Badge variant={variant}>
      {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </Badge>
  );
}

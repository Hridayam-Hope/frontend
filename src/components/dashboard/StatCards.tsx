/** Hero stat card - top-level KPI tiles. */

import type { ReactNode } from "react";

interface HeroStatProps {
  label: string;
  value: string | number;
  sub: string;
  gradient: string;
  icon: ReactNode;
}

export function HeroStat({ label, value, sub, gradient, icon }: HeroStatProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shrink-0`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
    </div>
  );
}

export function MiniStat({
  label,
  value,
  total,
  color,
  suffix,
}: {
  label: string;
  value: number;
  total?: number;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="text-center p-3 rounded-xl bg-gray-50">
      <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">
        {suffix || (total !== undefined ? `of ${total}` : "")} {label.toLowerCase()}
      </p>
    </div>
  );
}

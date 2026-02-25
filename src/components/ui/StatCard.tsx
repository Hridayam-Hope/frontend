interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({ label, value, icon, color = "from-brand-400 to-accent-400" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <div className={`p-2 rounded-lg bg-gradient-to-r ${color} text-white`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold mt-3 text-gray-900">{value}</p>
    </div>
  );
}

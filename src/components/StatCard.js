export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  subtitle,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-50 rounded-full">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

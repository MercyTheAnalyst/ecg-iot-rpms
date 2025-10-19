import { AlertTriangle, AlertCircle } from "lucide-react";
import { getSeverityColor, formatRelativeTime } from "@/lib/utils";

export default function AlertBadge({ alert }) {
  const Icon = alert.severity === "CRITICAL" ? AlertTriangle : AlertCircle;

  return (
    <div
      className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold">{alert.severity}</span>
            <span className="text-sm opacity-75">
              {formatRelativeTime(alert.timestamp)}
            </span>
          </div>
          <p className="text-sm mt-1">{alert.message}</p>
          {alert.heartRate && (
            <p className="text-xs mt-2 opacity-75">
              Heart Rate: {alert.heartRate} BPM
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

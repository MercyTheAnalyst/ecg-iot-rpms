import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card border-2 border-red-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

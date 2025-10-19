"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { getAlerts } from "@/lib/api";
import AlertBadge from "@/components/AlertBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, critical, warning

  const fetchAlerts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAlerts(100);
      setAlerts(data.alerts || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => fetchAlerts(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "critical") return alert.severity === "CRITICAL";
    if (filter === "warning") return alert.severity === "WARNING";
    return true;
  });

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={() => fetchAlerts()} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-warning" />
            Alerts
          </h1>
          <p className="text-gray-600 mt-2">
            {filteredAlerts.length} alert
            {filteredAlerts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md transition ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-4 py-2 rounded-md transition ${
              filter === "critical"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-4 py-2 rounded-md transition ${
              filter === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => fetchAlerts(true)}
            disabled={refreshing}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="card border-2 border-green-200 bg-green-50">
          <p className="text-green-800 text-center">
            ✓ No {filter !== "all" ? filter.toLowerCase() : ""} alerts
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => (
            <AlertBadge key={alert._id || index} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

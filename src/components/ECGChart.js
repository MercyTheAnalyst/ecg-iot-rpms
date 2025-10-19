"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ECGChart({ data, title = "ECG Waveform" }) {
  // Convert ECG samples to chart data (take first 200 samples for performance)
  const chartData = (data || []).slice(0, 200).map((value, index) => ({
    sample: index,
    voltage: value,
  }));

  if (!chartData.length) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No ECG data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="sample"
            label={{ value: "Sample", position: "insideBottom", offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis
            label={{ value: "Voltage", angle: -90, position: "insideLeft" }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="voltage"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

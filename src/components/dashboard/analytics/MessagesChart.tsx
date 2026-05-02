"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Icons } from "@/components/ui";
import { useTheme } from "@/contexts/ThemeContext";
import type { MessagesTimePoint } from "@/interfaces/Analytics.interface";

interface MessagesChartProps {
  data: MessagesTimePoint[];
  loading?: boolean;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#0E1515] border border-slate-200 dark:border-white/[0.08] rounded-lg px-3 py-2.5 shadow-xl shadow-slate-900/5 dark:shadow-black/40 backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-teal-600 dark:text-teal-300 tabular-nums">
        {payload[0].value?.toLocaleString()}{" "}
        <span className="text-slate-400 dark:text-slate-500 font-normal">
          messages
        </span>
      </p>
    </div>
  );
};

const MessagesChart: React.FC<MessagesChartProps> = ({
  data,
  loading = false,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridStroke = isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9";
  const axisTickFill = isDark ? "#64748b" : "#94a3b8";
  const cursorStroke = isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0";
  const dotFill = isDark ? "#2dd4bf" : "#0d9488";
  const activeDotFill = isDark ? "#5eead4" : "#0f766e";
  const activeDotStroke = isDark ? "#0E1515" : "#ffffff";

  const chartData = data.map((point) => {
    const dateParts = point.date.split("-");
    const localDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
    return {
      date: localDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      "Total Messages": point.totalMessages || 0,
    };
  });

  const total = chartData.reduce((sum, p) => sum + p["Total Messages"], 0);

  return (
    <div
      className={`
        relative overflow-hidden p-5
        bg-white dark:bg-white/[0.02]
        border border-slate-200/80 dark:border-white/[0.06]
        rounded-xl
        ${className}
      `}
    >
      {/* Decorative top hairline — same recipe as the sidebar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 ring-1 ring-inset ring-teal-200 dark:ring-teal-500/20">
            <Icons.MessageCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
              Messages Over Time
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">
              Daily activity · last 7 days
            </p>
          </div>
        </div>
        <div className="text-right">
          {loading ? (
            <div className="shimmer w-16 h-7 rounded-md bg-slate-100 dark:bg-white/[0.04]" />
          ) : (
            <>
              <p className="text-xl font-bold text-slate-900 dark:text-white tracking-[-0.03em] tabular-nums leading-none">
                {total.toLocaleString()}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500 mt-1.5">
                Total
              </p>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="shimmer h-52 rounded-lg bg-slate-50 dark:bg-white/[0.03]" />
      ) : (
        <div className="h-52 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="msgLineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset="0%"
                    stopColor={isDark ? "#2dd4bf" : "#14b8a6"}
                  />
                  <stop
                    offset="100%"
                    stopColor={isDark ? "#5eead4" : "#0d9488"}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridStroke}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke={gridStroke}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: axisTickFill }}
                dy={4}
              />
              <YAxis
                stroke={gridStroke}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: axisTickFill }}
                tickFormatter={(v) =>
                  v === 0 ? "0" : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: cursorStroke,
                  strokeWidth: 1,
                  strokeDasharray: "4 2",
                }}
              />
              <Line
                type="monotone"
                dataKey="Total Messages"
                stroke="url(#msgLineGlow)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: dotFill, strokeWidth: 0 }}
                activeDot={{
                  r: 5,
                  fill: activeDotFill,
                  strokeWidth: 2,
                  stroke: activeDotStroke,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MessagesChart;

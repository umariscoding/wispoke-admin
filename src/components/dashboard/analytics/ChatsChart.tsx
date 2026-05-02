"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Icons } from "@/components/ui";
import { useTheme } from "@/contexts/ThemeContext";
import type { ChatsTimePoint } from "@/interfaces/Analytics.interface";

interface ChatsChartProps {
  data: ChatsTimePoint[];
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
      <p className="text-sm font-semibold text-amber-600 dark:text-amber-300 tabular-nums">
        {payload[0].value?.toLocaleString()}{" "}
        <span className="text-slate-400 dark:text-slate-500 font-normal">
          chats
        </span>
      </p>
    </div>
  );
};

const ChatsChart: React.FC<ChatsChartProps> = ({
  data,
  loading = false,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridStroke = isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9";
  const axisTickFill = isDark ? "#64748b" : "#94a3b8";
  const cursorStroke = isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0";
  const lineStroke = isDark ? "#fbbf24" : "#b0926a";
  const dotFill = isDark ? "#fbbf24" : "#b0926a";
  const activeDotFill = isDark ? "#fcd34d" : "#9a7d56";
  const activeDotStroke = isDark ? "#0E1515" : "#ffffff";
  const areaGradStop = isDark ? "#fbbf24" : "#c4a882";

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
      "New Chats": point.newChats || 0,
    };
  });

  const total = chartData.reduce((sum, p) => sum + p["New Chats"], 0);

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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 ring-1 ring-inset ring-amber-200 dark:ring-amber-500/20">
            <Icons.MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
              Chat Activity
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">
              New conversations · last 7 days
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
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chatAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={areaGradStop}
                    stopOpacity={isDark ? 0.28 : 0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor={areaGradStop}
                    stopOpacity={0}
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
              <Area
                type="monotone"
                dataKey="New Chats"
                stroke={lineStroke}
                strokeWidth={2.5}
                fill="url(#chatAreaGrad)"
                dot={{ r: 3, fill: dotFill, strokeWidth: 0 }}
                activeDot={{
                  r: 5,
                  fill: activeDotFill,
                  strokeWidth: 2,
                  stroke: activeDotStroke,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChatsChart;

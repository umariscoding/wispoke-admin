"use client";

import React, { useEffect } from "react";

import { useCompanyAnalytics } from "@/hooks/company/useCompanyAnalytics";
import MessagesChart from "./MessagesChart";
import ChatsChart from "./ChatsChart";
import { Icons } from "@/components/ui";
import type { DashboardAnalyticsProps } from "@/interfaces/Analytics.interface";

// =============================================================================
// Tokens — see /DESIGN_TOKENS.md for the full vocabulary.
// Cards in this file all use this exact surface so they read as a single family.
// =============================================================================
const SURFACE =
  "bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] rounded-xl";
const SURFACE_HOVER =
  "hover:border-slate-300 dark:hover:border-white/[0.10] hover:shadow-sm hover:shadow-slate-200/40 dark:hover:shadow-none";

// =============================================================================
// StatCard — the primary metric tile.
// =============================================================================

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: { value: string; type: "increase" | "decrease" | "neutral" } | null;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  loading,
}) => {
  return (
    <div
      className={`group relative overflow-hidden p-5 transition-all duration-200 ${SURFACE} ${SURFACE_HOVER}`}
    >
      {/* Top hairline glow — appears on hover, mirrors the sidebar's top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/0 to-transparent group-hover:via-teal-400/50 transition-all duration-300" />

      {/* Icon + change row */}
      <div className="flex items-start justify-between mb-5">
        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-white/[0.04] ring-1 ring-inset ring-slate-200/60 dark:ring-white/[0.06] group-hover:ring-teal-500/20 dark:group-hover:ring-teal-500/20 transition-colors duration-200">
          <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200" />
        </div>
        {!loading && change && <TrendChip change={change} />}
      </div>

      {/* Value + label */}
      {loading ? (
        <SkeletonValue />
      ) : (
        <div className="space-y-1">
          <p className="text-[28px] font-bold text-slate-900 dark:text-white tracking-[-0.04em] leading-[1.05] tabular-nums">
            {Number(value).toLocaleString()}
          </p>
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>
      )}
    </div>
  );
};

const TrendChip: React.FC<{
  change: { value: string; type: "increase" | "decrease" | "neutral" };
}> = ({ change }) => {
  if (change.type === "neutral") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.06]">
        {change.value}
      </span>
    );
  }
  const positive = change.type === "increase";
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums border ${
        positive
          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20"
          : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20"
      }`}
    >
      <svg
        className={`h-2.5 w-2.5 ${positive ? "" : "rotate-180"}`}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6 2.5L9.5 6.5H7V9.5H5V6.5H2.5L6 2.5Z"
          fill="currentColor"
        />
      </svg>
      {change.value.replace(/^[+\-]/, "")}
    </span>
  );
};

const SkeletonValue: React.FC = () => (
  <div className="space-y-2">
    <div className="shimmer h-7 w-20 rounded-md bg-slate-100 dark:bg-white/[0.04]" />
    <div className="shimmer h-3.5 w-24 rounded bg-slate-100 dark:bg-white/[0.03]" />
  </div>
);

// =============================================================================
// Error & empty surfaces
// =============================================================================

const ErrorState: React.FC<{
  message: string;
  onRetry: () => void;
  className?: string;
}> = ({ message, onRetry, className = "" }) => (
  <div className={className}>
    <div
      className={`relative overflow-hidden p-8 text-center ${SURFACE}`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-rose-50 dark:bg-rose-500/10 ring-1 ring-inset ring-rose-200/60 dark:ring-rose-500/20 mb-4">
        <Icons.AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
      </div>
      <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em] mb-1">
        Couldn&rsquo;t load analytics
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white dark:text-teal-200 bg-slate-900 dark:bg-teal-500/15 border border-transparent dark:border-teal-500/30 hover:bg-slate-800 dark:hover:bg-teal-500/25 transition-colors"
      >
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6a4 4 0 1 1 1 2.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M1 4.5L3 6.5L4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        Try again
      </button>
    </div>
  </div>
);

// =============================================================================
// DashboardAnalytics — the section header + grid + charts.
// =============================================================================

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  className = "",
}) => {
  const { dashboard, loading, error, loadDashboardAnalytics } =
    useCompanyAnalytics();

  useEffect(() => {
    loadDashboardAnalytics();
  }, [loadDashboardAnalytics]);

  if (error) {
    return (
      <ErrorState
        className={className}
        message={
          typeof error === "string"
            ? error
            : "Something went sideways while loading your overview."
        }
        onRetry={() => loadDashboardAnalytics()}
      />
    );
  }

  const stats: StatCardProps[] = [
    {
      icon: Icons.MessageCircle,
      label: "Total Messages",
      value: dashboard?.overview.totalMessages.count || 0,
      change: dashboard?.overview.totalMessages.change ?? null,
      loading,
    },
    {
      icon: Icons.Users,
      label: "New Users",
      value: dashboard?.overview.users.count || 0,
      change: dashboard?.overview.users.change ?? null,
      loading,
    },
    {
      icon: Icons.MessageSquare,
      label: "Total Chats",
      value: dashboard?.overview.totalChats.count || 0,
      change: dashboard?.overview.totalChats.change ?? null,
      loading,
    },
    {
      icon: Icons.FileText,
      label: "Knowledge Bases",
      value: dashboard?.overview.knowledgeBases.count || 0,
      change: dashboard?.overview.knowledgeBases.change ?? null,
      loading,
    },
    {
      icon: Icons.UserX,
      label: "Guest Sessions",
      value: dashboard?.overview.guestSessions.count || 0,
      change: dashboard?.overview.guestSessions.change ?? null,
      loading,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="block w-[3px] h-5 rounded-r-full bg-teal-400" />
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.02em] leading-none">
              Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Last 7 days
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
          </span>
          Live
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-in"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <MessagesChart
          data={dashboard?.timeSeries.messagesOverTime || []}
          loading={loading}
        />
        <ChatsChart
          data={dashboard?.timeSeries.chatsOverTime || []}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardAnalytics;

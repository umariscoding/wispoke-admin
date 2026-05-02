"use client";

import React from "react";

import Card from "@/components/ui/Card";
import type { StatsCardProps } from "@/interfaces/StatsCard.interface";

const TrendUpIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const TrendDownIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
    />
  </svg>
);

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  className = "",
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
              </div>
              <div className="h-12 w-12 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const getChangeColorClass = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return "text-success-600 dark:text-success-400";
      case "decrease":
        return "text-error-600 dark:text-error-400";
      case "neutral":
      default:
        return "text-text-secondary";
    }
  };

  const getChangeIcon = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return <TrendUpIcon className="h-4 w-4" />;
      case "decrease":
        return <TrendDownIcon className="h-4 w-4" />;
      case "neutral":
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary truncate">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-text-primary">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>

            {change && (
              <div
                className={`mt-2 flex items-center text-sm font-medium ${getChangeColorClass(change.type)}`}
              >
                {getChangeIcon(change.type)}
                <span className="ml-1">{change.value}</span>
              </div>
            )}

            {description && (
              <p className="mt-1 text-sm text-text-tertiary">{description}</p>
            )}
          </div>

          {Icon && (
            <div className="flex-shrink-0">
              <div className="p-3 bg-primary-100 rounded-xl shadow-inner">
                <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;

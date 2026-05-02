"use client";

import React from "react";

interface IOSLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "dark";
  className?: string;
}

const IOSLoader: React.FC<IOSLoaderProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4 border-[1.5px]",
    md: "w-5 h-5 border-2",
    lg: "w-7 h-7 border-2",
    xl: "w-10 h-10 border-[2.5px]",
  };

  const colors = {
    primary:
      "border-teal-500/20 dark:border-white/[0.08] border-t-teal-600 dark:border-t-teal-400",
    white: "border-white/20 border-t-white",
    dark: "border-slate-200 dark:border-white/[0.08] border-t-slate-700 dark:border-t-slate-300",
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin ${className}`}
      style={{ animationDuration: "0.6s" }}
    />
  );
};

interface IOSContentLoaderProps {
  isLoading: boolean;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const IOSContentLoader: React.FC<IOSContentLoaderProps> = ({
  isLoading,
  message = "Loading...",
  className = "",
  children,
}) => {
  if (!isLoading && children) {
    return <>{children}</>;
  }

  if (!isLoading) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[60vh] ${className}`}
    >
      <IOSLoader size="lg" color="primary" className="mb-3" />
      <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );
};

export default IOSLoader;

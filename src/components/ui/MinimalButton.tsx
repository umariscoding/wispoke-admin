"use client";

import React from "react";
import IOSLoader from "./IOSLoader";

interface MinimalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  theme?: "default" | "auth";
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      theme = "default",
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary-600 hover:bg-primary-700 dark:hover:bg-teal-500/25 dark:border dark:border-teal-500/30 text-white rounded-full shadow-sm hover:shadow-md active:scale-[0.98]",
      secondary:
        "bg-neutral-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300 rounded-full border border-neutral-200 dark:border-white/[0.06] active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full",
      outline:
        "bg-transparent border border-neutral-300 dark:border-white/[0.10] hover:border-primary-400 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <IOSLoader size="sm" color={variant === "primary" ? "white" : "primary"} />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

MinimalButton.displayName = "MinimalButton";

export default MinimalButton;

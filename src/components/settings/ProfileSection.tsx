"use client";

import React from "react";
import { Icons } from "@/components/ui";

interface ProfileSectionProps {
  name: string;
  email: string;
  slug: string;
  onSlugChange: (value: string) => void;
}

export default function ProfileSection({
  name,
  email,
  slug,
  onSlugChange,
}: ProfileSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Your company information and public URL
        </p>
      </div>

      <div className="bg-white dark:bg-white/[0.02] rounded-lg border border-neutral-200 dark:border-white/[0.06] divide-y divide-neutral-100 dark:divide-white/[0.06]">
        {/* Read-only info */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Company Name
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white font-medium">{name}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Email
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white font-medium">{email}</p>
          </div>
        </div>

        {/* Slug */}
        <div className="p-5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Company Slug
          </label>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 mb-2.5">
            This sets your public chatbot URL
          </p>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="my-company"
            className="w-full rounded-lg border border-slate-200 dark:border-white/[0.10] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-500/40 focus:border-teal-400 dark:focus:border-teal-500/50 transition-all"
          />
          <div className="flex items-center gap-1.5 mt-2">
            <Icons.AlertCircle className="h-3 w-3 text-slate-400 dark:text-slate-400" />
            <p className="text-xs text-slate-400 dark:text-slate-400">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>
          {slug && (
            <div className="mt-3 flex items-center gap-2 bg-neutral-50 dark:bg-transparent px-3 py-2 rounded-md">
              <Icons.Globe className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                yoursite.com/<span className="text-primary-600 dark:text-primary-400 font-medium">{slug}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

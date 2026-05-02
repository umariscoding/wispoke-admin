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
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Profile</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Your company information and public URL
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
        {/* Read-only info */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Company Name
            </label>
            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50 font-medium">{name}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Email
            </label>
            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50 font-medium">{email}</p>
          </div>
        </div>

        {/* Slug */}
        <div className="p-5">
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Company Slug
          </label>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 mb-2.5">
            This sets your public chatbot URL
          </p>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="my-company"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
          <div className="flex items-center gap-1.5 mt-2">
            <Icons.AlertCircle className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>
          {slug && (
            <div className="mt-3 flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 rounded-md">
              <Icons.Globe className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                yoursite.com/<span className="text-primary-600 dark:text-primary-400 font-medium">{slug}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

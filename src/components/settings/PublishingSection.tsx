"use client";

import React from "react";
import { Icons, Toggle } from "@/components/ui";

interface PublishingSectionProps {
  isPublished: boolean;
  slug: string | null;
  onPublishToggle: (checked: boolean) => void;
}

export default function PublishingSection({
  isPublished,
  slug,
  onPublishToggle,
}: PublishingSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Publishing</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Enable your chatbot for embed on your website
        </p>
      </div>

      <div className="relative overflow-hidden bg-white dark:bg-white/[0.02] rounded-xl border border-slate-200/80 dark:border-white/[0.06] divide-y divide-slate-100 dark:divide-white/[0.06] shadow-sm dark:shadow-none">
        {/* Top hairline glow — same recipe as the sidebar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

        {/* Toggle */}
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
              {isPublished ? "Live" : "Private"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isPublished
                ? "Your chatbot is enabled for embed"
                : "Embed widget will not respond to visitors"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isPublished && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Live
              </span>
            )}
            <Toggle
              checked={isPublished}
              onChange={onPublishToggle}
              disabled={!slug}
              variant="success"
              size="md"
              label=""
              description=""
            />
          </div>
        </div>

        {/* Warnings */}
        <div className="p-5">
          {!slug && (
            <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-lg p-3.5">
              <Icons.AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Slug required
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5">
                  Set a company slug in the Profile section before publishing
                </p>
              </div>
            </div>
          )}

          {slug && isPublished && (
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
              <Icons.CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <p className="text-sm">
                Install the embed widget on your site to start chatting with visitors
              </p>
            </div>
          )}

          {slug && !isPublished && (
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <Icons.Eye className="h-4 w-4" />
              <p className="text-sm">
                Toggle the switch to enable your chatbot
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

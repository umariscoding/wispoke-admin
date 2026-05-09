"use client";

import React from "react";
import { Icons } from "@/components/ui";

export interface ModelOption {
  value: string;
  name: string;
  tag: "Recommended" | "Older" | "Experimental";
  blurb: string;
}

// Keep this list in sync with SUPPORTED_GEMINI_LIVE_MODELS in
// wispoke-api/app/features/voice_agent/pipeline.py — backend coerces unknown
// values to the default, so anything missing here will silently ignored.
const MODELS: ModelOption[] = [
  {
    value: "gemini-2.5-flash-native-audio-preview-12-2025",
    name: "Gemini 2.5 Flash Native Audio",
    tag: "Recommended",
    blurb:
      "Dec-2025 native-audio Live model. Best balance of latency, voice quality, and tool reliability.",
  },
  {
    value: "gemini-3.1-flash-live-preview",
    name: "Gemini 3.1 Flash Live",
    tag: "Experimental",
    blurb:
      "Mar-2026 preview. Lowest latency. Some features (proactive audio, async tool calls) not yet supported.",
  },
  {
    value: "gemini-2.5-flash-native-audio-preview-09-2025",
    name: "Gemini 2.5 Flash (09-2025)",
    tag: "Older",
    blurb:
      "Sept-2025 preview. Kept for backwards compatibility — pick this only if the newer models misbehave for you.",
  },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const TAG_STYLES: Record<ModelOption["tag"], string> = {
  Recommended:
    "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
  Experimental:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Older: "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-400",
};

function ModelPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      {MODELS.map((m) => {
        const selected = m.value === value;
        return (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
              selected
                ? "border-primary-500 bg-primary-50/60 dark:bg-primary-900/20 shadow-sm shadow-primary-500/10"
                : "border-neutral-200 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:border-white/[0.10] dark:hover:border-white/[0.10]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selected
                    ? "bg-primary-600"
                    : "bg-neutral-100 dark:bg-white/[0.06]"
                }`}
              >
                <Icons.Bot
                  className={`h-4 w-4 ${
                    selected ? "text-white" : "text-slate-500 dark:text-slate-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className={`text-sm font-semibold ${
                      selected
                        ? "text-primary-900 dark:text-white"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {m.name}
                  </p>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${TAG_STYLES[m.tag]}`}
                  >
                    {m.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {m.blurb}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1.5">
                  {m.value}
                </p>
              </div>
              {selected && (
                <Icons.CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ModelPicker;

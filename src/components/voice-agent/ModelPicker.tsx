"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icons } from "@/components/ui";

export interface ModelOption {
  value: string;
  name: string;
  tag: "Recommended" | "Experimental";
  blurb: string;
  // Audio-token pricing (paid tier, per 1M tokens). Source: ai.google.dev/pricing.
  inputPerMillion: number;
  outputPerMillion: number;
  // Approx per-minute cost on Gemini's published $/min figure for Live API.
  perMinuteUsd: number;
  freeNote: string;
}

// Keep this list in sync with SUPPORTED_GEMINI_LIVE_MODELS in
// wispoke-api/app/features/voice_agent/pipeline.py.
const MODELS: ModelOption[] = [
  {
    value: "gemini-2.5-flash-native-audio-preview-12-2025",
    name: "Gemini 2.5 Flash Native Audio",
    tag: "Recommended",
    blurb: "Best balance of latency, voice quality, and tool reliability.",
    inputPerMillion: 3.0,
    outputPerMillion: 12.0,
    perMinuteUsd: 0.018,
    freeNote: "Free tier available (rate-limited)",
  },
  {
    value: "gemini-3.1-flash-live-preview",
    name: "Gemini 3.1 Flash Live",
    tag: "Experimental",
    blurb: "Newest preview, lowest latency. Some features (proactive audio, async tool calls) not yet supported.",
    inputPerMillion: 3.0,
    outputPerMillion: 12.0,
    perMinuteUsd: 0.018,
    freeNote: "Free tier available (rate-limited)",
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
};

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

function ModelPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click-outside to close.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Resolve current selection (fall back to recommended if value is unknown).
  const current = MODELS.find((m) => m.value === value) ?? MODELS[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 bg-white dark:bg-white/[0.02] dark:border-white/[0.10] hover:border-slate-300 dark:hover:border-white/[0.20] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          <Icons.Bot className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {current.name}
            </p>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${TAG_STYLES[current.tag]}`}
            >
              {current.tag}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            ~{formatPrice(current.perMinuteUsd)}/min · {current.freeNote}
          </p>
        </div>
        <Icons.ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-neutral-200 bg-white dark:bg-[#0a1414] dark:border-white/[0.10] shadow-xl overflow-hidden">
          {MODELS.map((m) => {
            const selected = m.value === current.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => {
                  onChange(m.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 border-neutral-100 dark:border-white/[0.06] transition-colors ${
                  selected
                    ? "bg-primary-50/60 dark:bg-primary-900/15"
                    : "hover:bg-neutral-50 dark:hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {m.name}
                      </p>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${TAG_STYLES[m.tag]}`}
                      >
                        {m.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 leading-relaxed">
                      {m.blurb}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        ~<strong className="text-slate-700 dark:text-slate-300">{formatPrice(m.perMinuteUsd)}/min</strong>
                      </span>
                      <span>
                        in {formatPrice(m.inputPerMillion)}/M · out {formatPrice(m.outputPerMillion)}/M tokens
                      </span>
                      <span>{m.freeNote}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
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
          <div className="px-4 py-2 text-[10px] text-slate-400 dark:text-slate-500 bg-neutral-50 dark:bg-white/[0.02] border-t border-neutral-100 dark:border-white/[0.06]">
            Pricing is for the paid tier. Free tier covers initial testing.
            See{" "}
            <a
              href="https://ai.google.dev/gemini-api/docs/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 dark:hover:text-slate-300"
            >
              ai.google.dev/pricing
            </a>{" "}
            for current rates.
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelPicker;

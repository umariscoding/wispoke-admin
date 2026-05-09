"use client";

import React from "react";
import { Icons } from "@/components/ui";

export interface VoiceOption {
  value: string;
  name: string;
  gender: "Male" | "Female";
}

// Gemini Live native-audio voices. The `gemini-` prefix is preserved in the
// stored value so the backend's `_resolve_gemini_voice` can route it.
const VOICES: VoiceOption[] = [
  { value: "gemini-aoede", name: "Aoede", gender: "Female" },
  { value: "gemini-kore", name: "Kore", gender: "Female" },
  { value: "gemini-charon", name: "Charon", gender: "Male" },
  { value: "gemini-fenrir", name: "Fenrir", gender: "Male" },
  { value: "gemini-puck", name: "Puck", gender: "Male" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function VoiceModelPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Gemini Live
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Speech-to-speech, lowest latency
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {VOICES.map((v) => {
          const selected = v.value === value;
          return (
            <button
              key={v.value}
              onClick={() => onChange(v.value)}
              className={`group relative px-3 py-3 rounded-xl border text-left transition-all ${
                selected
                  ? "border-primary-500 bg-primary-50/60 dark:bg-primary-900/20 shadow-sm shadow-primary-500/10"
                  : "border-neutral-200 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:border-white/[0.10] dark:hover:border-white/[0.10]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selected
                      ? "bg-primary-600"
                      : "bg-neutral-100 group-hover:bg-slate-200 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.04]"
                  }`}
                >
                  <Icons.Mic
                    className={`h-3.5 w-3.5 ${selected ? "text-white" : "text-slate-500 dark:text-slate-400"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      selected ? "text-primary-900" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {v.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {v.gender}
                  </p>
                </div>
                {selected && (
                  <Icons.CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VoiceModelPicker;

"use client";

import React from "react";
import { Icons } from "@/components/ui";

export interface VoiceOption {
  value: string;
  name: string;
  gender: "Male" | "Female";
  accent?: string;
  provider: "Deepgram" | "Gemini";
}

// Provider routing: Gemini voices (gemini-*) are used on the browser test path
// when GEMINI_API_KEY is set; Deepgram voices (aura-*) are used on Twilio
// calls and as the browser fallback. Pick a voice for the path you actually
// care about; the other path uses a sensible default.
const VOICES: VoiceOption[] = [
  // Gemini Live (speech-to-speech, browser test)
  { value: "gemini-aoede", name: "Aoede", gender: "Female", provider: "Gemini" },
  { value: "gemini-kore", name: "Kore", gender: "Female", provider: "Gemini" },
  { value: "gemini-charon", name: "Charon", gender: "Male", provider: "Gemini" },
  { value: "gemini-fenrir", name: "Fenrir", gender: "Male", provider: "Gemini" },
  { value: "gemini-puck", name: "Puck", gender: "Male", provider: "Gemini" },
  // Deepgram Aura-2 (Twilio phone calls)
  { value: "aura-2-andromeda-en", name: "Andromeda", gender: "Female", provider: "Deepgram" },
  { value: "aura-2-aurora-en", name: "Aurora", gender: "Female", provider: "Deepgram" },
  { value: "aura-asteria-en", name: "Asteria", gender: "Female", provider: "Deepgram" },
  { value: "aura-luna-en", name: "Luna", gender: "Female", provider: "Deepgram" },
  { value: "aura-2-odysseus-en", name: "Odysseus", gender: "Male", provider: "Deepgram" },
  { value: "aura-2-atlas-en", name: "Atlas", gender: "Male", provider: "Deepgram" },
  { value: "aura-orion-en", name: "Orion", gender: "Male", provider: "Deepgram" },
  { value: "aura-helios-en", name: "Helios", gender: "Male", accent: "UK", provider: "Deepgram" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function VoiceModelPicker({ value, onChange }: Props) {
  const groups: Array<{ provider: VoiceOption["provider"]; subtitle: string; voices: VoiceOption[] }> = [
    {
      provider: "Gemini",
      subtitle: "Browser test calls (speech-to-speech, lowest latency)",
      voices: VOICES.filter((v) => v.provider === "Gemini"),
    },
    {
      provider: "Deepgram",
      subtitle: "Phone calls via Twilio",
      voices: VOICES.filter((v) => v.provider === "Deepgram"),
    },
  ];
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.provider}>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {group.provider}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{group.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {group.voices.map((v) => {
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
                        {v.accent && ` · ${v.accent}`}
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
      ))}
    </div>
  );
}

export default VoiceModelPicker;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icons } from "@/components/ui";
import { API_CONFIG } from "@/constants/api";

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
  // Shared audio element across the picker — only one preview plays at a time.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Which voice is currently in either "loading" or "playing" state.
  const [activeVoice, setActiveVoice] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "playing">("idle");

  // Lazily create the audio element on first interaction (avoids SSR issues).
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handlePreview = async (voiceValue: string) => {
    // Toggle: clicking the currently-playing one stops it.
    if (activeVoice === voiceValue && phase === "playing") {
      audioRef.current?.pause();
      setActiveVoice(null);
      setPhase("idle");
      return;
    }

    // Stop anything currently playing.
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setActiveVoice(voiceValue);
    setPhase("loading");

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    audio.onended = () => {
      setActiveVoice(null);
      setPhase("idle");
    };
    audio.onerror = () => {
      setActiveVoice(null);
      setPhase("idle");
    };
    audio.onplaying = () => setPhase("playing");

    audio.src = `${API_CONFIG.BASE_URL}/voice-agent/voice-sample/${encodeURIComponent(voiceValue)}`;
    try {
      await audio.play();
    } catch {
      setActiveVoice(null);
      setPhase("idle");
    }
  };

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
          const isActive = v.value === activeVoice;
          const isLoading = isActive && phase === "loading";
          const isPlaying = isActive && phase === "playing";

          return (
            <div
              key={v.value}
              className={`group relative rounded-xl border text-left transition-all ${
                selected
                  ? "border-primary-500 bg-primary-50/60 dark:bg-primary-900/20 shadow-sm shadow-primary-500/10"
                  : "border-neutral-200 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:border-white/[0.10] dark:hover:border-white/[0.10]"
              }`}
            >
              <button
                type="button"
                onClick={() => onChange(v.value)}
                className="w-full text-left px-3 py-3 pr-9"
                aria-label={`Select ${v.name}`}
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
                </div>
              </button>

              {/* Right-side stack: play button on top (always visible),
                  selected check below. Vertical placement prevents overlap. */}
              <div className="absolute top-1/2 -translate-y-1/2 right-2 flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(v.value);
                  }}
                  aria-label={isPlaying ? `Stop preview of ${v.name}` : `Preview ${v.name}`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-primary-600 text-white"
                      : isLoading
                        ? "bg-neutral-200 dark:bg-white/[0.10] text-slate-500"
                        : "bg-neutral-100 hover:bg-primary-100 dark:bg-white/[0.06] dark:hover:bg-primary-900/30 text-slate-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-300"
                  }`}
                >
                  {isLoading ? (
                    <Icons.Loader2 className="h-3 w-3 animate-spin" />
                  ) : isPlaying ? (
                    <Icons.Square className="h-2.5 w-2.5 fill-current" />
                  ) : (
                    <Icons.Play className="h-3 w-3 fill-current ml-0.5" />
                  )}
                </button>
                {selected && (
                  <Icons.CheckCircle className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VoiceModelPicker;

"use client";

import React, { useEffect, useState } from "react";
import { Icons, Toggle } from "@/components/ui";
import {
  useCompanyAppDispatch,
  useCompanyAppSelector,
} from "@/hooks/company/useCompanyAuth";
import {
  fetchVoiceAgentConfig,
  updateVoiceAgentConfig,
} from "@/store/company/slices/voiceAgentSlice";
import type {
  VoiceAgentConfigUpdate,
  LlmProvider,
} from "@/types/voiceAgent";

const DEFAULT_SYSTEM_PROMPT = `You are a friendly receptionist answering calls for a plumbing business. Your job is to understand the caller's plumbing issue, offer open appointment slots from the calendar, and confirm a booking with their name and phone number. Keep answers short and conversational.`;

const LLM_MODELS: Record<LlmProvider, string[]> = {
  groq: [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
  ],
  ollama: ["llama3.1:8b", "llama3.1:70b", "mistral:7b"],
};

const TTS_VOICES = [
  "en_US-amy-medium",
  "en_US-ryan-medium",
  "en_US-lessac-medium",
  "en_GB-alba-medium",
];

const ConfigurationSection: React.FC = () => {
  const dispatch = useCompanyAppDispatch();
  const { config, loading, saving, error } = useCompanyAppSelector(
    (s) => s.voiceAgent,
  );

  const [form, setForm] = useState<VoiceAgentConfigUpdate>({});
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [llmKey, setLlmKey] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!config && !loading) {
      dispatch(fetchVoiceAgentConfig());
    }
  }, [config, loading, dispatch]);

  const update = <K extends keyof VoiceAgentConfigUpdate>(
    key: K,
    value: VoiceAgentConfigUpdate[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const get = <K extends keyof VoiceAgentConfigUpdate>(
    key: K,
  ): VoiceAgentConfigUpdate[K] | undefined => {
    if (key in form) return form[key];
    if (!config) return undefined;
    return (config as any)[key];
  };

  const handleSave = async () => {
    const payload: VoiceAgentConfigUpdate = { ...form };
    if (twilioSid.trim()) payload.twilio_account_sid = twilioSid.trim();
    if (twilioToken.trim()) payload.twilio_auth_token = twilioToken.trim();
    if (llmKey.trim()) payload.llm_api_key = llmKey.trim();

    if (Object.keys(payload).length === 0) return;

    try {
      await dispatch(updateVoiceAgentConfig(payload)).unwrap();
      setForm({});
      setTwilioSid("");
      setTwilioToken("");
      setLlmKey("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      // error is set by the slice
    }
  };

  if (loading && !config) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-sm text-neutral-400">Loading configuration...</span>
      </div>
    );
  }

  const enabled = get("enabled") ?? false;
  const llmProvider = (get("llm_provider") as LlmProvider) ?? "groq";
  const hasChanges =
    Object.keys(form).length > 0 ||
    twilioSid.length > 0 ||
    twilioToken.length > 0 ||
    llmKey.length > 0;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Icons.AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
        </div>
      )}
      {saveSuccess && (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
          <Icons.CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />
          <p className="text-sm text-primary-700 font-medium">Configuration saved</p>
        </div>
      )}

      {/* Enable toggle */}
      <div className="bg-white rounded-2xl border border-neutral-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              enabled ? "bg-primary-600 shadow-md shadow-primary-600/25" : "bg-neutral-100"
            }`}
          >
            <Icons.Phone
              className={`h-4 w-4 ${enabled ? "text-white" : "text-neutral-400"}`}
            />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">
              {enabled ? "Voice agent is live" : "Voice agent is off"}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {enabled
                ? "Inbound calls to your Twilio number are answered by the AI."
                : "Turn on to route inbound calls through the AI receptionist."}
            </p>
          </div>
        </div>
        <Toggle
          checked={enabled}
          onChange={(v) => update("enabled", v)}
          variant="success"
          size="md"
        />
      </div>

      {/* Identity */}
      <Card
        icon={<Icons.Bot className="h-3.5 w-3.5 text-neutral-500" />}
        title="Agent identity"
      >
        <Field label="Business name">
          <input
            type="text"
            value={get("business_name") ?? ""}
            onChange={(e) => update("business_name", e.target.value)}
            placeholder="Acme Plumbing"
            className={inputClass}
          />
        </Field>
        <Field label="Agent name">
          <input
            type="text"
            value={get("agent_name") ?? ""}
            onChange={(e) => update("agent_name", e.target.value)}
            placeholder="Riley"
            className={inputClass}
          />
        </Field>
        <Field label="Greeting">
          <textarea
            value={get("greeting") ?? ""}
            onChange={(e) => update("greeting", e.target.value)}
            placeholder="Thanks for calling Acme Plumbing, this is Riley — how can I help?"
            rows={2}
            className={textareaClass}
          />
        </Field>
        <Field
          label="System prompt"
          hint="Tells the LLM how to behave on the call."
        >
          <textarea
            value={get("system_prompt") ?? DEFAULT_SYSTEM_PROMPT}
            onChange={(e) => update("system_prompt", e.target.value)}
            rows={5}
            className={`${textareaClass} font-mono text-xs`}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Timezone">
            <input
              type="text"
              value={get("timezone") ?? "America/Los_Angeles"}
              onChange={(e) => update("timezone", e.target.value)}
              placeholder="America/Los_Angeles"
              className={inputClass}
            />
          </Field>
          <Field label="Default appointment length (min)">
            <input
              type="number"
              min={15}
              step={15}
              value={get("default_appointment_duration_minutes") ?? 60}
              onChange={(e) =>
                update(
                  "default_appointment_duration_minutes",
                  Number(e.target.value) || 60,
                )
              }
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      {/* Telephony */}
      <Card
        icon={<Icons.Phone className="h-3.5 w-3.5 text-neutral-500" />}
        title="Telephony (Twilio)"
      >
        <Field
          label="Twilio phone number"
          hint="E.164 format — the number customers dial."
        >
          <input
            type="text"
            value={get("twilio_phone_number") ?? ""}
            onChange={(e) => update("twilio_phone_number", e.target.value)}
            placeholder="+14155551234"
            className={inputClass}
          />
        </Field>
        <Field
          label="Account SID"
          hint={
            config?.twilio_account_sid_set
              ? "A SID is stored. Enter a new value to replace it."
              : "From your Twilio console."
          }
        >
          <input
            type="password"
            value={twilioSid}
            onChange={(e) => setTwilioSid(e.target.value)}
            placeholder={
              config?.twilio_account_sid_set ? "••••••••••••" : "ACxxxxxxxxxx"
            }
            className={inputClass}
            autoComplete="off"
          />
        </Field>
        <Field
          label="Auth token"
          hint={
            config?.twilio_auth_token_set
              ? "A token is stored. Enter a new value to replace it."
              : "From your Twilio console."
          }
        >
          <input
            type="password"
            value={twilioToken}
            onChange={(e) => setTwilioToken(e.target.value)}
            placeholder={
              config?.twilio_auth_token_set ? "••••••••••••" : "your auth token"
            }
            className={inputClass}
            autoComplete="off"
          />
        </Field>
      </Card>

      {/* AI stack */}
      <Card
        icon={<Icons.Brain className="h-3.5 w-3.5 text-neutral-500" />}
        title="AI stack"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Speech-to-text">
            <div className={readOnlyClass}>Whisper (self-hosted)</div>
          </Field>
          <Field label="Text-to-speech">
            <div className={readOnlyClass}>Piper (self-hosted)</div>
          </Field>
        </div>
        <Field label="TTS voice">
          <select
            value={get("tts_voice") ?? TTS_VOICES[0]}
            onChange={(e) => update("tts_voice", e.target.value)}
            className={inputClass}
          >
            {TTS_VOICES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="LLM provider">
            <select
              value={llmProvider}
              onChange={(e) => {
                const provider = e.target.value as LlmProvider;
                update("llm_provider", provider);
                update("llm_model", LLM_MODELS[provider][0]);
              }}
              className={inputClass}
            >
              <option value="groq">Groq (free tier)</option>
              <option value="ollama">Ollama (self-hosted)</option>
            </select>
          </Field>
          <Field label="Model">
            <select
              value={get("llm_model") ?? LLM_MODELS[llmProvider][0]}
              onChange={(e) => update("llm_model", e.target.value)}
              className={inputClass}
            >
              {LLM_MODELS[llmProvider].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {llmProvider === "groq" && (
          <Field
            label="Groq API key"
            hint={
              config?.llm_api_key_set
                ? "A key is stored. Enter a new value to replace it."
                : "Get a free key at console.groq.com."
            }
          >
            <input
              type="password"
              value={llmKey}
              onChange={(e) => setLlmKey(e.target.value)}
              placeholder={config?.llm_api_key_set ? "••••••••••••" : "gsk_..."}
              className={inputClass}
              autoComplete="off"
            />
          </Field>
        )}
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => {
            setForm({});
            setTwilioSid("");
            setTwilioToken("");
            setLlmKey("");
          }}
          disabled={!hasChanges || saving}
          className="px-3.5 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-all disabled:opacity-40"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save configuration"}
        </button>
      </div>
    </div>
  );
};

const Card: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
    <div className="px-5 pt-5 pb-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {title}
        </span>
      </div>
      {children}
    </div>
  </div>
);

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div>
    <label className="text-xs font-semibold text-neutral-600 mb-2 block">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-neutral-400 mt-1.5">{hint}</p>}
  </div>
);

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all";

const textareaClass =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all resize-y";

const readOnlyClass =
  "w-full rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 px-3.5 py-2.5 text-sm";

export default ConfigurationSection;

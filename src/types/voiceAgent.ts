// Voice Agent feature types
// The voice agent answers inbound calls for a plumber/company, checks in-house
// calendar availability, and books appointments.

export type VoiceProvider = "twilio";

export type SttEngine = "whisper";
export type TtsEngine = "piper";
export type LlmProvider = "groq" | "ollama";

export interface VoiceAgentConfig {
  enabled: boolean;
  greeting: string;
  agent_name: string;
  business_name: string;
  timezone: string;
  default_appointment_duration_minutes: number;

  // Telephony
  telephony_provider: VoiceProvider;
  twilio_phone_number: string | null;
  twilio_account_sid_set: boolean; // server masks the SID; boolean indicates whether it's configured
  twilio_auth_token_set: boolean;

  // AI stack
  stt_engine: SttEngine;
  tts_engine: TtsEngine;
  tts_voice: string; // e.g. "en_US-amy-medium"
  llm_provider: LlmProvider;
  llm_model: string; // e.g. "llama-3.1-8b-instant"
  llm_api_key_set: boolean;

  // Prompting
  system_prompt: string;
}

export interface VoiceAgentConfigUpdate {
  enabled?: boolean;
  greeting?: string;
  agent_name?: string;
  business_name?: string;
  timezone?: string;
  default_appointment_duration_minutes?: number;
  telephony_provider?: VoiceProvider;
  twilio_phone_number?: string | null;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  stt_engine?: SttEngine;
  tts_engine?: TtsEngine;
  tts_voice?: string;
  llm_provider?: LlmProvider;
  llm_model?: string;
  llm_api_key?: string;
  system_prompt?: string;
}

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface BusinessHour {
  day: Weekday;
  enabled: boolean;
  start_time: string; // "HH:mm" 24h
  end_time: string;
}

export interface AvailabilityConfig {
  business_hours: BusinessHour[];
  slot_granularity_minutes: number;
  buffer_minutes_between_appointments: number;
  max_daily_bookings: number | null;
}

export type BookingStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Booking {
  booking_id: string;
  customer_name: string;
  customer_phone: string;
  service: string;
  notes: string | null;
  scheduled_at: string; // ISO
  duration_minutes: number;
  status: BookingStatus;
  source: "voice_agent" | "manual";
  call_id: string | null;
  created_at: string;
}

export type CallOutcome =
  | "booked"
  | "no_availability"
  | "hangup"
  | "transferred"
  | "failed";

export interface CallLog {
  call_id: string;
  provider_call_sid: string;
  from_number: string;
  to_number: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  outcome: CallOutcome;
  transcript: string | null;
  booking_id: string | null;
}

export interface BookingListResponse {
  bookings: Booking[];
}

export interface CallLogListResponse {
  calls: CallLog[];
}

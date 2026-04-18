"use client";

import React, { useEffect, useState } from "react";
import { Icons } from "@/components/ui";
import {
  useCompanyAppDispatch,
  useCompanyAppSelector,
} from "@/hooks/company/useCompanyAuth";
import { fetchCallLogs } from "@/store/company/slices/voiceAgentSlice";
import type { CallLog, CallOutcome } from "@/types/voiceAgent";

const OUTCOME_LABEL: Record<CallOutcome, string> = {
  booked: "Booked",
  no_availability: "No availability",
  hangup: "Hung up",
  transferred: "Transferred",
  failed: "Failed",
};

const OUTCOME_STYLE: Record<CallOutcome, string> = {
  booked: "bg-primary-50 text-primary-700 border-primary-200",
  no_availability: "bg-amber-50 text-amber-700 border-amber-200",
  hangup: "bg-neutral-100 text-neutral-500 border-neutral-200",
  transferred: "bg-teal-50 text-teal-700 border-teal-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const formatDuration = (seconds: number | null): string => {
  if (!seconds || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
};

const formatStarted = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const CallHistorySection: React.FC = () => {
  const dispatch = useCompanyAppDispatch();
  const { calls, loading, error } = useCompanyAppSelector((s) => s.voiceAgent);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCallLogs());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
          Recent calls
        </h2>
        <button
          onClick={() => dispatch(fetchCallLogs())}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-full hover:bg-neutral-50 disabled:opacity-40 transition-all"
        >
          <Icons.Refresh className="h-3 w-3" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Icons.AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
        </div>
      )}

      {calls.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-10 text-center">
          <Icons.Phone className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">No calls yet.</p>
          <p className="text-xs text-neutral-400 mt-1">
            Inbound calls to your Twilio number will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {calls.map((call) => (
            <CallRow
              key={call.call_id}
              call={call}
              isOpen={expanded === call.call_id}
              onToggle={() =>
                setExpanded((prev) =>
                  prev === call.call_id ? null : call.call_id,
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CallRow: React.FC<{
  call: CallLog;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ call, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
          <Icons.Phone className="h-4 w-4 text-neutral-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-neutral-900 font-mono">
              {call.from_number}
            </p>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${OUTCOME_STYLE[call.outcome]}`}
            >
              {OUTCOME_LABEL[call.outcome]}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {formatStarted(call.started_at)} · {formatDuration(call.duration_seconds)}
          </p>
        </div>
        <Icons.ChevronDown
          className={`h-4 w-4 text-neutral-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-neutral-100">
          {call.transcript ? (
            <div className="bg-neutral-50 rounded-xl p-3 mt-3 max-h-64 overflow-y-auto">
              <pre className="text-xs text-neutral-700 whitespace-pre-wrap font-mono leading-relaxed">
                {call.transcript}
              </pre>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 mt-3 italic">
              Transcript not available.
            </p>
          )}
          {call.booking_id && (
            <p className="text-xs text-neutral-500 mt-2">
              Linked booking:{" "}
              <span className="font-mono text-neutral-700">
                {call.booking_id}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CallHistorySection;

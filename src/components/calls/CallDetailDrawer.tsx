"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icons } from "@/components/ui";
import type { CallLog } from "@/app/(dashboard)/calls/page";

interface Props {
  log: CallLog | null;
  onClose: () => void;
  onViewAppointment: (id: string) => void;
}

const fmtDuration = (s: number | null) => {
  if (!s && s !== 0) return "—";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${String(r).padStart(2, "0")}s` : `${r}s`;
};

const fmtFull = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function CallDetailDrawer({ log, onClose, onViewAppointment }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // Drive the visual open/close so we can animate independently from React
  // mounting/unmounting (the panel can finish its slide-out before being
  // pulled from the DOM by the parent).
  useEffect(() => {
    if (log) {
      // Defer one tick so the initial transform applies before we transition.
      requestAnimationFrame(() => setOpen(true));
    } else {
      setOpen(false);
    }
  }, [log]);

  // Close on ESC
  useEffect(() => {
    if (!log) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [log, onClose]);

  const visible = useMemo(() => {
    if (!log) return [];
    return log.transcript.filter((t) => t.role === "user" || t.role === "assistant");
  }, [log]);

  if (!mounted || !log) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`relative h-full w-full max-w-xl bg-white shadow-2xl border-l border-neutral-200 flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                log.source === "twilio" ? "bg-primary-50" : "bg-neutral-100"
              }`}
            >
              <Icons.Phone
                className={`h-4 w-4 ${
                  log.source === "twilio" ? "text-primary-600" : "text-neutral-500"
                }`}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-neutral-900 truncate">
                  {log.source === "twilio" ? "Phone call" : "Browser test"}
                </h2>
                {log.appointment_id && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider border border-emerald-100">
                    <Icons.CheckCircle className="h-2.5 w-2.5" />
                    Booked
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {fmtFull(log.started_at)} · {fmtDuration(log.duration_sec)}
              </p>
              {log.caller_ref && (
                <p className="text-[11px] text-neutral-400 font-mono mt-1 truncate">
                  {log.caller_ref}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0 ml-2"
            title="Close"
          >
            <Icons.Close className="h-4 w-4 text-neutral-400" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 border-b border-neutral-100 flex-shrink-0">
          <DrawerStat label="Messages" value={visible.length.toString()} />
          <DrawerStat label="Duration" value={fmtDuration(log.duration_sec)} mono />
          <DrawerStat
            label="Outcome"
            value={log.appointment_id ? "Booked" : "—"}
            accent={!!log.appointment_id}
          />
        </div>

        {/* Transcript — chat bubbles, properly aligned */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-neutral-50/40">
          {visible.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Icons.MessageCircle className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500">No transcript captured</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visible.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${
                        isUser ? "text-primary-600" : "text-neutral-400"
                      }`}
                    >
                      {isUser ? "Caller" : "Agent"}
                    </span>
                    <div
                      className={`max-w-[78%] px-3.5 py-2 text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary-600 text-white rounded-2xl rounded-br-md"
                          : "bg-white text-neutral-800 border border-neutral-200 rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {log.appointment_id && (
          <div className="border-t border-neutral-100 px-6 py-4 flex-shrink-0 flex items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Icons.Calendar className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-900">Booking created</p>
                <p className="text-[11px] text-neutral-500">From this conversation</p>
              </div>
            </div>
            <button
              onClick={() => onViewAppointment(log.appointment_id!)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-colors flex-shrink-0"
            >
              View booking
              <Icons.ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </aside>
    </div>,
    document.body
  );
}

function DrawerStat({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="px-5 py-3 border-r border-neutral-100 last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p
        className={`text-sm font-semibold mt-0.5 ${
          accent ? "text-emerald-600" : "text-neutral-900"
        } ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

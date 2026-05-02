"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";
import type { Appointment } from "@/hooks/useAppointments";

const STATUS_BAR: Record<Appointment["status"], string> = {
  confirmed: "bg-teal-500 dark:bg-teal-400",
  completed: "bg-emerald-500",
  cancelled: "bg-slate-300 dark:bg-white/[0.10]",
  no_show: "bg-rose-400",
};

const STATUS_LABEL: Record<Appointment["status"], string> = {
  confirmed: "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-500/20",
  completed: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20",
  cancelled: "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06]",
  no_show: "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/20",
};

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-sidebar-bg rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-2xl shadow-slate-900/10 dark:shadow-black/60 w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top hairline glow — same recipe as the sidebar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent z-10" />
        {children}
      </div>
    </div>,
    document.body
  );
}

interface DetailProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
}

export function AppointmentDetailModal({ appointment: a, onClose, onUpdateStatus, onDelete }: DetailProps) {
  return (
    <ModalShell onClose={onClose}>
      <div className={`h-1 ${STATUS_BAR[a.status]}`} />
      <div className="px-5 py-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{a.caller_name || "Unknown"}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {new Date(a.scheduled_date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-white/[0.04] rounded-lg">
            <Icons.Close className="h-4 w-4 text-slate-400 dark:text-slate-400" />
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2.5">
            <Icons.Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">
              {a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)} ({a.duration_min} min)
            </span>
          </div>
          {a.caller_phone && (
            <div className="flex items-center gap-2.5">
              <Icons.Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">{a.caller_phone}</span>
            </div>
          )}
          {a.caller_email && (
            <div className="flex items-center gap-2.5">
              <Icons.Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">{a.caller_email}</span>
            </div>
          )}
          {a.service_type && (
            <div className="flex items-center gap-2.5">
              <Icons.Briefcase className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">{a.service_type}</span>
            </div>
          )}
          {a.notes && (
            <div className="flex items-start gap-2.5">
              <Icons.FileText className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-400">{a.notes}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 pt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_LABEL[a.status]}`}
            >
              {a.status.replace("_", " ")}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">
              via {a.source === "voice_agent" ? "Phone" : a.source}
            </span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-4 flex items-center gap-2">
        {a.status === "confirmed" && (
          <>
            <Button size="sm" onClick={() => onUpdateStatus(a.appointment_id, "completed")}>
              <Icons.Check className="h-3.5 w-3.5" />
              Done
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onUpdateStatus(a.appointment_id, "no_show")}
            >
              No Show
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(a.appointment_id, "cancelled")}
            >
              Cancel
            </Button>
          </>
        )}
        <div className="flex-1" />
        <button
          onClick={() => {
            if (confirm("Delete this appointment?")) onDelete(a.appointment_id);
          }}
          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg group"
          title="Delete"
        >
          <Icons.Trash className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-rose-500 transition-colors" />
        </button>
      </div>
    </ModalShell>
  );
}

interface AddProps {
  initialDate?: string;
  initialTime?: string;
  defaultDuration?: number;
  onClose: () => void;
  onCreate: (payload: {
    scheduled_date: string;
    start_time: string;
    duration_min: number;
    caller_name: string;
    caller_phone?: string | null;
    service_type?: string | null;
    notes?: string | null;
  }) => Promise<void>;
}

export function NewAppointmentModal({
  initialDate,
  initialTime,
  defaultDuration = 30,
  onClose,
  onCreate,
}: AddProps) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(initialTime || "09:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(defaultDuration);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name || !date || !time) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate({
        scheduled_date: date,
        start_time: time,
        duration_min: duration,
        caller_name: name,
        caller_phone: phone || null,
        service_type: service || null,
        notes: notes || null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create appointment");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] text-slate-900 dark:text-white px-3.5 py-2.5 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-500/30 focus:border-teal-400 dark:focus:border-teal-500/40 focus:bg-white dark:focus:bg-white/[0.04] transition-all [color-scheme:light] dark:[color-scheme:dark]";
  const labelCls = "text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block";

  return (
    <ModalShell onClose={onClose}>
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06]">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">New Appointment</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-white/[0.04] rounded-lg">
          <Icons.Close className="h-4 w-4 text-slate-400 dark:text-slate-400" />
        </button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div>
          <label className={labelCls}>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            className={inputCls}
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Time *</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1..."
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className={inputCls}
            >
              {[15, 30, 45, 60, 90, 120].map((d) => (
                <option key={d} value={d}>
                  {d} min
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Service</label>
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="e.g., Pipe repair"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>
        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      </div>
      <div className="px-5 pb-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={submit} loading={saving} disabled={!name || !date || !time}>
          Create
        </Button>
      </div>
    </ModalShell>
  );
}

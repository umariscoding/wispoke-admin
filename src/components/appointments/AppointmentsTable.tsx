"use client";

import React from "react";
import { Icons } from "@/components/ui";
import type { Appointment } from "@/hooks/useAppointments";

const STATUS_BADGE: Record<Appointment["status"], string> = {
  confirmed: "bg-primary-100 dark:bg-teal-500/15 text-primary-700 dark:text-primary-300",
  completed: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-neutral-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400",
  no_show: "bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

interface Props {
  appointments: Appointment[];
  emptyHint?: string;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
  onSelect?: (a: Appointment) => void;
}

export default function AppointmentsTable({
  appointments,
  emptyHint = "No appointments yet",
  onUpdateStatus,
  onDelete,
  onSelect,
}: Props) {
  if (appointments.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="mx-auto h-10 w-10 rounded-full bg-neutral-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
          <Icons.Calendar className="h-5 w-5 text-slate-400 dark:text-slate-400" />
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-400">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/[0.06]">
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date &amp; Time</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
            <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
          {appointments.map((a) => (
            <tr
              key={a.appointment_id}
              className={`hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors ${onSelect ? "cursor-pointer" : ""}`}
              onClick={() => onSelect?.(a)}
            >
              <td className="px-5 py-3">
                <p className="font-medium text-slate-900 dark:text-white">{a.caller_name || "—"}</p>
                {a.caller_phone && <p className="text-xs text-slate-500 dark:text-slate-400">{a.caller_phone}</p>}
              </td>
              <td className="px-5 py-3">
                <p className="text-slate-900 dark:text-white">
                  {new Date(a.scheduled_date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)}
                </p>
              </td>
              <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{a.service_type || "—"}</td>
              <td className="px-5 py-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {a.source === "voice_agent" ? "Phone" : a.source}
                </span>
              </td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_BADGE[a.status]}`}
                >
                  {a.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  {a.status === "confirmed" && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(a.appointment_id, "completed")}
                        className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Mark complete"
                      >
                        <Icons.Check className="h-3.5 w-3.5 text-emerald-500" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(a.appointment_id, "no_show")}
                        className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                        title="No show"
                      >
                        <Icons.UserX className="h-3.5 w-3.5 text-amber-500" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(a.appointment_id, "cancelled")}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/[0.04] rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <Icons.Close className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(a.appointment_id)}
                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors group"
                    title="Delete"
                  >
                    <Icons.Trash className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-rose-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

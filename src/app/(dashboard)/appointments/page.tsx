"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons, IOSContentLoader} from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import { useAppointments, type Appointment, type StatusFilter } from "@/hooks/useAppointments";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import {
  AppointmentDetailModal,
  NewAppointmentModal,
} from "@/components/appointments/AppointmentModals";

// Schedule-X depends on `window` — only load it on the client.
const AppointmentsCalendar = dynamic(
  () => import("@/components/appointments/AppointmentsCalendar"),
  { ssr: false, loading: () => <CalendarSkeleton /> }
);

function CalendarSkeleton() {
  return (
    <div style={{ height: 600 }}>
      <IOSContentLoader isLoading={true} message="Loading calendar..." />
    </div>
  );
}

type View = "calendar" | "table";

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "no_show", label: "No Show" },
];

export default function AppointmentsPage() {
  const { appointments, loading, counts, updateStatus, remove, create } = useAppointments();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deepLinkId = searchParams?.get("id") || null;

  const [view, setView] = useState<View>("calendar");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [adding, setAdding] = useState<{ date?: string; time?: string } | null>(null);

  // When deep-linked from /calls (?id=…) pop the detail modal once the
  // appointment list arrives, then strip the param so refresh doesn't replay.
  useEffect(() => {
    if (!deepLinkId || loading) return;
    const match = appointments.find((a) => a.appointment_id === deepLinkId);
    if (match) {
      setSelected(match);
      router.replace("/appointments");
    }
  }, [deepLinkId, loading, appointments, router]);

  const filtered = useMemo(() => {
    let list = appointments;
    if (filter !== "all") list = list.filter((a) => a.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          (a.caller_name || "").toLowerCase().includes(q) ||
          (a.caller_phone || "").includes(q) ||
          (a.service_type || "").toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) =>
      `${b.scheduled_date}${b.start_time}`.localeCompare(`${a.scheduled_date}${a.start_time}`)
    );
  }, [appointments, filter, search]);

  const handleUpdateStatus = async (id: string, status: Appointment["status"]) => {
    await updateStatus(id, status);
    setSelected((prev) => (prev?.appointment_id === id ? { ...prev, status } : prev));
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    setSelected(null);
  };

  if (loading) {
    return (
      <IOSContentLoader isLoading={true} message="Loading..." />
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-8 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Appointments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {counts.all} total
            {counts.confirmed > 0 && (
              <>
                {" · "}
                <span className="text-primary-600 dark:text-primary-400 font-medium">{counts.confirmed} upcoming</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-neutral-200 dark:border-white/[0.06] rounded-full p-0.5 gap-0.5 bg-white dark:bg-white/[0.02]">
            {(["calendar", "table"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all capitalize flex items-center gap-1.5 ${
                  view === v
                    ? "bg-primary-600 text-white dark:bg-teal-500/20 dark:text-teal-100 dark:border dark:border-teal-500/30 shadow-sm shadow-primary-600/25 dark:shadow-none"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
                }`}
              >
                {v === "calendar" ? (
                  <Icons.Calendar className="h-3.5 w-3.5" />
                ) : (
                  <Icons.FileText className="h-3.5 w-3.5" />
                )}
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAdding({})}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 hover:bg-teal-500 dark:hover:bg-teal-500/25 dark:border dark:border-teal-500/30 text-white text-sm font-semibold transition-all active:scale-[0.97]"
          >
            <Icons.Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
      </div>

      {/* Filter bar — only shown for table view */}
      {view === "table" && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] rounded-full p-1 gap-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  filter === f.key
                    ? "bg-primary-600 text-white dark:bg-teal-500/20 dark:text-teal-100 dark:border dark:border-teal-500/30 shadow-sm shadow-primary-600/25 dark:shadow-none"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
                }`}
              >
                {f.label}
                {counts[f.key] > 0 && <span className="ml-1 opacity-70">({counts[f.key]})</span>}
              </button>
            ))}
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, service..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-white/[0.10] bg-white dark:bg-white/[0.04] text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-500/40 focus:border-teal-400 dark:focus:border-teal-500/50 transition-all w-64"
            />
          </div>
        </div>
      )}

      {/* Body */}
      {view === "calendar" ? (
        <AppointmentsCalendar
          appointments={appointments}
          onSelect={setSelected}
          onSlotClick={(date, time) => setAdding({ date, time })}
        />
      ) : (
        <div className="bg-white dark:bg-white/[0.02] rounded-xl border border-neutral-200 dark:border-white/[0.06] overflow-hidden">
          <AppointmentsTable
            appointments={filtered}
            emptyHint={search ? "No results found" : "No appointments yet"}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            onSelect={setSelected}
          />
        </div>
      )}

      {/* Modals */}
      {selected && (
        <AppointmentDetailModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}
      {adding && (
        <NewAppointmentModal
          initialDate={adding.date}
          initialTime={adding.time}
          onClose={() => setAdding(null)}
          onCreate={async (payload) => {
            await create(payload);
          }}
        />
      )}
    </div>
  );
}

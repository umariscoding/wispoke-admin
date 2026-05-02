"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { companyApi } from "@/utils/company/api";
import { Icons } from "@/components/ui";
import type { Appointment } from "@/hooks/useAppointments";

interface ScheduleSlot {
  day_of_week: number; // 0 = Sunday … 6 = Saturday
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface ExceptionRow {
  exception_date: string;
  is_available: boolean;
}

interface Props {
  appointments: Appointment[];
  onSelect: (a: Appointment) => void;
  onSlotClick?: (date: string, time: string) => void;
}

// ─── Constants ────────────────────────────────────────────────
const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const FIRST_HOUR = 7;       // calendar starts at 7am
const LAST_HOUR = 21;       // ends at 9pm
const HOUR_HEIGHT = 56;     // px per hour (gives 28px per 30-min slot)
const TIME_COL_WIDTH = 56;  // left gutter for hour labels
const GRID_TOP_PAD = 12;    // breathing room so the first hour label isn't clipped

const STATUS_STYLE: Record<
  Appointment["status"],
  { bg: string; bar: string; text: string; dot: string }
> = {
  confirmed: {
    bg: "bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100",
    bar: "bg-primary-600",
    text: "text-primary-900",
    dot: "bg-primary-600",
  },
  completed: {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    bar: "bg-emerald-600",
    text: "text-emerald-900",
    dot: "bg-emerald-600",
  },
  cancelled: {
    bg: "bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    bar: "bg-neutral-300",
    text: "text-neutral-500 dark:text-neutral-400 line-through",
    dot: "bg-neutral-300",
  },
  no_show: {
    bg: "bg-red-50 hover:bg-red-100",
    bar: "bg-red-500",
    text: "text-red-900",
    dot: "bg-red-500",
  },
};

// ─── Date helpers ─────────────────────────────────────────────
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function startOfWeek(d: Date) {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - s.getDay());
  return s;
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}
function fmtHour(h: number) {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

// Compute side-by-side columns for overlapping appointments within a single day.
function layoutDay(items: Appointment[]) {
  const sorted = [...items].sort((a, b) => a.start_time.localeCompare(b.start_time));
  const placed: Array<Appointment & { col: number; cols: number }> = [];
  // Greedy column assignment: walk events in order, track active columns.
  type Active = { end: number; col: number };
  const active: Active[] = [];

  for (const a of sorted) {
    const start = toMin(a.start_time);
    const end = toMin(a.end_time);
    // Drop columns whose event has finished.
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= start) active.splice(i, 1);
    }
    // Pick the lowest free column.
    const used = new Set(active.map((x) => x.col));
    let col = 0;
    while (used.has(col)) col++;
    active.push({ end, col });
    placed.push({ ...a, col, cols: 0 });
  }
  // For each event, determine the max column count it overlaps with.
  for (const p of placed) {
    const ps = toMin(p.start_time);
    const pe = toMin(p.end_time);
    let maxCol = p.col;
    for (const q of placed) {
      const qs = toMin(q.start_time);
      const qe = toMin(q.end_time);
      if (ps < qe && pe > qs) maxCol = Math.max(maxCol, q.col);
    }
    p.cols = maxCol + 1;
  }
  return placed;
}

// ─── Component ────────────────────────────────────────────────
export default function AppointmentsCalendar({
  appointments,
  onSelect,
  onSlotClick,
}: Props) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [exceptions, setExceptions] = useState<ExceptionRow[]>([]);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const todayStr = ymd(new Date());

  // Fetch availability once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, e] = await Promise.all([
          companyApi.get("/availability/schedule"),
          companyApi.get("/availability/exceptions"),
        ]);
        if (cancelled) return;
        setSchedule(s.data.schedules || []);
        setExceptions(e.data.exceptions || []);
      } catch {
        /* non-fatal */
      } finally {
        if (!cancelled) setAvailabilityLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll to "now" on mount, or 9am if not in range.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const now = new Date();
    const hour = now.getHours();
    const target = hour >= FIRST_HOUR && hour < LAST_HOUR ? hour - 1 : 9 - FIRST_HOUR;
    el.scrollTop = Math.max(0, target * HOUR_HEIGHT);
  }, []);

  const week = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Index appointments by date for cheap lookup.
  const byDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const a of appointments) {
      if (a.status === "cancelled") continue; // hide cancelled in grid; visible in table
      (map[a.scheduled_date] ||= []).push(a);
    }
    return map;
  }, [appointments]);

  // Build a per-weekday "is hour available" lookup, with full-day exceptions.
  const blockedDates = useMemo(
    () => new Set(exceptions.filter((e) => !e.is_available).map((e) => e.exception_date)),
    [exceptions]
  );
  const isHourAvailable = useCallback(
    (date: Date, hour: number) => {
      // While loading, treat every hour as available — avoids a flash of all
      // cells striped on first paint before the availability fetch resolves.
      if (!availabilityLoaded) return true;
      if (blockedDates.has(ymd(date))) return false;
      const dow = date.getDay();
      const slots = schedule.filter((s) => s.day_of_week === dow && s.is_active);
      return slots.some((s) => {
        const sh = toMin(s.start_time) / 60;
        const eh = toMin(s.end_time) / 60;
        return hour >= sh && hour < eh;
      });
    },
    [schedule, blockedDates, availabilityLoaded]
  );

  // Contiguous closed-hour spans per day, in [startHour, endHour) form. Each
  // span renders as ONE striped block so the diagonal pattern stays continuous
  // across cell boundaries (per-cell backgrounds caused visible seams).
  const closedSpansByDate = useMemo(() => {
    const out: Record<string, Array<[number, number]>> = {};
    if (!availabilityLoaded) return out;
    for (const d of week) {
      const ds = ymd(d);
      const spans: Array<[number, number]> = [];
      let runStart: number | null = null;
      for (let h = FIRST_HOUR; h < LAST_HOUR; h++) {
        const closed = !isHourAvailable(d, h);
        if (closed && runStart === null) runStart = h;
        if (!closed && runStart !== null) {
          spans.push([runStart, h]);
          runStart = null;
        }
      }
      if (runStart !== null) spans.push([runStart, LAST_HOUR]);
      out[ds] = spans;
    }
    return out;
  }, [week, isHourAvailable, availabilityLoaded]);

  const headerLabel = useMemo(() => {
    const a = week[0];
    const b = week[6];
    if (a.getMonth() === b.getMonth()) {
      return a.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    if (a.getFullYear() === b.getFullYear()) {
      return `${a.toLocaleDateString("en-US", { month: "short" })} – ${b.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    }
    return `${a.toLocaleDateString("en-US", { month: "short", year: "numeric" })} – ${b.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
  }, [week]);

  const hours = useMemo(
    () => Array.from({ length: LAST_HOUR - FIRST_HOUR }, (_, i) => i + FIRST_HOUR),
    []
  );

  // Current-time indicator position
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const nowVisible = nowMin >= FIRST_HOUR * 60 && nowMin < LAST_HOUR * 60;
  const nowTop = GRID_TOP_PAD + ((nowMin - FIRST_HOUR * 60) / 60) * HOUR_HEIGHT;

  const navWeek = (dir: -1 | 1) => setWeekStart((d) => addDays(d, dir * 7));
  const goToday = () => setWeekStart(startOfWeek(new Date()));

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
      {/* ─── Toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center ml-1">
            <button
              onClick={() => navWeek(-1)}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              title="Previous week"
            >
              <Icons.ChevronLeft className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={() => navWeek(1)}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              title="Next week"
            >
              <Icons.ChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 ml-2">{headerLabel}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Legend />
        </div>
      </div>

      {/* ─── Day headers ──────────────────────────────────────── */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <div style={{ width: TIME_COL_WIDTH }} className="flex-shrink-0" />
        <div className="flex flex-1">
          {week.map((d) => {
            const ds = ymd(d);
            const isToday = ds === todayStr;
            const isPast = ds < todayStr;
            return (
              <div
                key={ds}
                className={`flex-1 min-w-0 border-l border-neutral-200 dark:border-neutral-800 py-2 text-center ${
                  isToday ? "bg-primary-50/40 dark:bg-primary-900/20" : ""
                }`}
              >
                <p
                  className={`text-[10px] font-semibold tracking-wider ${
                    isToday ? "text-primary-700 dark:text-primary-300" : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {DAY_LABELS[d.getDay()]}
                </p>
                <div className="flex items-center justify-center mt-0.5">
                  {isToday ? (
                    <span className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
                      {d.getDate()}
                    </span>
                  ) : (
                    <span
                      className={`text-base font-semibold ${
                        isPast ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-800 dark:text-neutral-100"
                      }`}
                    >
                      {d.getDate()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Time grid ────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ maxHeight: 640 }}>
        <div
          className="flex relative"
          style={{ height: hours.length * HOUR_HEIGHT + GRID_TOP_PAD, paddingTop: GRID_TOP_PAD }}
        >
          {/* Time gutter — labels nudged down so the first one isn't clipped. */}
          <div
            style={{ width: TIME_COL_WIDTH }}
            className="flex-shrink-0 relative border-r border-neutral-200 dark:border-neutral-800"
          >
            {hours.map((h, i) => (
              <div
                key={h}
                className="absolute right-2"
                style={{ top: GRID_TOP_PAD + i * HOUR_HEIGHT - 6 }}
              >
                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 select-none">
                  {fmtHour(h)}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="flex flex-1 relative">
            {week.map((d) => {
              const ds = ymd(d);
              const isToday = ds === todayStr;
              const dayAppts = byDate[ds] || [];
              const placed = layoutDay(dayAppts);

              return (
                <DayColumn
                  key={ds}
                  date={d}
                  isToday={isToday}
                  hours={hours}
                  isHourAvailable={isHourAvailable}
                  closedSpans={closedSpansByDate[ds] || []}
                  appointments={placed}
                  onSelect={onSelect}
                  onSlotClick={onSlotClick}
                />
              );
            })}

            {/* Now indicator — full-width across day columns */}
            {nowVisible &&
              week.some((d) => ymd(d) === todayStr) && (
                <NowIndicator top={nowTop} columnIndex={now.getDay()} />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Day Column ───────────────────────────────────────────────
const DayColumn = React.memo(function DayColumn({
  date,
  isToday,
  hours,
  isHourAvailable,
  closedSpans,
  appointments,
  onSelect,
  onSlotClick,
}: {
  date: Date;
  isToday: boolean;
  hours: number[];
  isHourAvailable: (d: Date, h: number) => boolean;
  closedSpans: Array<[number, number]>;
  appointments: Array<Appointment & { col: number; cols: number }>;
  onSelect: (a: Appointment) => void;
  onSlotClick?: (date: string, time: string) => void;
}) {
  const ds = ymd(date);

  return (
    <div
      className={`flex-1 min-w-0 relative border-l border-neutral-200 dark:border-neutral-800 ${
        isToday ? "bg-primary-50/20 dark:bg-primary-900/20" : ""
      }`}
    >
      {/* Closed regions — one striped block per contiguous span so the
          diagonal pattern stays continuous across hour boundaries. */}
      {closedSpans.map(([from, to]) => (
        <div
          key={`${from}-${to}`}
          aria-hidden
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: GRID_TOP_PAD + (from - FIRST_HOUR) * HOUR_HEIGHT,
            height: (to - from) * HOUR_HEIGHT,
            backgroundColor: "#fafbfc",
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent 0 7px, rgba(15,23,42,0.07) 7px 8px)",
          }}
        />
      ))}

      {/* Hour rows — solid line at the top of each hour, dashed at the half. */}
      {hours.map((h, i) => {
        const available = isHourAvailable(date, h);
        return (
          <div
            key={h}
            className="absolute left-0 right-0 border-t border-neutral-200 dark:border-neutral-800"
            style={{ top: GRID_TOP_PAD + i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
          >
            <button
              onClick={() => onSlotClick?.(ds, `${String(h).padStart(2, "0")}:00`)}
              className={`absolute inset-x-0 top-0 h-1/2 transition-colors ${
                available ? "hover:bg-primary-100/70" : "cursor-not-allowed"
              }`}
              disabled={!available}
            />
            <button
              onClick={() => onSlotClick?.(ds, `${String(h).padStart(2, "0")}:30`)}
              className={`absolute inset-x-0 bottom-0 h-1/2 border-t border-dashed border-neutral-200/70 dark:border-neutral-800/70 transition-colors ${
                available ? "hover:bg-primary-100/70" : "cursor-not-allowed"
              }`}
              disabled={!available}
            />
          </div>
        );
      })}

      {/* Appointment blocks — render last so they stack above hover cells. */}
      {appointments.map((a) => (
        <AppointmentBlock key={a.appointment_id} appt={a} onSelect={onSelect} />
      ))}
    </div>
  );
});

// ─── Appointment Block ────────────────────────────────────────
const AppointmentBlock = React.memo(function AppointmentBlock({
  appt,
  onSelect,
}: {
  appt: Appointment & { col: number; cols: number };
  onSelect: (a: Appointment) => void;
}) {
  const startMin = toMin(appt.start_time);
  const endMin = toMin(appt.end_time);
  const top = GRID_TOP_PAD + ((startMin - FIRST_HOUR * 60) / 60) * HOUR_HEIGHT;
  const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 22);

  const widthPct = 100 / appt.cols;
  const leftPct = appt.col * widthPct;
  const style = STATUS_STYLE[appt.status];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelect(appt);
      }}
      className={`absolute rounded-md overflow-hidden text-left transition-all hover:shadow-md hover:z-20 ${style.bg}`}
      style={{
        top,
        height,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        zIndex: 10,
      }}
    >
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`} />
      <div className={`pl-2.5 pr-1.5 py-1 ${style.text}`}>
        <p className="text-[12px] font-semibold truncate leading-tight">
          {appt.caller_name || "—"}
        </p>
        {height > 36 && (
          <p className="text-[10px] opacity-70 truncate mt-0.5">
            {appt.start_time.slice(0, 5)}–{appt.end_time.slice(0, 5)}
            {appt.service_type && ` · ${appt.service_type}`}
          </p>
        )}
      </div>
    </button>
  );
});

// ─── Now indicator ────────────────────────────────────────────
function NowIndicator({ top, columnIndex }: { top: number; columnIndex: number }) {
  // The dot anchors to today's column; the line spans the whole grid for visibility.
  const leftPct = (columnIndex / 7) * 100;
  return (
    <div
      className="absolute left-0 right-0 z-30 pointer-events-none"
      style={{ top: top - 1 }}
    >
      <div className="relative h-0.5 bg-red-500/80">
        <div
          className="absolute -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white"
          style={{ left: `calc(${leftPct}% - 5px)`, top: 1 }}
        />
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────
function Legend() {
  const items = [
    { label: "Confirmed", dot: "bg-primary-600" },
    { label: "Completed", dot: "bg-emerald-600" },
    { label: "No-show", dot: "bg-red-500" },
  ];
  return (
    <div className="hidden sm:flex items-center gap-3 mr-1">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${it.dot}`} />
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

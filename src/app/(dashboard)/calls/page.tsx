"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { companyApi } from "@/utils/company/api";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import CallDetailDrawer from "@/components/calls/CallDetailDrawer";

export interface TranscriptEntry {
  role: "user" | "assistant" | "tool" | "tool_call" | "system" | string;
  content: string;
}

export interface CallLog {
  call_log_id: string;
  company_id: string;
  source: "browser" | "twilio";
  started_at: string;
  ended_at: string | null;
  duration_sec: number | null;
  transcript: TranscriptEntry[];
  appointment_id: string | null;
  caller_ref: string | null;
}

interface CallLogsResponse {
  call_logs: CallLog[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;

type Filter = "all" | "booked" | "no_booking";

const fmtDuration = (s: number | null) => {
  if (!s && s !== 0) return "—";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${String(r).padStart(2, "0")}s` : `${r}s`;
};

const fmtRelative = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return `Today, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) {
    return `Yesterday, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const callerLabel = (log: CallLog): string => {
  // Try to glean the caller's name from the transcript or fallback to source.
  const fromTranscript = log.transcript.find(
    (t) => t.role === "user" && t.content && t.content.length < 80
  );
  if (log.caller_ref && log.caller_ref.startsWith("+")) return log.caller_ref;
  if (fromTranscript) return fromTranscript.content;
  return log.source === "twilio" ? "Phone caller" : "Browser test";
};

export default function CallsPage() {
  const router = useRouter();

  const [logs, setLogs] = useState<CallLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [drawerLog, setDrawerLog] = useState<CallLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await companyApi.get<CallLogsResponse>("/voice-agent/call-logs", {
        params: { limit: pageSize, offset: page * pageSize },
      });
      setLogs(r.data.call_logs || []);
      setTotal(r.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const visibleLogs = useMemo(() => {
    let list = logs;
    if (filter === "booked") list = list.filter((l) => l.appointment_id);
    else if (filter === "no_booking") list = list.filter((l) => !l.appointment_id);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((l) =>
        [l.caller_ref, ...l.transcript.map((t) => t.content)]
          .filter(Boolean)
          .some((s) => (s as string).toLowerCase().includes(q))
      );
    }
    return list;
  }, [logs, filter, search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startNum = total === 0 ? 0 : page * pageSize + 1;
  const endNum = Math.min(total, page * pageSize + logs.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <IOSLoader size="md" color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto pb-8 space-y-5">
        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Calls</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Voice agent conversation history.{" "}
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">{total}</span> total ·{" "}
              <span className="text-emerald-600 font-medium">
                {logs.filter((l) => l.appointment_id).length}
              </span>{" "}
              booked on this page
            </p>
          </div>
          <button
            onClick={fetchLogs}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-full transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
          >
            <Icons.Refresh className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ─── Filter bar ─────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-full p-1 gap-0.5">
            {(
              [
                { key: "all", label: "All" },
                { key: "booked", label: "Booked" },
                { key: "no_booking", label: "No booking" },
              ] as { key: Filter; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  filter === f.key
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transcripts..."
              className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all w-72"
            />
          </div>
        </div>

        {/* ─── Table ──────────────────────────────────────────── */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {visibleLogs.length === 0 ? (
            <EmptyState search={search} filter={filter} hasAny={total > 0} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/40">
                    <Th>Caller</Th>
                    <Th>Source</Th>
                    <Th>Started</Th>
                    <Th align="right">Duration</Th>
                    <Th>Outcome</Th>
                    <Th align="right">{""}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {visibleLogs.map((log) => (
                    <CallRow
                      key={log.call_log_id}
                      log={log}
                      onOpen={() => setDrawerLog(log)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {total > 0 && (
            <PaginationFooter
              startNum={startNum}
              endNum={endNum}
              total={total}
              pageSize={pageSize}
              setPageSize={setPageSize}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}
        </div>
      </div>

      <CallDetailDrawer
        log={drawerLog}
        onClose={() => setDrawerLog(null)}
        onViewAppointment={(id) => {
          setDrawerLog(null);
          router.push(`/appointments?id=${id}`);
        }}
      />
    </>
  );
}

// ─── Table primitives ─────────────────────────────────────────

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-2.5 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.06em] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function CallRow({ log, onOpen }: { log: CallLog; onOpen: () => void }) {
  const caller = callerLabel(log);
  return (
    <tr
      onClick={onOpen}
      className="group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              log.source === "twilio" ? "bg-primary-50 dark:bg-primary-900/20" : "bg-neutral-100 dark:bg-neutral-800"
            }`}
          >
            <Icons.Phone
              className={`h-3.5 w-3.5 ${
                log.source === "twilio" ? "text-primary-600 dark:text-primary-400" : "text-neutral-500 dark:text-neutral-400"
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate max-w-[260px]">
              {caller}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate max-w-[260px]">
              {log.transcript.filter((t) => t.role === "user" || t.role === "assistant").length}{" "}
              messages
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
            log.source === "twilio"
              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          }`}
        >
          {log.source === "twilio" ? "Phone" : "Browser"}
        </span>
      </td>
      <td className="px-5 py-3.5 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
        {fmtRelative(log.started_at)}
      </td>
      <td className="px-5 py-3.5 text-right font-mono text-[12px] text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
        {fmtDuration(log.duration_sec)}
      </td>
      <td className="px-5 py-3.5">
        {log.appointment_id ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider border border-emerald-100">
            <Icons.CheckCircle className="h-2.5 w-2.5" />
            Booked
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 text-[10px] font-semibold uppercase tracking-wider border border-neutral-100 dark:border-neutral-800">
            —
          </span>
        )}
      </td>
      <td className="px-5 py-3.5 text-right">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
          View
          <Icons.ChevronRight className="h-3.5 w-3.5" />
        </span>
      </td>
    </tr>
  );
}

function EmptyState({
  search,
  filter,
  hasAny,
}: {
  search: string;
  filter: Filter;
  hasAny: boolean;
}) {
  let title = "No calls yet";
  let hint = "When customers call your voice agent, conversations will appear here.";
  if (hasAny && (search || filter !== "all")) {
    title = "No matches";
    hint = "Try a different search or filter.";
  }
  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto h-11 w-11 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
        <Icons.Phone className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
      </div>
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{title}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-xs mx-auto">{hint}</p>
    </div>
  );
}

function PaginationFooter({
  startNum,
  endNum,
  total,
  pageSize,
  setPageSize,
  page,
  totalPages,
  setPage,
}: {
  startNum: number;
  endNum: number;
  total: number;
  pageSize: number;
  setPageSize: (n: number) => void;
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/40 text-xs text-neutral-500 dark:text-neutral-400">
      <div className="flex items-center gap-3">
        <span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            {startNum}–{endNum}
          </span>{" "}
          of <span className="font-semibold text-neutral-700 dark:text-neutral-300">{total}</span>
        </span>
        <span className="text-neutral-300 dark:text-neutral-600">·</span>
        <label className="flex items-center gap-1.5">
          <span>Rows</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <PageBtn onClick={() => setPage(0)} disabled={page === 0} title="First page">
          <Icons.ChevronLeft className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
          <Icons.ChevronLeft className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400 -ml-2.5" />
        </PageBtn>
        <PageBtn
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          title="Previous page"
        >
          <Icons.ChevronLeft className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
        </PageBtn>
        <span className="px-3 font-medium text-neutral-700 dark:text-neutral-300 tabular-nums">
          {page + 1} / {totalPages}
        </span>
        <PageBtn
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          title="Next page"
        >
          <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
        </PageBtn>
        <PageBtn
          onClick={() => setPage(totalPages - 1)}
          disabled={page >= totalPages - 1}
          title="Last page"
        >
          <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
          <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400 -ml-2.5" />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex items-center px-1.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

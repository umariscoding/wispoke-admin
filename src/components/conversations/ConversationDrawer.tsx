"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import { companyApi } from "@/utils/company/api";

export interface TranscriptMessage {
  role: string;
  content: string;
  timestamp: number;
}

export interface ConversationDetail {
  chat_id: string;
  session_id: string | null;
  started_at: string;
  ip_address: string | null;
  user_agent: string | null;
  messages: TranscriptMessage[];
  message_count: number;
}

interface Props {
  chatId: string | null;
  onClose: () => void;
}

const fmtFull = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const fmtMessageTime = (ms: number) => {
  if (!ms) return "";
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const shortAgent = (ua: string | null) => {
  if (!ua) return null;
  const m = ua.match(/(Chrome|Firefox|Safari|Edge|Edg|Opera)[\/\s]([\d.]+)/);
  if (m) return `${m[1]} ${m[2].split(".")[0]}`;
  return ua.slice(0, 40);
};

export default function ConversationDrawer({ chatId, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (chatId) {
      requestAnimationFrame(() => setOpen(true));
    } else {
      setOpen(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [chatId, onClose]);

  useEffect(() => {
    if (!chatId) {
      setDetail(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    companyApi
      .get<ConversationDetail>(`/api/company/analytics/conversations/${chatId}`)
      .then((r) => {
        if (!cancelled) setDetail(r.data);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.response?.data?.detail || "Failed to load conversation");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [chatId]);

  const visible = useMemo(() => {
    if (!detail) return [];
    return detail.messages.filter((m) => m.role === "human" || m.role === "ai");
  }, [detail]);

  if (!mounted || !chatId) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        onClick={(e) => e.stopPropagation()}
        className={`relative h-full w-full max-w-xl bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
              <Icons.MessageCircle className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                  Embed conversation
                </h2>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-semibold uppercase tracking-wider border border-neutral-200 dark:border-neutral-800">
                  Anonymous
                </span>
              </div>
              {detail && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {fmtFull(detail.started_at)}
                </p>
              )}
              {detail?.ip_address && (
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono mt-1 truncate">
                  {detail.ip_address}
                  {shortAgent(detail.user_agent) && ` · ${shortAgent(detail.user_agent)}`}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 ml-2"
            title="Close"
          >
            <Icons.Close className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
          </button>
        </div>

        {/* Stats strip */}
        {detail && (
          <div className="grid grid-cols-2 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
            <DrawerStat label="Messages" value={visible.length.toString()} />
            <DrawerStat
              label="Session"
              value={detail.session_id ? detail.session_id.slice(0, 8) : "—"}
              mono
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-neutral-50/40 dark:bg-neutral-950/40">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <IOSLoader size="md" color="primary" />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full bg-error-50 dark:bg-error-900/20 flex items-center justify-center mb-3">
                <Icons.AlertTriangle className="h-5 w-5 text-error-500 dark:text-error-400" />
              </div>
              <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <Icons.MessageCircle className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No messages in this conversation</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visible.map((m, i) => {
                const isUser = m.role === "human";
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${
                        isUser ? "text-primary-600 dark:text-primary-400" : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      {isUser ? "Visitor" : "Bot"}
                      {m.timestamp ? ` · ${fmtMessageTime(m.timestamp)}` : ""}
                    </span>
                    <div
                      className={`max-w-[78%] px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-primary-600 text-white rounded-2xl rounded-br-md"
                          : "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-2xl rounded-bl-md"
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
      </aside>
    </div>,
    document.body
  );
}

function DrawerStat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-5 py-3 border-r border-neutral-100 dark:border-neutral-800 last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
      </p>
      <p
        className={`text-sm font-semibold mt-0.5 text-neutral-900 dark:text-neutral-50 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

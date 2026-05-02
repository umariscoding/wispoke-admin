"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { companyApi } from "@/utils/company/api";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import ConversationDrawer from "@/components/conversations/ConversationDrawer";

interface ConversationListItem {
  chat_id: string;
  session_id: string | null;
  started_at: string;
  last_message_at: string | null;
  message_count: number;
  preview: string;
  ip_address: string | null;
}

interface ConversationsListResponse {
  conversations: ConversationListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;

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

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [drawerChatId, setDrawerChatId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const r = await companyApi.get<ConversationsListResponse>(
        "/api/company/analytics/conversations",
        { params: { page, page_size: pageSize } }
      );
      setConversations(r.data.conversations || []);
      setTotal(r.data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Failed to load conversations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const visible = useMemo(() => {
    if (!search) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) =>
      [c.preview, c.ip_address, c.chat_id]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startNum = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endNum = Math.min(total, (page - 1) * pageSize + conversations.length);

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
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Conversations
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Embed widget chat history.{" "}
              <span className="text-neutral-700 font-medium">{total}</span> total
            </p>
          </div>
          <button
            onClick={fetchConversations}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-700 border border-neutral-200 bg-white rounded-full transition-colors hover:bg-neutral-100 disabled:opacity-50"
          >
            <Icons.Refresh className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-error-50 border border-error-200 rounded-lg p-3.5">
            <Icons.AlertTriangle className="h-4 w-4 text-error-500 flex-shrink-0" />
            <p className="text-sm text-error-700 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-error-400 hover:text-error-600"
            >
              <Icons.Close className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all w-72"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {visible.length === 0 ? (
            <EmptyState search={search} hasAny={total > 0} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/40">
                    <Th>Visitor</Th>
                    <Th>First message</Th>
                    <Th>Started</Th>
                    <Th align="right">Messages</Th>
                    <Th align="right">{""}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {visible.map((c) => (
                    <ConversationRow
                      key={c.chat_id}
                      conversation={c}
                      onOpen={() => setDrawerChatId(c.chat_id)}
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

      <ConversationDrawer
        chatId={drawerChatId}
        onClose={() => setDrawerChatId(null)}
      />
    </>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-2.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.06em] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function ConversationRow({
  conversation,
  onOpen,
}: {
  conversation: ConversationListItem;
  onOpen: () => void;
}) {
  const visitorLabel = conversation.ip_address || "Anonymous";

  return (
    <tr
      onClick={onOpen}
      className="group cursor-pointer hover:bg-neutral-50 transition-colors"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
            <Icons.User className="h-3.5 w-3.5 text-neutral-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate max-w-[180px] font-mono">
              {visitorLabel}
            </p>
            <p className="text-[11px] text-neutral-400 truncate max-w-[180px]">
              {conversation.session_id
                ? conversation.session_id.slice(0, 8)
                : "no session"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <p className="text-sm text-neutral-700 truncate max-w-[360px]">
          {conversation.preview || (
            <span className="text-neutral-400 italic">No messages yet</span>
          )}
        </p>
      </td>
      <td className="px-5 py-3.5 text-neutral-700 whitespace-nowrap">
        {fmtRelative(conversation.started_at)}
      </td>
      <td className="px-5 py-3.5 text-right">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold tabular-nums">
          {conversation.message_count}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 group-hover:text-primary-700 transition-colors">
          View
          <Icons.ChevronRight className="h-3.5 w-3.5" />
        </span>
      </td>
    </tr>
  );
}

function EmptyState({
  search,
  hasAny,
}: {
  search: string;
  hasAny: boolean;
}) {
  let title = "No conversations yet";
  let hint = "When visitors chat with your embed widget, conversations will appear here.";
  if (hasAny && search) {
    title = "No matches";
    hint = "Try a different search.";
  }
  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto h-11 w-11 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
        <Icons.MessageCircle className="h-5 w-5 text-neutral-400" />
      </div>
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">{hint}</p>
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
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-neutral-100 bg-neutral-50/40 text-xs text-neutral-500">
      <div className="flex items-center gap-3">
        <span>
          <span className="font-semibold text-neutral-700">
            {startNum}–{endNum}
          </span>{" "}
          of <span className="font-semibold text-neutral-700">{total}</span>
        </span>
        <span className="text-neutral-300">·</span>
        <label className="flex items-center gap-1.5">
          <span>Rows</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
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
        <PageBtn onClick={() => setPage(1)} disabled={page === 1} title="First page">
          <Icons.ChevronLeft className="h-3.5 w-3.5 text-neutral-600" />
          <Icons.ChevronLeft className="h-3.5 w-3.5 text-neutral-600 -ml-2.5" />
        </PageBtn>
        <PageBtn
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          title="Previous page"
        >
          <Icons.ChevronLeft className="h-3.5 w-3.5 text-neutral-600" />
        </PageBtn>
        <span className="px-3 font-medium text-neutral-700 tabular-nums">
          {page} / {totalPages}
        </span>
        <PageBtn
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          title="Next page"
        >
          <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
        </PageBtn>
        <PageBtn
          onClick={() => setPage(totalPages)}
          disabled={page >= totalPages}
          title="Last page"
        >
          <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
          <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-600 -ml-2.5" />
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
      className="inline-flex items-center px-1.5 py-1.5 hover:bg-neutral-100 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

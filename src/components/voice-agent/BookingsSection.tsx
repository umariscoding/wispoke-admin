"use client";

import React, { useEffect, useMemo } from "react";
import { Icons } from "@/components/ui";
import {
  useCompanyAppDispatch,
  useCompanyAppSelector,
} from "@/hooks/company/useCompanyAuth";
import {
  cancelBooking,
  fetchBookings,
} from "@/store/company/slices/voiceAgentSlice";
import type { Booking, BookingStatus } from "@/types/voiceAgent";

const STATUS_STYLES: Record<BookingStatus, string> = {
  scheduled: "bg-primary-50 text-primary-700 border-primary-200",
  completed: "bg-teal-50 text-teal-700 border-teal-200",
  cancelled: "bg-neutral-100 text-neutral-500 border-neutral-200",
  no_show: "bg-amber-50 text-amber-700 border-amber-200",
};

const formatScheduled = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const BookingsSection: React.FC = () => {
  const dispatch = useCompanyAppDispatch();
  const { bookings, loading, error } = useCompanyAppSelector(
    (s) => s.voiceAgent,
  );

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const grouped = useMemo(() => {
    const upcoming: Booking[] = [];
    const past: Booking[] = [];
    const now = Date.now();
    for (const b of bookings) {
      if (
        b.status === "scheduled" &&
        new Date(b.scheduled_at).getTime() >= now
      ) {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    }
    upcoming.sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    );
    past.sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
    );
    return { upcoming, past };
  }, [bookings]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
          Appointments
        </h2>
        <button
          onClick={() => dispatch(fetchBookings())}
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

      <BookingGroup
        title="Upcoming"
        bookings={grouped.upcoming}
        emptyMessage="No upcoming appointments yet."
        onCancel={(id) => dispatch(cancelBooking(id))}
      />
      <BookingGroup
        title="Past"
        bookings={grouped.past}
        emptyMessage="No past appointments."
      />
    </div>
  );
};

const BookingGroup: React.FC<{
  title: string;
  bookings: Booking[];
  emptyMessage: string;
  onCancel?: (bookingId: string) => void;
}> = ({ title, bookings, emptyMessage, onCancel }) => (
  <div>
    <p className="text-xs font-semibold text-neutral-500 mb-2 px-1">{title}</p>
    {bookings.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-10 text-center">
        <p className="text-sm text-neutral-400">{emptyMessage}</p>
      </div>
    ) : (
      <div className="space-y-2">
        {bookings.map((b) => (
          <div
            key={b.booking_id}
            className="bg-white rounded-2xl border border-neutral-200 px-4 py-3 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Icons.User className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {b.customer_name}
                </p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${STATUS_STYLES[b.status]}`}
                >
                  {b.status.replace("_", " ")}
                </span>
                {b.source === "voice_agent" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200 uppercase tracking-wider flex items-center gap-1">
                    <Icons.Phone className="h-2.5 w-2.5" />
                    AI
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 truncate">
                {b.service} · {b.duration_minutes} min ·{" "}
                {formatScheduled(b.scheduled_at)}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                {b.customer_phone}
              </p>
              {b.notes && (
                <p className="text-xs text-neutral-500 mt-1.5 italic line-clamp-2">
                  “{b.notes}”
                </p>
              )}
            </div>
            {onCancel && b.status === "scheduled" && (
              <button
                onClick={() => onCancel(b.booking_id)}
                className="text-xs font-medium text-red-500 hover:text-red-700 px-2.5 py-1 rounded-full hover:bg-red-50 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default BookingsSection;

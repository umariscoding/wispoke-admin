"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Icons, Toggle } from "@/components/ui";
import {
  useCompanyAppDispatch,
  useCompanyAppSelector,
} from "@/hooks/company/useCompanyAuth";
import {
  fetchAvailability,
  updateAvailability,
} from "@/store/company/slices/voiceAgentSlice";
import type {
  AvailabilityConfig,
  BusinessHour,
  Weekday,
} from "@/types/voiceAgent";

const WEEKDAYS: Array<{ id: Weekday; label: string }> = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const defaultAvailability = (): AvailabilityConfig => ({
  business_hours: WEEKDAYS.map((d) => ({
    day: d.id,
    enabled: d.id !== "saturday" && d.id !== "sunday",
    start_time: "09:00",
    end_time: "17:00",
  })),
  slot_granularity_minutes: 30,
  buffer_minutes_between_appointments: 15,
  max_daily_bookings: null,
});

const AvailabilitySection: React.FC = () => {
  const dispatch = useCompanyAppDispatch();
  const { availability, loading, saving, error } = useCompanyAppSelector(
    (s) => s.voiceAgent,
  );

  const [draft, setDraft] = useState<AvailabilityConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!availability && !loading) {
      dispatch(fetchAvailability());
    }
  }, [availability, loading, dispatch]);

  useEffect(() => {
    if (availability) setDraft(availability);
  }, [availability]);

  const hasChanges = useMemo(() => {
    if (!draft || !availability) return false;
    return JSON.stringify(draft) !== JSON.stringify(availability);
  }, [draft, availability]);

  const current = draft ?? defaultAvailability();

  const updateDay = (day: Weekday, patch: Partial<BusinessHour>) => {
    setDraft((prev) => {
      const base = prev ?? defaultAvailability();
      return {
        ...base,
        business_hours: base.business_hours.map((h) =>
          h.day === day ? { ...h, ...patch } : h,
        ),
      };
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      await dispatch(updateAvailability(draft)).unwrap();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      // slice tracks error
    }
  };

  if (loading && !availability && !draft) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-sm text-neutral-400">Loading availability...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Icons.AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
        </div>
      )}
      {saveSuccess && (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
          <Icons.CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />
          <p className="text-sm text-primary-700 font-medium">Availability saved</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <Icons.Clock className="h-3.5 w-3.5 text-neutral-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Weekly business hours
            </span>
          </div>

          <div className="space-y-2">
            {WEEKDAYS.map((w) => {
              const hour =
                current.business_hours.find((h) => h.day === w.id) ??
                defaultAvailability().business_hours.find((h) => h.day === w.id)!;
              return (
                <div
                  key={w.id}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${
                    hour.enabled
                      ? "border-neutral-200 bg-white"
                      : "border-neutral-100 bg-neutral-50"
                  }`}
                >
                  <div className="w-24 text-sm font-medium text-neutral-700">
                    {w.label}
                  </div>
                  <Toggle
                    checked={hour.enabled}
                    onChange={(v) => updateDay(w.id, { enabled: v })}
                    size="sm"
                  />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      value={hour.start_time}
                      onChange={(e) =>
                        updateDay(w.id, { start_time: e.target.value })
                      }
                      disabled={!hour.enabled}
                      className="rounded-lg border border-neutral-200 bg-white text-neutral-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all disabled:bg-neutral-100 disabled:text-neutral-400"
                    />
                    <input
                      type="time"
                      value={hour.end_time}
                      onChange={(e) =>
                        updateDay(w.id, { end_time: e.target.value })
                      }
                      disabled={!hour.enabled}
                      className="rounded-lg border border-neutral-200 bg-white text-neutral-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all disabled:bg-neutral-100 disabled:text-neutral-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-5 pt-5 pb-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <Icons.Settings className="h-3.5 w-3.5 text-neutral-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Booking rules
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-2 block">
                Slot granularity (minutes)
              </label>
              <select
                value={current.slot_granularity_minutes}
                onChange={(e) =>
                  setDraft({
                    ...current,
                    slot_granularity_minutes: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all"
              >
                {[15, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-2 block">
                Buffer between jobs (minutes)
              </label>
              <input
                type="number"
                min={0}
                step={5}
                value={current.buffer_minutes_between_appointments}
                onChange={(e) =>
                  setDraft({
                    ...current,
                    buffer_minutes_between_appointments: Number(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-2 block">
              Daily booking cap
            </label>
            <input
              type="number"
              min={0}
              value={current.max_daily_bookings ?? ""}
              onChange={(e) =>
                setDraft({
                  ...current,
                  max_daily_bookings: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              placeholder="No limit"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all"
            />
            <p className="text-xs text-neutral-400 mt-1.5">
              Leave empty for no cap.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => {
            if (availability) setDraft(availability);
          }}
          disabled={!hasChanges || saving}
          className="px-3.5 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-all disabled:opacity-40"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save availability"}
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySection;

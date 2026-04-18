"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import VoiceAgentTabs, {
  VoiceAgentTab,
} from "@/components/voice-agent/VoiceAgentTabs";
import ConfigurationSection from "@/components/voice-agent/ConfigurationSection";
import AvailabilitySection from "@/components/voice-agent/AvailabilitySection";
import BookingsSection from "@/components/voice-agent/BookingsSection";
import CallHistorySection from "@/components/voice-agent/CallHistorySection";

export default function VoiceAgentPage() {
  const companyAuth = useCompanyAppSelector((s) => s.companyAuth);
  const [tab, setTab] = useState<VoiceAgentTab>("configuration");

  if (!companyAuth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Icons.Phone className="h-10 w-10 text-neutral-300 mb-4" />
        <h3 className="text-base font-semibold text-neutral-900 mb-1">
          Access Restricted
        </h3>
        <p className="text-sm text-neutral-500">
          Only company administrators can configure the voice agent.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="mb-6 pt-1">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Voice Agent
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          AI receptionist that answers inbound calls, checks your calendar, and
          books appointments.
        </p>
      </div>

      <div className="mb-6">
        <VoiceAgentTabs active={tab} onChange={setTab} />
      </div>

      {tab === "configuration" && <ConfigurationSection />}
      {tab === "availability" && <AvailabilitySection />}
      {tab === "bookings" && <BookingsSection />}
      {tab === "calls" && <CallHistorySection />}
    </div>
  );
}

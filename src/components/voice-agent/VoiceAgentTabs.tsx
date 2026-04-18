"use client";

import React from "react";
import { Icons } from "@/components/ui";

export type VoiceAgentTab = "configuration" | "availability" | "bookings" | "calls";

interface VoiceAgentTabsProps {
  active: VoiceAgentTab;
  onChange: (tab: VoiceAgentTab) => void;
}

const tabs: Array<{
  id: VoiceAgentTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: "configuration", label: "Configuration", icon: Icons.Settings },
  { id: "availability", label: "Availability", icon: Icons.Clock },
  { id: "bookings", label: "Bookings", icon: Icons.CheckCircle },
  { id: "calls", label: "Call History", icon: Icons.Phone },
];

const VoiceAgentTabs: React.FC<VoiceAgentTabsProps> = ({ active, onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 border border-neutral-200 w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-full transition-all ${
              isActive
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default VoiceAgentTabs;

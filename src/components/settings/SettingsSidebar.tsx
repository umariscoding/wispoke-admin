"use client";

import React from "react";
import { Icons } from "@/components/ui";

export type SettingsSection = "profile" | "chatbot" | "publishing";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  completionStatus?: {
    profile: boolean;
    chatbot: boolean;
    publishing: boolean;
  };
}

const sections = [
  {
    id: "profile" as const,
    label: "Profile",
    description: "Company info & slug",
    icon: Icons.User,
    step: 1,
  },
  {
    id: "chatbot" as const,
    label: "Chatbot",
    description: "Title & description",
    icon: Icons.Edit,
    step: 2,
  },
  {
    id: "publishing" as const,
    label: "Publishing",
    description: "Go live",
    icon: Icons.Globe,
    step: 3,
  },
];

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
  completionStatus,
}: SettingsSidebarProps) {
  return (
    <nav className="space-y-1">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        const isComplete = completionStatus?.[section.id];

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-full transition-all text-left
              ${
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "hover:bg-neutral-50 dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-400"
              }
            `}
          >
            <div
              className={`
              w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
              ${isActive ? "bg-primary-100 dark:bg-teal-500/15" : isComplete ? "bg-accent-50 dark:bg-accent-900/20" : "bg-neutral-100 dark:bg-white/[0.04]"}
            `}
            >
              {isComplete && !isActive ? (
                <svg className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-500 dark:text-slate-400"}`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${isActive ? "text-primary-700 dark:text-primary-300" : "text-slate-800 dark:text-slate-100"}`}
              >
                {section.label}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-400 truncate">{section.description}</p>
            </div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
              {section.step}/3
            </span>
          </button>
        );
      })}
    </nav>
  );
}

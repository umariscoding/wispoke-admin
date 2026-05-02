"use client";

import React from "react";

interface ChatbotSectionProps {
  chatbotTitle: string;
  chatbotDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function ChatbotSection({
  chatbotTitle,
  chatbotDescription,
  onTitleChange,
  onDescriptionChange,
}: ChatbotSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Chatbot Configuration
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          How your chatbot appears to users
        </p>
      </div>

      <div className="bg-white dark:bg-white/[0.02] rounded-lg border border-neutral-200 dark:border-white/[0.06] p-5 space-y-5">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Chatbot Title
          </label>
          <input
            type="text"
            value={chatbotTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Customer Support Assistant"
            className="mt-2 w-full rounded-lg border border-slate-200 dark:border-white/[0.10] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-500/40 focus:border-teal-400 dark:focus:border-teal-500/50 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={chatbotDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Brief description of what your chatbot can help with..."
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 dark:border-white/[0.10] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-500/40 focus:border-teal-400 dark:focus:border-teal-500/50 resize-none transition-all"
          />
        </div>

        {/* Preview hint */}
        {(chatbotTitle || chatbotDescription) && (
          <div className="bg-neutral-50 dark:bg-transparent rounded-lg p-4 border border-slate-100 dark:border-white/[0.06]">
            <p className="text-xs text-slate-400 dark:text-slate-400 uppercase tracking-wider font-medium mb-2">
              Preview
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {chatbotTitle || "Untitled Chatbot"}
            </p>
            {chatbotDescription && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {chatbotDescription}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

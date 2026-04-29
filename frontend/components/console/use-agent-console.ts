"use client";

import { useState } from "react";
import { initialActivityLog, initialRecentActions } from "@/components/console/seed-data";
import type { ActivityLogItem, AgentActionItem, AgentRunStatus } from "@/components/console/types";

export function useAgentConsole() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<AgentRunStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [actions, setActions] = useState<AgentActionItem[]>(initialRecentActions);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>(initialActivityLog);

  return {
    prompt,
    setPrompt,
    status,
    setStatus,
    error,
    setError,
    promptHistory,
    setPromptHistory,
    actions,
    setActions,
    activityLog,
    setActivityLog
  };
}

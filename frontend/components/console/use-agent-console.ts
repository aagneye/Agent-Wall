"use client";

import { useState } from "react";
import { initialActivityLog, initialRecentActions } from "@/components/console/seed-data";
import type { ActivityLogItem, AgentActionItem, AgentRunStatus } from "@/components/console/types";
import { validatePromptInput } from "@/components/console/validation";
import { submitAgentPrompt } from "@/lib/api/agent-console";

export function useAgentConsole() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<AgentRunStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [actions, setActions] = useState<AgentActionItem[]>(initialRecentActions);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>(initialActivityLog);

  async function submitPrompt(): Promise<void> {
    const validationError = validatePromptInput(prompt);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await submitAgentPrompt({ prompt: prompt.trim() });
      setPromptHistory((previous) => [prompt.trim(), ...previous].slice(0, 8));
      setActions((previous) => [
        {
          id: response.runId,
          title: `Submitted: ${prompt.trim()}`,
          timestamp: "just now",
          status: "queued"
        },
        ...previous
      ].slice(0, 6));
      setActivityLog((previous) => [
        {
          id: response.runId,
          message: response.message,
          level: "success",
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
        },
        ...previous
      ].slice(0, 12));
      setStatus("success");
      setPrompt("");
    } catch {
      setStatus("error");
      setError("Request failed. Verify backend availability and try again.");
      setActivityLog((previous) => [
        {
          id: crypto.randomUUID(),
          message: "Prompt submission failed at API boundary.",
          level: "error",
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
        },
        ...previous
      ].slice(0, 12));
    }
  }

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
    setActivityLog,
    submitPrompt
  };
}

export function validateConsolePrompt(prompt: string): string | null {
  return validatePromptInput(prompt);
}

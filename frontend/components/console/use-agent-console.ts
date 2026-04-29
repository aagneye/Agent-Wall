"use client";

import { useState } from "react";
import { initialActivityLog, initialRecentActions } from "@/components/console/seed-data";
import type {
  ApprovalContext,
  ApprovalDecision,
  ActivityLogItem,
  AgentActionItem,
  AgentRunStatus,
  TransactionPreviewData
} from "@/components/console/types";
import { validatePromptInput } from "@/components/console/validation";
import { toTransactionPreviewData } from "@/components/console/preview-format";
import { submitAgentPrompt } from "@/lib/api/agent-console";
import { simulateTransaction } from "@/lib/api/tenderly";

export function useAgentConsole() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<AgentRunStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [actions, setActions] = useState<AgentActionItem[]>(initialRecentActions);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>(initialActivityLog);
  const [preview, setPreview] = useState<TransactionPreviewData | null>(null);
  const [isSimulationLoading, setIsSimulationLoading] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<ApprovalDecision>("pending");
  const [approvalContext, setApprovalContext] = useState<ApprovalContext | null>(null);
  const [panicLockEnabled, setPanicLockEnabled] = useState(false);

  async function submitPrompt(): Promise<void> {
    const validationError = validatePromptInput(prompt);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);
    setIsSimulationLoading(true);

    try {
      const response = await submitAgentPrompt({ prompt: prompt.trim() });
      const simulation = await simulateTransaction({
        action_label: prompt.trim(),
        protocol: "uniswap",
        token_symbol: "USDC",
        amount_usd: 50,
        approval_scope: "limited",
        approval_duration_hours: 24,
        target: "Uniswap"
      });
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
      setPreview(toTransactionPreviewData(simulation));
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
    } finally {
      setIsSimulationLoading(false);
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
    preview,
    setPreview,
    isSimulationLoading,
    setIsSimulationLoading,
    approvalOpen,
    setApprovalOpen,
    approvalDecision,
    setApprovalDecision,
    approvalContext,
    setApprovalContext,
    panicLockEnabled,
    setPanicLockEnabled,
    submitPrompt
  };
}

export function validateConsolePrompt(prompt: string): string | null {
  return validatePromptInput(prompt);
}

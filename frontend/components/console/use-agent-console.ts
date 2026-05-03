"use client";

import { useState } from "react";
import { initialActivityLog, initialRecentActions } from "@/components/console/seed-data";
import type {
  ApprovalContext,
  ApprovalDecision,
  ActivityLogItem,
  AgentActionItem,
  AgentRunStatus
} from "@/components/console/types";
import { validatePromptInput } from "@/components/console/validation";
import { submitAgentPrompt } from "@/lib/api/agent-console";
import { createPlan, type PlannerResponse } from "@/lib/api/planner";
import { evaluateSecurity, type SecurityEvaluationResponse } from "@/lib/api/security";

function toApprovalContext(plan: PlannerResponse, sec: SecurityEvaluationResponse): ApprovalContext {
  const risky = sec.approval_recommendation !== "approve";
  return {
    title: "Agent Firewall Approval Request",
    explanation: `${plan.safety_note}\n\n${sec.risk_explanation}`,
    riskLevel: risky ? "risky" : "safe",
    policyDetails: [
      { label: "Risk score", value: `${sec.risk_score}/100`, pass: sec.risk_score < 55 },
      ...sec.policy_findings.map((p) => ({
        label: p.policy_id,
        value: p.explanation.length > 90 ? `${p.explanation.slice(0, 90)}…` : p.explanation,
        pass: p.passed
      }))
    ]
  };
}

export function useAgentConsole() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<AgentRunStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [actions, setActions] = useState<AgentActionItem[]>(initialRecentActions);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>(initialActivityLog);
  const [preview] = useState<null>(null);
  const [isSimulationLoading, setIsSimulationLoading] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<ApprovalDecision>("pending");
  const [approvalContext, setApprovalContext] = useState<ApprovalContext | null>(null);
  const [approvalPlan, setApprovalPlan] = useState<PlannerResponse | null>(null);
  const [approvalSecurity, setApprovalSecurity] = useState<SecurityEvaluationResponse | null>(null);
  const [panicLockEnabled, setPanicLockEnabled] = useState(false);

  async function submitPrompt(): Promise<void> {
    if (panicLockEnabled) {
      setError("Emergency lock is active. Reset lock mode before submitting new actions.");
      setStatus("error");
      return;
    }

    const validationError = validatePromptInput(prompt);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    const trimmed = prompt.trim();

    setStatus("loading");
    setError(null);
    setIsSimulationLoading(true);

    try {
      const response = await submitAgentPrompt({ prompt: trimmed });
      const plan = await createPlan({ prompt: trimmed, runId: response.runId });
      const security = await evaluateSecurity({ plan, runId: response.runId });

      setApprovalPlan(plan);
      setApprovalSecurity(security);
      setApprovalContext(toApprovalContext(plan, security));

      setPromptHistory((previous) => [trimmed, ...previous].slice(0, 8));
      setActions((previous) =>
        [
          {
            id: response.runId,
            title: `Submitted: ${trimmed}`,
            timestamp: "just now",
            status: "queued" as const
          },
          ...previous
        ].slice(0, 6)
      );
      setActivityLog((previous) =>
        [
          {
            id: response.runId,
            message: response.message,
            level: "success" as const,
            timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
          },
          ...previous
        ].slice(0, 12)
      );
      setApprovalOpen(true);
      setApprovalDecision("pending");
      setStatus("success");
      setPrompt("");
    } catch {
      setStatus("error");
      setError("Request failed. Verify backend availability and try again.");
      setActivityLog((previous) =>
        [
          {
            id: crypto.randomUUID(),
            message: "Prompt submission failed at API boundary.",
            level: "error" as const,
            timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
          },
          ...previous
        ].slice(0, 12)
      );
      setApprovalOpen(false);
      setApprovalPlan(null);
      setApprovalSecurity(null);
      setApprovalContext(null);
    } finally {
      setIsSimulationLoading(false);
    }
  }

  function approveAction(): void {
    setApprovalDecision("approved");
    setApprovalOpen(false);
    setActivityLog((previous) =>
      [
        {
          id: crypto.randomUUID(),
          message: "Approval granted by user. Execution remains guarded by policy engine.",
          level: "success" as const,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
        },
        ...previous
      ].slice(0, 12)
    );
  }

  function rejectAction(): void {
    setApprovalDecision("rejected");
    setApprovalOpen(false);
    setActivityLog((previous) =>
      [
        {
          id: crypto.randomUUID(),
          message: "Approval rejected by user. Action has been safely halted.",
          level: "warning" as const,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
        },
        ...previous
      ].slice(0, 12)
    );
  }

  function triggerPanicLock(): void {
    setPanicLockEnabled(true);
    setApprovalOpen(false);
    setApprovalDecision("rejected");
    setActivityLog((previous) =>
      [
        {
          id: crypto.randomUUID(),
          message: "Emergency lock activated: permissions revoked and agent actions frozen.",
          level: "error" as const,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
        },
        ...previous
      ].slice(0, 12)
    );
  }

  function resetEmergencyLock(): void {
    setPanicLockEnabled(false);
    setError(null);
    setActivityLog((previous) =>
      [
        {
          id: crypto.randomUUID(),
          message: "Emergency lock reset by user. Console returned to guarded normal mode.",
          level: "info" as const,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false })
        },
        ...previous
      ].slice(0, 12)
    );
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
    isSimulationLoading,
    approvalOpen,
    setApprovalOpen,
    approvalDecision,
    setApprovalDecision,
    approvalContext,
    approvalPlan,
    approvalSecurity,
    panicLockEnabled,
    setPanicLockEnabled,
    approveAction,
    rejectAction,
    triggerPanicLock,
    resetEmergencyLock,
    submitPrompt
  };
}

export function validateConsolePrompt(prompt: string): string | null {
  return validatePromptInput(prompt);
}

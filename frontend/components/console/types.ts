export type AgentPromptPayload = {
  prompt: string;
};

export type AgentRunStatus = "idle" | "loading" | "success" | "error";

export type AgentActionItem = {
  id: string;
  title: string;
  timestamp: string;
  status: "queued" | "running" | "done" | "failed";
};

export type ActivityLogItem = {
  id: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
  timestamp: string;
};

export type TransactionPreviewData = {
  deterministic: boolean;
  tokenMovements: Array<{
    token: string;
    direction: "in" | "out";
    amountUsd: number;
  }>;
  gasEstimateUsd: number;
  approvalSizeUsd: number;
  failureRisk: "low" | "medium" | "high";
  suspiciousBehaviorDetected: boolean;
  humanExplanation: string;
};

export type ApprovalDecision = "approved" | "rejected" | "pending";

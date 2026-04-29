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

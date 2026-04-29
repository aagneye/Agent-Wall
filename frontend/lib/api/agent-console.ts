import { apiClient } from "@/lib/api/client";
import type { AgentPromptPayload } from "@/components/console/types";

export type AgentConsoleResponse = {
  runId: string;
  message: string;
};

export async function submitAgentPrompt(payload: AgentPromptPayload): Promise<AgentConsoleResponse> {
  return apiClient<AgentConsoleResponse>({
    path: "/api/v1/agent/console/submit",
    method: "POST",
    body: JSON.stringify(payload)
  });
}

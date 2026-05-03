import { apiClient } from "@/lib/api/client";

export type PreviewSimulatePayload = {
  prompt: string;
};

/** Calls backend preview/simulate. Stub returns JSON null until implemented. */
export async function simulatePreview(payload: PreviewSimulatePayload): Promise<null> {
  return apiClient<null>({
    path: "/api/v1/agent/preview/simulate",
    method: "POST",
    body: JSON.stringify({ prompt: payload.prompt })
  });
}

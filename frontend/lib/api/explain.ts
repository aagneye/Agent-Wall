import { apiClient } from "@/lib/api/client";
import type { PlannerResponse } from "@/lib/api/planner";
import type { SecurityEvaluationResponse } from "@/lib/api/security";

/** Request body for POST /api/v1/agent/explain */
export type ExplainPayload = {
  plan: PlannerResponse;
  security: SecurityEvaluationResponse;
};

/** Response from POST /api/v1/agent/explain */
export type ExplainApiResponse = {
  explanation: string;
};

export async function explainTransaction(payload: ExplainPayload): Promise<ExplainApiResponse> {
  return apiClient<ExplainApiResponse>({
    path: "/api/v1/agent/explain",
    method: "POST",
    body: JSON.stringify({
      plan: payload.plan,
      security: payload.security
    })
  });
}

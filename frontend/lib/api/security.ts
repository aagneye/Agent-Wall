import { apiClient } from "@/lib/api/client";
import type { PlannerResponse } from "@/lib/api/planner";

export type RiskSeverityUi = "low" | "medium" | "high" | "critical";

/** Mirrors backend app.schemas.security.RiskRow */
export type RiskRow = {
  type: string;
  description: string;
  severity: RiskSeverityUi;
};

/** Mirrors backend app.schemas.security.PolicyResult */
export type PolicyResult = {
  allowed: boolean;
  reason: string;
};

/** Mirrors backend app.schemas.security.SecurityEvaluationResponse */
export type SecurityEvaluationResponse = {
  deterministic: boolean;
  risk_score: number;
  risk_level: RiskSeverityUi;
  risks: RiskRow[];
  policy_result: PolicyResult;
};

/** Request body for POST /api/v1/agent/security/evaluate */
export type SecurityEvaluatePayload = {
  plan: PlannerResponse;
  runId: string;
};

export async function evaluateSecurity(payload: SecurityEvaluatePayload): Promise<SecurityEvaluationResponse> {
  return apiClient<SecurityEvaluationResponse>({
    path: "/api/v1/agent/security/evaluate",
    method: "POST",
    body: JSON.stringify(payload)
  });
}

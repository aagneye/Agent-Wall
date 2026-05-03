import { apiClient } from "@/lib/api/client";
import type { PlannerResponse } from "@/lib/api/planner";

/** Mirrors backend SecurityActionType */
export type SecurityActionType =
  | "check_protocol_options"
  | "swap_assets"
  | "deposit_funds"
  | "stake_tokens"
  | "bridge_assets";

/** Mirrors backend app.schemas.security.ProposedAction (JSON keys snake_case). */
export type ProposedAction = {
  id: string;
  type: SecurityActionType;
  protocol: string;
  contract_address: string;
  target_address: string;
  token_symbol: string;
  amount_usd: number;
  approval_amount_usd: number;
  approval_scope: "none" | "limited" | "unlimited";
  approval_expires_in_minutes: number;
  wallet_balance_usd: number;
};

/** Mirrors backend app.schemas.security.RiskFinding */
export type RiskFinding = {
  rule_id: string;
  severity: "low" | "medium" | "high";
  score_impact: number;
  explanation: string;
};

/** Mirrors backend app.schemas.security.PolicyFinding */
export type PolicyFinding = {
  policy_id: string;
  passed: boolean;
  explanation: string;
};

/** Mirrors backend app.schemas.security.SecurityEvaluationResponse */
export type SecurityEvaluationResponse = {
  deterministic: boolean;
  risk_score: number;
  risk_explanation: string;
  approval_recommendation: "approve" | "needs_human_review" | "reject";
  risk_findings: RiskFinding[];
  policy_findings: PolicyFinding[];
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

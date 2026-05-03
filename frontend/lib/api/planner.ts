import { apiClient } from "@/lib/api/client";

/** Mirrors backend PlannerActionType */
export type PlannerActionType =
  | "check_protocol_options"
  | "swap_assets"
  | "deposit_funds"
  | "stake_tokens"
  | "bridge_assets";

export type PlannerRiskLevel = "low" | "medium";

/** Mirrors backend app.schemas.planner.PlannerAction (JSON keys snake_case). */
export type PlannerAction = {
  id: string;
  type: PlannerActionType;
  description: string;
  reason: string;
  risk_level: PlannerRiskLevel;
};

/** Mirrors backend app.schemas.planner.PlannerResponse (JSON keys snake_case). */
export type PlannerResponse = {
  prompt: string;
  intent: "safe_capital_optimization" | "unsafe_prompt_detected";
  safety_note: string;
  deterministic: boolean;
  actions: PlannerAction[];
};

/** Request body for POST /api/v1/agent/planner/plan */
export type PlannerPlanPayload = {
  prompt: string;
  runId: string;
};

export async function createPlan(payload: PlannerPlanPayload): Promise<PlannerResponse> {
  return apiClient<PlannerResponse>({
    path: "/api/v1/agent/planner/plan",
    method: "POST",
    body: JSON.stringify(payload)
  });
}

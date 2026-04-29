import { apiClient } from "@/lib/api/client";

export type TenderlySimulationRequest = {
  action_label: string;
  protocol: string;
  token_symbol: string;
  amount_usd: number;
  approval_scope: "none" | "limited" | "unlimited";
  approval_duration_hours: number;
  target: string;
};

export type TokenMovementPreview = {
  token: string;
  direction: "in" | "out";
  amount_usd: number;
};

export type TenderlySimulationResponse = {
  deterministic: boolean;
  token_movements: TokenMovementPreview[];
  gas_estimate_usd: number;
  approval_size_usd: number;
  transaction_failure_risk: "low" | "medium" | "high";
  suspicious_behavior_detected: boolean;
  human_explanation: string;
};

export async function simulateTransaction(
  payload: TenderlySimulationRequest
): Promise<TenderlySimulationResponse> {
  return apiClient<TenderlySimulationResponse>({
    path: "/api/v1/agent/tenderly/simulate",
    method: "POST",
    body: JSON.stringify(payload)
  });
}

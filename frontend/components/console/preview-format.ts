import type { TenderlySimulationResponse } from "@/lib/api/tenderly";
import type { TransactionPreviewData } from "@/components/console/types";

export function toTransactionPreviewData(
  simulation: TenderlySimulationResponse
): TransactionPreviewData {
  return {
    deterministic: simulation.deterministic,
    tokenMovements: simulation.token_movements.map((item) => ({
      token: item.token,
      direction: item.direction,
      amountUsd: item.amount_usd
    })),
    gasEstimateUsd: simulation.gas_estimate_usd,
    approvalSizeUsd: simulation.approval_size_usd,
    failureRisk: simulation.transaction_failure_risk,
    suspiciousBehaviorDetected: simulation.suspicious_behavior_detected,
    humanExplanation: simulation.human_explanation
  };
}

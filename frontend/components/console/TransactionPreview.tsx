import type { TransactionPreviewData } from "@/components/console/types";

type TransactionPreviewProps = {
  preview: TransactionPreviewData | null;
  isLoading?: boolean;
};

export function TransactionPreview({ preview, isLoading = false }: TransactionPreviewProps) {
  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Transaction Preview</h2>
      {isLoading ? <p className="text-xs text-cyan-300">Running deterministic Tenderly simulation...</p> : null}
      {!isLoading && !preview ? (
        <p className="text-xs text-slate-400">
          Submit a prompt to preview token movements, gas, approval scope, and risk signals.
        </p>
      ) : null}
      {preview ? (
        <div className="space-y-3 text-xs text-slate-200">
          <p className="rounded bg-slate-900/70 p-2 text-slate-100">{preview.humanExplanation}</p>
          <div className="grid grid-cols-2 gap-2">
            <p>Gas Estimate: ${preview.gasEstimateUsd.toFixed(2)}</p>
            <p>Approval Size: ${preview.approvalSizeUsd.toFixed(2)}</p>
            <p>Failure Risk: {preview.failureRisk}</p>
            <p>Suspicious: {preview.suspiciousBehaviorDetected ? "Yes" : "No"}</p>
          </div>
          <ul className="space-y-1">
            {preview.tokenMovements.map((movement, index) => (
              <li key={`${movement.token}-${index}`} className="flex justify-between">
                <span>{movement.direction === "out" ? "Outflow" : "Inflow"} {movement.token}</span>
                <span>${movement.amountUsd.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

import type { TransactionPreviewData } from "@/components/console/types";

type TransactionPreviewProps = {
  preview: TransactionPreviewData | null;
  isLoading?: boolean;
};

export function TransactionPreview({ preview, isLoading = false }: TransactionPreviewProps) {
  const riskTone =
    preview?.failureRisk === "high"
      ? "text-rose-300"
      : preview?.failureRisk === "medium"
        ? "text-amber-300"
        : "text-emerald-300";

  const riskProgress = preview?.failureRisk === "high" ? "90%" : preview?.failureRisk === "medium" ? "55%" : "20%";

  return (
    <section className="rounded-xl border border-cyan-300/20 bg-gradient-to-br from-slate-950/90 to-slate-900/70 p-4 shadow-lg shadow-cyan-500/10">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Transaction Preview</h2>
      {isLoading ? (
        <div className="space-y-2">
          <p className="loading-pulse text-xs text-cyan-300">Generating transaction preview...</p>
          <div className="loading-pulse h-2 rounded bg-slate-800/80" />
          <div className="loading-pulse h-2 w-3/4 rounded bg-slate-800/80" />
        </div>
      ) : null}
      {!isLoading && !preview ? (
        <p className="text-xs text-slate-400">
          Submit a prompt to preview token movements, gas, approval scope, and risk signals.
        </p>
      ) : null}
      {preview ? (
        <div className="space-y-3 text-xs text-slate-200">
          <p className="rounded border border-cyan-300/20 bg-slate-900/70 p-2 text-slate-100">{preview.humanExplanation}</p>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className={`font-medium ${riskTone}`}>Failure Risk: {preview.failureRisk}</p>
              <p className="text-slate-400">{riskProgress}</p>
            </div>
            <div className="h-2 overflow-hidden rounded bg-slate-800">
              <div className="h-full rounded bg-cyan-400/70" style={{ width: riskProgress }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p>Gas Estimate: ${preview.gasEstimateUsd.toFixed(2)}</p>
            <p>Approval Size: ${preview.approvalSizeUsd.toFixed(2)}</p>
            <p>Deterministic: {preview.deterministic ? "Yes" : "No"}</p>
            <p>Suspicious: {preview.suspiciousBehaviorDetected ? "Detected" : "None"}</p>
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

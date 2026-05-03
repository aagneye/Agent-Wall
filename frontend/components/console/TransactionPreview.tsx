import type { RiskSeverityUi, SecurityEvaluationResponse } from "@/lib/api/security";

type TransactionPreviewProps = {
  security: SecurityEvaluationResponse | null;
  isLoading?: boolean;
};

function riskScoreBadgeClass(score: number): string {
  if (score < 40) {
    return "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
  }
  if (score <= 70) {
    return "border border-amber-500/40 bg-amber-500/15 text-amber-300";
  }
  return "border border-rose-500/40 bg-rose-500/15 text-rose-300";
}

function severityLabelClass(severity: RiskSeverityUi): string {
  if (severity === "low") return "text-emerald-300";
  if (severity === "medium") return "text-amber-300";
  if (severity === "high") return "text-orange-300";
  return "text-rose-300";
}

export function TransactionPreview({ security, isLoading = false }: TransactionPreviewProps) {
  return (
    <section className="rounded-xl border border-cyan-300/20 bg-gradient-to-br from-slate-950/90 to-slate-900/70 p-4 shadow-lg shadow-cyan-500/10">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Transaction Preview</h2>
      {isLoading ? (
        <div className="space-y-2">
          <p className="loading-pulse text-xs text-cyan-300">Running security evaluation...</p>
          <div className="loading-pulse h-2 rounded bg-slate-800/80" />
          <div className="loading-pulse h-2 w-3/4 rounded bg-slate-800/80" />
        </div>
      ) : null}
      {!isLoading && !security ? (
        <p className="text-xs text-slate-400">Submit a prompt to load risk score, findings, and policy status.</p>
      ) : null}
      {!isLoading && security ? (
        <div className="space-y-3 text-xs text-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${riskScoreBadgeClass(security.risk_score)}`}
            >
              Risk {security.risk_score}/100
            </span>
            <span className="rounded-full border border-slate-500/40 bg-slate-900/70 px-2.5 py-0.5 text-[11px] capitalize text-slate-300">
              {security.risk_level}
            </span>
          </div>
          <div
            className={`rounded border p-2 ${
              security.policy_result.allowed ? "border-emerald-500/25 bg-emerald-950/15" : "border-rose-500/35 bg-rose-950/20"
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Policy</p>
            <p className="mt-1 text-slate-100">{security.policy_result.reason}</p>
          </div>
          <ul className="space-y-2">
            {security.risks.map((risk, index) => (
              <li
                key={`${risk.type}-${index}`}
                className="rounded border border-slate-700/60 bg-slate-900/50 p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-100">{risk.type}</span>
                  <span className={`font-semibold capitalize ${severityLabelClass(risk.severity)}`}>{risk.severity}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">{risk.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

import type { PlannerResponse } from "@/lib/api/planner";
import type { RiskSeverityUi, SecurityEvaluationResponse } from "@/lib/api/security";

type RiskCardProps = {
  plan: PlannerResponse | null;
  security: SecurityEvaluationResponse | null;
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

export function RiskCard({ plan, security }: RiskCardProps) {
  if (!plan || !security) {
    return (
      <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">Risk Card</h2>
        <p className="text-xs text-slate-400">No active approval decision. Submit an action to inspect risk.</p>
      </section>
    );
  }

  const elevated = security.risk_score >= 40 || !security.policy_result.allowed;
  const barWidth = `${Math.min(100, Math.max(0, security.risk_score))}%`;

  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-slate-100">Risk Card</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${riskScoreBadgeClass(security.risk_score)}`}
        >
          {security.risk_score}/100
        </span>
        <span className="rounded-full border border-slate-600/50 px-2 py-0.5 text-[10px] capitalize text-slate-400">
          {security.risk_level}
        </span>
      </div>
      <p className={`text-xs ${elevated ? "text-amber-200/90" : "text-emerald-300"}`}>
        {security.policy_result.allowed ? "Policy allows proceeding if you approve." : "Policy blocked — approval disabled."}
      </p>
      <p className="mt-2 text-[11px] text-slate-400">
        Planner intent: <span className="text-slate-200">{plan.intent}</span>
      </p>
      <ul className="mt-3 space-y-1.5 border-t border-slate-800 pt-3">
        {security.risks.slice(0, 4).map((risk, index) => (
          <li key={`${risk.type}-${index}`} className="flex items-start justify-between gap-2 text-[11px]">
            <span className="truncate text-slate-300">{risk.type}</span>
            <span className={`shrink-0 capitalize ${severityLabelClass(risk.severity)}`}>{risk.severity}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Risk score</span>
          <span className={elevated ? "text-amber-300" : "text-emerald-300"}>{security.risk_score}/100</span>
        </div>
        <div className="h-1.5 rounded bg-slate-800">
          <div
            className={`h-full rounded ${elevated ? "bg-amber-400/90" : "bg-emerald-400/90"}`}
            style={{ width: barWidth }}
          />
        </div>
      </div>
    </section>
  );
}

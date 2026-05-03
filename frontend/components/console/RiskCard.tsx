import type { PlannerResponse } from "@/lib/api/planner";
import type { SecurityEvaluationResponse } from "@/lib/api/security";

type RiskCardProps = {
  plan: PlannerResponse | null;
  security: SecurityEvaluationResponse | null;
};

export function RiskCard({ plan, security }: RiskCardProps) {
  if (!plan || !security) {
    return (
      <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">Risk Card</h2>
        <p className="text-xs text-slate-400">No active approval decision. Submit an action to inspect risk.</p>
      </section>
    );
  }

  const risky = security.approval_recommendation !== "approve";
  const barWidth = `${Math.min(100, Math.max(0, security.risk_score))}%`;

  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-100">Risk Card</h2>
      <p className={`text-xs ${risky ? "text-rose-300" : "text-emerald-300"}`}>
        {risky ? "Elevated risk or review required" : "Within automated approval band"}
      </p>
      <p className="mt-2 text-[11px] text-slate-400">
        Planner intent: <span className="text-slate-200">{plan.intent}</span>
      </p>
      <p className="mt-2 text-xs text-slate-300">{security.risk_explanation.slice(0, 220)}</p>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Risk score</span>
          <span className={risky ? "text-rose-300" : "text-emerald-300"}>{security.risk_score}/100</span>
        </div>
        <div className="h-1.5 rounded bg-slate-800">
          <div className={`h-full rounded ${risky ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: barWidth }} />
        </div>
      </div>
    </section>
  );
}

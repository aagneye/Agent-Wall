import type { ApprovalContext } from "@/components/console/types";

type RiskCardProps = {
  context: ApprovalContext | null;
};

export function RiskCard({ context }: RiskCardProps) {
  if (!context) {
    return (
      <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">Risk Card</h2>
        <p className="text-xs text-slate-400">No active approval decision. Submit an action to inspect risk.</p>
      </section>
    );
  }

  const risky = context.riskLevel === "risky";
  const barWidth = risky ? "78%" : "22%";

  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-100">{context.title}</h2>
      <p className={`text-xs ${risky ? "text-rose-300" : "text-emerald-300"}`}>
        {risky ? "Risky Action" : "Safe Action"}
      </p>
      <p className="mt-2 text-xs text-slate-300">{context.explanation}</p>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Risk Intensity</span>
          <span className={risky ? "text-rose-300" : "text-emerald-300"}>{barWidth}</span>
        </div>
        <div className="h-1.5 rounded bg-slate-800">
          <div className={`h-full rounded ${risky ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: barWidth }} />
        </div>
      </div>
    </section>
  );
}

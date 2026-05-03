import { Button } from "@/components/ui/button";
import type { PlannerResponse } from "@/lib/api/planner";
import type { RiskSeverityUi, SecurityEvaluationResponse } from "@/lib/api/security";

type ApprovalModalProps = {
  open: boolean;
  plan: PlannerResponse | null;
  security: SecurityEvaluationResponse | null;
  /** Plain-language summary from POST /agent/explain; omit or null shows a fallback hint. */
  explanation?: string | null;
  /** ENS name or shortened address for approval signing context. */
  signingIdentity?: string | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
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

export function ApprovalModal({
  open,
  plan,
  security,
  explanation = null,
  signingIdentity = null,
  onApprove,
  onReject,
  onClose
}: ApprovalModalProps) {
  if (!open || !plan || !security) {
    return null;
  }

  const policyBlocks = !security.policy_result.allowed;
  const canApprove = security.policy_result.allowed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200/15 bg-gradient-to-br from-slate-950 to-slate-900 p-5 shadow-2xl shadow-cyan-500/10">
        <div className="rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/40 to-slate-950/80 p-3.5 shadow-inner shadow-cyan-900/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/85">AI Analysis</p>
          {explanation ? (
            <blockquote className="mt-2 border-l-[3px] border-cyan-400/55 pl-3 text-sm leading-relaxed text-slate-100/95">
              {explanation}
            </blockquote>
          ) : (
            <p className="mt-2 text-sm italic text-slate-500">
              AI summary is not available for this request. Review the planner and risk details below.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-100">Agent Firewall Approval Request</h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${riskScoreBadgeClass(security.risk_score)}`}
          >
            Risk {security.risk_score}/100
          </span>
          <span className="rounded-full border border-slate-500/40 bg-slate-800/60 px-2.5 py-0.5 text-[11px] font-medium capitalize text-slate-300">
            {security.risk_level}
          </span>
        </div>

        <div className="mt-4 space-y-3 rounded-lg border border-slate-200/10 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Planner</p>
          <p className="text-xs text-slate-400">
            Intent: <span className="text-slate-200">{plan.intent}</span>
          </p>
          <p className="text-sm text-slate-300">{plan.safety_note}</p>
          <ul className="space-y-2 border-t border-slate-200/10 pt-3">
            {plan.actions.map((action) => (
              <li key={action.id} className="text-xs text-slate-300">
                <span className="font-semibold text-cyan-200/90">{action.id}</span>
                {" · "}
                <span className="text-slate-400">{action.type}</span>
                <p className="mt-0.5 text-slate-200">{action.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 space-y-2 rounded-lg border border-slate-200/10 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Risks</p>
          <ul className="space-y-2">
            {security.risks.map((risk, index) => (
              <li
                key={`${risk.type}-${index}`}
                className="flex flex-col gap-0.5 border-b border-slate-800/80 pb-2 text-xs last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-200">{risk.type}</span>
                  <span className={`font-semibold capitalize ${severityLabelClass(risk.severity)}`}>{risk.severity}</span>
                </div>
                <p className="text-slate-400">{risk.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`mt-4 rounded-lg border p-3 text-xs ${
            policyBlocks ? "border-rose-500/40 bg-rose-950/30 text-rose-100" : "border-emerald-500/30 bg-emerald-950/20 text-emerald-100"
          }`}
        >
          <p className="font-semibold uppercase tracking-[0.15em] text-slate-400">Policy</p>
          <p className="mt-1 text-sm leading-snug">{security.policy_result.reason}</p>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Signing as:{" "}
          <span className="font-semibold text-slate-200">{signingIdentity ?? "Not connected"}</span>
        </p>

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={onReject}>
            Reject
          </Button>
          <Button
            disabled={!canApprove}
            className={
              !canApprove
                ? "cursor-not-allowed opacity-50"
                : security.risk_level === "high" || security.risk_level === "critical"
                  ? "bg-amber-500 hover:bg-amber-400"
                  : undefined
            }
            onClick={onApprove}
          >
            {!canApprove ? "Approve blocked" : security.risk_level === "high" || security.risk_level === "critical" ? "Approve With Caution" : "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
}

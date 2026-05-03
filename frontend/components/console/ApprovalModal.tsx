import { Button } from "@/components/ui/button";
import type { PlannerResponse } from "@/lib/api/planner";
import type { SecurityEvaluationResponse } from "@/lib/api/security";

type ApprovalModalProps = {
  open: boolean;
  plan: PlannerResponse | null;
  security: SecurityEvaluationResponse | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
};

export function ApprovalModal({ open, plan, security, onApprove, onReject, onClose }: ApprovalModalProps) {
  if (!open || !plan || !security) {
    return null;
  }

  const isRisky = security.approval_recommendation !== "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200/15 bg-gradient-to-br from-slate-950 to-slate-900 p-5 shadow-2xl shadow-cyan-500/10">
        <h2 className="text-lg font-semibold text-slate-100">Agent Firewall Approval Request</h2>
        <p className={`mt-2 text-xs font-medium ${isRisky ? "text-rose-300" : "text-emerald-300"}`}>
          {isRisky ? "Risk Indicator: Risky" : "Risk Indicator: Safe"}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-slate-400">
          Recommendation:{" "}
          <span className="font-semibold text-slate-200">{security.approval_recommendation}</span>
          {" · "}
          Risk score {security.risk_score}/100
        </p>

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
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Security assessment</p>
          <p className="text-sm text-slate-300">{security.risk_explanation}</p>
        </div>

        <div className="mt-4 space-y-2 rounded-lg border border-slate-200/10 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Policy findings</p>
          {security.policy_findings.map((detail) => (
            <div key={detail.policy_id} className="flex items-start justify-between gap-2 text-xs">
              <span className="text-slate-200">{detail.policy_id}</span>
              <span className={detail.passed ? "text-emerald-300" : "text-rose-300"}>
                {detail.passed ? "Pass" : "Fail"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={onReject}>
            Reject
          </Button>
          <Button className={isRisky ? "bg-amber-500 hover:bg-amber-400" : undefined} onClick={onApprove}>
            {isRisky ? "Approve With Caution" : "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
}

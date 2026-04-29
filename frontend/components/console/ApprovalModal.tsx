import { Button } from "@/components/ui/button";
import type { ApprovalContext } from "@/components/console/types";

type ApprovalModalProps = {
  open: boolean;
  context: ApprovalContext | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
};

export function ApprovalModal({ open, context, onApprove, onReject, onClose }: ApprovalModalProps) {
  if (!open || !context) {
    return null;
  }

  const isRisky = context.riskLevel === "risky";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200/15 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10">
        <h2 className="text-lg font-semibold text-slate-100">{context.title}</h2>
        <p className={`mt-2 text-xs font-medium ${isRisky ? "text-rose-300" : "text-emerald-300"}`}>
          {isRisky ? "Risk Indicator: Risky" : "Risk Indicator: Safe"}
        </p>
        <p className="mt-2 text-sm text-slate-300">{context.explanation}</p>
        <div className="mt-4 space-y-2 rounded-lg border border-slate-200/10 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Policy Details</p>
          {context.policyDetails.map((detail) => (
            <div key={detail.label} className="flex items-center justify-between text-xs">
              <span className="text-slate-200">{detail.label}</span>
              <span className={detail.pass ? "text-emerald-300" : "text-rose-300"}>{detail.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="secondary" onClick={onReject}>Reject</Button>
          <Button onClick={onApprove}>Approve</Button>
        </div>
      </div>
    </div>
  );
}

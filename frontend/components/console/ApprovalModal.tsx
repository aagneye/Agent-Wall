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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200/15 bg-slate-950 p-5">
        <h2 className="text-lg font-semibold text-slate-100">{context.title}</h2>
        <p className="mt-2 text-sm text-slate-300">{context.explanation}</p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="secondary" onClick={onReject}>Reject</Button>
          <Button onClick={onApprove}>Approve</Button>
        </div>
      </div>
    </div>
  );
}

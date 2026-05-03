"use client";

import { ActivityLog } from "@/components/console/ActivityLog";
import { ApprovalModal } from "@/components/console/ApprovalModal";
import { ConsoleHeader } from "@/components/console/ConsoleHeader";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { PanicButton } from "@/components/console/PanicButton";
import { PromptHistory } from "@/components/console/PromptHistory";
import { PromptInput } from "@/components/console/PromptInput";
import { RecentActions } from "@/components/console/RecentActions";
import { RiskCard } from "@/components/console/RiskCard";
import { SubmitBar } from "@/components/console/SubmitBar";
import { TransactionPreview } from "@/components/console/TransactionPreview";
import { useAgentConsole } from "@/components/console/use-agent-console";

export function AgentConsole() {
  const {
    prompt,
    setPrompt,
    status,
    error,
    submitPrompt,
    actions,
    activityLog,
    promptHistory,
    isSimulationLoading,
    approvalPlan,
    approvalSecurity,
    approvalOpen,
    approveAction,
    rejectAction,
    setApprovalOpen,
    triggerPanicLock,
    panicLockEnabled
  } = useAgentConsole();

  return (
    <main className="min-h-screen px-6 py-14 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <ConsoleHeader />
        <div className="card-elevated rounded-xl p-3 text-xs text-slate-300">
          Demo tip: start with <span className="text-slate-100">"Optimize my USDC yield safely"</span> to
          showcase planner, security evaluation, and approval flow in under 30 seconds.
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <ConsoleShell>
            <div className="space-y-4">
              <PromptInput
                value={prompt}
                disabled={status === "loading"}
                onChange={setPrompt}
                onSubmitShortcut={submitPrompt}
              />
              <SubmitBar
                isLoading={status === "loading"}
                status={status}
                error={error}
                onSubmit={submitPrompt}
              />
            </div>
          </ConsoleShell>
          <div className="space-y-4">
            <RecentActions items={actions} />
            <PromptHistory items={promptHistory} />
            <TransactionPreview security={approvalSecurity} isLoading={isSimulationLoading} />
            <RiskCard plan={approvalPlan} security={approvalSecurity} />
            <PanicButton onPanic={triggerPanicLock} disabled={panicLockEnabled} />
            {panicLockEnabled ? (
              <div className="rounded-xl border border-rose-400/40 bg-rose-950/40 p-3 text-xs text-rose-200">
                <p className="font-semibold">Emergency Lock Mode Enabled</p>
                <p className="mt-1">All agent actions are frozen until manual reset.</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid gap-4">
          <ActivityLog logs={activityLog} />
        </div>
        <ApprovalModal
          open={approvalOpen}
          plan={approvalPlan}
          security={approvalSecurity}
          onApprove={approveAction}
          onReject={rejectAction}
          onClose={() => setApprovalOpen(false)}
        />
      </section>
    </main>
  );
}

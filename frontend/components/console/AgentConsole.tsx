"use client";

import { ActivityLog } from "@/components/console/ActivityLog";
import { ConsoleHeader } from "@/components/console/ConsoleHeader";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { PromptHistory } from "@/components/console/PromptHistory";
import { PromptInput } from "@/components/console/PromptInput";
import { RecentActions } from "@/components/console/RecentActions";
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
    preview,
    isSimulationLoading
  } = useAgentConsole();

  return (
    <main className="min-h-screen px-6 py-14 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <ConsoleHeader />
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
            <TransactionPreview preview={preview} isLoading={isSimulationLoading} />
          </div>
        </div>
        <div className="grid gap-4">
          <ActivityLog logs={activityLog} />
        </div>
      </section>
    </main>
  );
}

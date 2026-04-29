import type { ReactNode } from "react";

type ConsoleShellProps = {
  children: ReactNode;
};

export function ConsoleShell({ children }: ConsoleShellProps) {
  return (
    <section className="rounded-2xl border border-slate-200/10 bg-[#07111f]/85 p-5 shadow-2xl shadow-cyan-500/5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <p className="ml-2 text-xs text-slate-400">secure-agent-console</p>
        <p className="ml-auto text-[11px] text-cyan-300/70">guardrail mode: strict</p>
      </div>
      {children}
    </section>
  );
}

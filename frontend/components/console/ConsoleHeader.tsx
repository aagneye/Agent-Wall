export function ConsoleHeader() {
  return (
    <header className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">Agent Firewall Console</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-50">
        Control your AI agent safely.
      </h1>
      <p className="max-w-3xl text-sm text-slate-300">
        Terminal-grade control surface for secure autonomous actions. Every prompt is routed through
        policy-aware execution checks before any on-chain intent is formed.
      </p>
    </header>
  );
}

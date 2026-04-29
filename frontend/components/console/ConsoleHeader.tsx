export function ConsoleHeader() {
  return (
    <header className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">Agent Firewall Console</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-50">
        Autonomous execution, human control.
      </h1>
      <p className="max-w-3xl text-sm text-slate-300">
        Agent Firewall is a trust layer for AI-driven Web3 actions. Every prompt goes through planning,
        simulation, risk scoring, and policy approval before execution intent is allowed.
      </p>
      <div className="card-elevated grid gap-2 rounded-xl p-3 text-xs text-slate-200 md:grid-cols-3">
        <p>1. Describe the goal in plain English</p>
        <p>2. Review simulation and risk findings</p>
        <p>3. Approve only if policy checks pass</p>
      </div>
    </header>
  );
}

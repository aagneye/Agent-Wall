import type { AgentActionItem } from "@/components/console/types";

type RecentActionsProps = {
  items: AgentActionItem[];
};

export function RecentActions({ items }: RecentActionsProps) {
  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Recent Actions</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-xs">
            <p className="text-slate-200">{item.title}</p>
            <p className="text-slate-400">{item.timestamp}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

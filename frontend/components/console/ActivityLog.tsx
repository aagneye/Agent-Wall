import type { ActivityLogItem } from "@/components/console/types";

type ActivityLogProps = {
  logs: ActivityLogItem[];
};

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Activity Log</h2>
      <ul className="space-y-2 text-xs">
        {logs.map((log) => (
          <li key={log.id} className="flex items-start justify-between gap-3 text-slate-300">
            <p>{log.message}</p>
            <span className="whitespace-nowrap text-slate-500">{log.timestamp}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

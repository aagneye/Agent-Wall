import type { ActivityLogItem } from "@/components/console/types";

type ActivityLogProps = {
  logs: ActivityLogItem[];
};

export function ActivityLog({ logs }: ActivityLogProps) {
  const levelTone: Record<ActivityLogItem["level"], string> = {
    info: "text-slate-300",
    success: "text-emerald-300",
    warning: "text-amber-300",
    error: "text-rose-300"
  };

  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Activity Log</h2>
      <ul className="space-y-2 text-xs">
        {logs.map((log) => (
          <li key={log.id} className="flex items-start justify-between gap-3">
            <p className={levelTone[log.level]}>{log.message}</p>
            <span className="whitespace-nowrap text-slate-500">{log.timestamp}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { cn } from "@/utils/cn";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
};

export function StatusPill({ children, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "success" && "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
        tone === "warning" && "border-amber-400/40 bg-amber-400/10 text-amber-300",
        tone === "danger" && "border-rose-400/40 bg-rose-400/10 text-rose-300",
        tone === "neutral" && "border-slate-300/20 bg-slate-700/20 text-slate-200"
      )}
    >
      {children}
    </span>
  );
}

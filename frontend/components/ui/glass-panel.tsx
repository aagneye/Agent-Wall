import { cn } from "@/utils/cn";

type GlassPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/10 bg-slate-900/70 p-5 shadow-[0_0_0_1px_rgba(148,163,184,0.08)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

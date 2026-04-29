import { Button } from "@/components/ui/button";

type SubmitBarProps = {
  isLoading: boolean;
  status: "idle" | "loading" | "success" | "error";
  error?: string | null;
  onSubmit: () => void;
};

export function SubmitBar({ isLoading, status, error, onSubmit }: SubmitBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{isLoading ? "Running secure analysis..." : "Submit prompt to backend orchestrator"}</p>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Run Prompt"}
        </Button>
      </div>
      {status === "success" ? <p className="text-xs text-emerald-300">Prompt accepted by backend.</p> : null}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

import { Button } from "@/components/ui/button";

type PanicButtonProps = {
  onPanic: () => void;
  disabled?: boolean;
};

export function PanicButton({ onPanic, disabled = false }: PanicButtonProps) {
  return (
    <section className="rounded-xl border border-rose-400/30 bg-rose-950/30 p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-rose-300">Emergency Control</p>
      <h3 className="text-sm font-semibold text-rose-100">Panic Button</h3>
      <p className="mt-2 text-xs text-rose-200/90">
        Instantly revoke permissions, freeze agent actions, and activate emergency lock mode.
      </p>
      <div className="mt-4">
        <Button className="w-full bg-rose-500 hover:bg-rose-400" onClick={onPanic} disabled={disabled}>
          Trigger Emergency Lock
        </Button>
      </div>
    </section>
  );
}

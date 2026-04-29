type PromptInputProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function PromptInput({ value, disabled, onChange }: PromptInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Prompt</span>
      <textarea
        rows={4}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Optimize my USDC yield safely"
        className="w-full resize-none rounded-lg border border-slate-200/10 bg-slate-950/80 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/50"
      />
    </label>
  );
}

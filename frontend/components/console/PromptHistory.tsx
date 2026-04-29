type PromptHistoryProps = {
  items: string[];
};

export function PromptHistory({ items }: PromptHistoryProps) {
  return (
    <section className="rounded-xl border border-slate-200/10 bg-slate-950/60 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Prompt History</h2>
      <ul className="space-y-2 text-xs text-slate-300">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="rounded border border-slate-200/10 bg-slate-900/50 p-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

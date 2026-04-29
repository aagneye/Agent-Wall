import { WalletConnect, WalletStatus } from "@/components/wallet";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Agent Firewall</h1>
          <p className="max-w-2xl text-slate-300">
            Secure wallet entrypoint for autonomous Web3 agents, with Base network enforcement and
            Safe-ready transaction state preparation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <WalletConnect />
          <WalletStatus />
        </div>
      </section>
    </main>
  );
}

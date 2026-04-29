"use client";

import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusPill } from "@/components/ui/status-pill";
import { ENFORCED_CHAIN_NAME } from "@/lib/wallet/chains";
import { shortAddress } from "@/lib/wallet/format";
import { useBaseEnforcement } from "@/hooks/use-base-enforcement";
import { useWalletStatus } from "@/hooks/use-wallet-status";

export function WalletStatus() {
  const { address, chainId, isConnected, isOnEnforcedChain } = useWalletStatus();
  const { isSwitchingChain } = useBaseEnforcement();

  return (
    <GlassPanel className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Wallet Status</h2>
        <StatusPill tone={isConnected ? "success" : "neutral"}>
          {isConnected ? "Online" : "Offline"}
        </StatusPill>
      </div>

      <div className="grid gap-3 text-sm text-slate-200">
        <p>Address: {shortAddress(address)}</p>
        <p>Chain ID: {chainId ?? "N/A"}</p>
        <div className="flex items-center gap-2">
          <span>Base Enforcement:</span>
          <StatusPill tone={isOnEnforcedChain ? "success" : "warning"}>
            {isOnEnforcedChain ? `On ${ENFORCED_CHAIN_NAME}` : "Switch Required"}
          </StatusPill>
        </div>
        {isSwitchingChain ? (
          <p className="text-xs text-amber-300">Switching network to Base...</p>
        ) : null}
      </div>
    </GlassPanel>
  );
}

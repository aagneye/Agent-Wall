"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusPill } from "@/components/ui/status-pill";
import { shortAddress } from "@/lib/wallet/format";
import { useWalletStatus } from "@/hooks/use-wallet-status";

export function WalletConnect() {
  const { disconnect } = useDisconnect();
  const { isConnected, isConnecting, address } = useWalletStatus();

  return (
    <GlassPanel className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Wallet Connection</h2>
        <StatusPill tone={isConnected ? "success" : "neutral"}>
          {isConnected ? "Connected" : isConnecting ? "Connecting" : "Disconnected"}
        </StatusPill>
      </div>
      <p className="text-sm text-slate-300">Address: {shortAddress(address)}</p>
      <div className="flex items-center gap-3">
        <ConnectButton />
        {isConnected ? (
          <Button variant="secondary" onClick={() => disconnect()}>
            Disconnect
          </Button>
        ) : null}
      </div>
    </GlassPanel>
  );
}

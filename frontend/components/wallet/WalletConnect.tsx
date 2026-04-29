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
      <p className="text-xs text-slate-400">
        Connect any supported wallet to initialize Base-secured agent session context.
      </p>
      <div className="flex items-center gap-3">
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, mounted }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            if (!connected) {
              return (
                <Button onClick={openConnectModal} disabled={!ready}>
                  Connect Wallet
                </Button>
              );
            }

            return (
              <StatusPill tone="success">
                {account.displayName} on {chain.name}
              </StatusPill>
            );
          }}
        </ConnectButton.Custom>
        {isConnected ? (
          <Button variant="secondary" onClick={() => disconnect()}>
            Disconnect
          </Button>
        ) : null}
      </div>
    </GlassPanel>
  );
}

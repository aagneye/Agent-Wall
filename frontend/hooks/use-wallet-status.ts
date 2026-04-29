"use client";

import { useAccount, useChainId } from "wagmi";
import { ENFORCED_CHAIN_ID } from "@/lib/wallet/chains";

export function useWalletStatus() {
  const { address, status, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();

  return {
    address,
    chainId,
    status,
    isConnected,
    isConnecting,
    isDisconnected,
    isOnEnforcedChain: chainId === ENFORCED_CHAIN_ID
  };
}

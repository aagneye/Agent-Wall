"use client";

import { useEffect, useMemo } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { ENFORCED_CHAIN_ID } from "@/lib/wallet/chains";

export function useBaseEnforcement() {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  const shouldSwitch = useMemo(
    () => Boolean(isConnected && chainId && chainId !== ENFORCED_CHAIN_ID),
    [chainId, isConnected]
  );

  useEffect(() => {
    if (!shouldSwitch) {
      return;
    }

    switchChain({ chainId: ENFORCED_CHAIN_ID });
  }, [shouldSwitch, switchChain]);

  return {
    isEnforcedChain: chainId === ENFORCED_CHAIN_ID,
    isSwitchingChain: isPending
  };
}

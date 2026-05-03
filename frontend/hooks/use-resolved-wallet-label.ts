"use client";

import { useEffect, useState } from "react";
import { resolveENS, shortAddress } from "@/lib/wallet/format";
import { useWalletStatus } from "@/hooks/use-wallet-status";

/** Connected wallet label: ENS when available, otherwise shortened address or disconnected hint. */
export function useResolvedWalletLabel(): string {
  const { address } = useWalletStatus();
  const [label, setLabel] = useState(() => shortAddress(address));

  useEffect(() => {
    setLabel(shortAddress(address));
    let cancelled = false;
    void resolveENS(address ?? "").then((resolved) => {
      if (!cancelled) {
        setLabel(resolved);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [address]);

  return label;
}

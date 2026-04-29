"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSafePreparation } from "@/lib/api/safe";
import { useWalletStatus } from "@/hooks/use-wallet-status";

export function useSafeAccountPreparation() {
  const { address, isConnected } = useWalletStatus();

  const query = useQuery({
    queryKey: ["safe-preparation", address],
    queryFn: async () => getSafePreparation(address as string),
    enabled: Boolean(isConnected && address),
    staleTime: 30_000
  });

  return useMemo(
    () => ({
      safePreparation: query.data,
      isLoadingSafePreparation: query.isPending,
      safePreparationError: query.error
    }),
    [query.data, query.error, query.isPending]
  );
}

"use client";

import { useMemo, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import type { PreparedTransactionState, TxLifecycleStatus } from "@/lib/wallet/transaction";

export function useTransactionStatusPrep() {
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [status, setStatus] = useState<TxLifecycleStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const receiptQuery = useWaitForTransactionReceipt({
    hash: hash ?? undefined,
    query: {
      enabled: Boolean(hash)
    }
  });

  const state: PreparedTransactionState = useMemo(() => {
    if (receiptQuery.isError) {
      return {
        hash,
        status: "failed",
        errorMessage: receiptQuery.error.message
      };
    }

    if (receiptQuery.isSuccess) {
      return {
        hash,
        status: "confirmed"
      };
    }

    if (receiptQuery.isPending && hash) {
      return {
        hash,
        status: "submitted"
      };
    }

    return {
      hash,
      status,
      errorMessage
    };
  }, [errorMessage, hash, receiptQuery.error, receiptQuery.isError, receiptQuery.isPending, receiptQuery.isSuccess, status]);

  return {
    state,
    setPreparedHash: setHash,
    setLifecycleStatus: setStatus,
    setLifecycleError: setErrorMessage,
    reset: () => {
      setHash(null);
      setStatus("idle");
      setErrorMessage(undefined);
    }
  };
}

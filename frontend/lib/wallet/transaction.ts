export type TxLifecycleStatus =
  | "idle"
  | "preparing"
  | "awaiting_signature"
  | "submitted"
  | "confirmed"
  | "failed";

export type PreparedTransactionState = {
  hash: `0x${string}` | null;
  status: TxLifecycleStatus;
  errorMessage?: string;
};

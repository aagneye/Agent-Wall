import { createPublicClient, http, isAddress } from "viem";
import { getEnsName } from "viem/actions";
import { mainnet } from "viem/chains";

/** Ethereum mainnet client for ENS reverse lookup (same viem primitive wagmi ENS hooks rely on). */
const ensMainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export function shortAddress(address?: string | null): string {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Resolve primary ENS name on Ethereum mainnet, or fall back to {@link shortAddress}. */
export async function resolveENS(address: string): Promise<string> {
  const trimmed = address.trim();
  if (!trimmed) {
    return shortAddress(null);
  }
  if (!isAddress(trimmed)) {
    return trimmed.length >= 12 ? `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}` : trimmed;
  }

  try {
    const name = await getEnsName(ensMainnetClient, { address: trimmed });
    if (name) {
      return name;
    }
  } catch {
    // RPC / registry failures: show shortened hex
  }

  return shortAddress(trimmed);
}

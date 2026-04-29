import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const walletConfig = getDefaultConfig({
  appName: "Agent Firewall",
  projectId: walletConnectProjectId,
  chains: [mainnet, sepolia],
  ssr: true
});

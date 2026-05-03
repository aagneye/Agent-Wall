import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || "local-dev-project-id";

export const walletConfig = getDefaultConfig({
  appName: "Agent Firewall",
  projectId: walletConnectProjectId,
  chains: [base, baseSepolia],
  ssr: true
});

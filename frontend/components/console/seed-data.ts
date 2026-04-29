import type { ActivityLogItem, AgentActionItem } from "@/components/console/types";

export const initialRecentActions: AgentActionItem[] = [
  { id: "a1", title: "Route idle USDC to low-risk vault", timestamp: "2m ago", status: "done" },
  { id: "a2", title: "Validate signer permissions", timestamp: "5m ago", status: "running" }
];

export const initialActivityLog: ActivityLogItem[] = [
  { id: "l1", message: "Firewall policy profile loaded.", level: "info", timestamp: "09:12:10" },
  { id: "l2", message: "Base network checks passed.", level: "success", timestamp: "09:12:15" }
];

import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/providers/web3-provider";

export const metadata: Metadata = {
  title: "Agent Firewall",
  description: "AI security layer for autonomous Web3 agents"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}

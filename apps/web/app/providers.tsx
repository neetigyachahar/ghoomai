"use client";

import { AiFlowShell } from "@repo/widgets/screens/ai-flow";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AiFlowShell apiBase={apiBase}>{children}</AiFlowShell>;
}

"use client";

import { AiFlowShell } from "@repo/widgets/screens/ai-flow";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AiFlowShell>{children}</AiFlowShell>;
}

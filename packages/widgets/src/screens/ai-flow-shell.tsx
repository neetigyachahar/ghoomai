"use client";

import { type ReactNode } from "react";

import { getWidgetRegistryForAI } from "../registry";
import { AiProviderShell } from "./ai-provider-shell";

export interface AiFlowShellProps {
  apiEndpoint?: string;
  children: ReactNode;
}

export function AiFlowShell({ apiEndpoint, children }: AiFlowShellProps) {
  return (
    <AiProviderShell
      widgetRegistry={getWidgetRegistryForAI()}
      apiEndpoint={apiEndpoint}
    >
      {children}
    </AiProviderShell>
  );
}

export { AiPromptScreen } from "./ai-prompt-screen";
export type { AiPromptScreenProps } from "./ai-prompt-screen";
export { AiResultScreen } from "./ai-result-screen";
export { AiProviderShell } from "./ai-provider-shell";

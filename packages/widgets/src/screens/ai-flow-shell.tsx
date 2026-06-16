"use client";

import { type ReactNode } from "react";

import { TravelDataProvider } from "@repo/hooks/travel";

import { getWidgetRegistryForAI } from "../registry";
import { AiProviderShell } from "./ai-provider-shell";

export interface AiFlowShellProps {
  apiEndpoint?: string;
  apiBase?: string;
  children: ReactNode;
}

export function AiFlowShell({
  apiEndpoint,
  apiBase,
  children,
}: AiFlowShellProps) {
  return (
    <TravelDataProvider apiBase={apiBase}>
      <AiProviderShell
        widgetRegistry={getWidgetRegistryForAI()}
        apiEndpoint={apiEndpoint}
      >
        {children}
      </AiProviderShell>
    </TravelDataProvider>
  );
}

export { AiPromptScreen } from "./ai-prompt-screen";
export type { AiPromptScreenProps } from "./ai-prompt-screen";
export { AiResultScreen } from "./ai-result-screen";
export type { AiResultScreenProps } from "./ai-result-screen";
export { AiProviderShell } from "./ai-provider-shell";

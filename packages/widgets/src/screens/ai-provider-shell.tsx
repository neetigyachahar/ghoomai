"use client";

import { type ReactNode } from "react";

import { AIProvider } from "@repo/hooks/ai";
import type { WidgetAIMetadata } from "@repo/types";

import { AiKeyGate } from "./ai-key-gate";

export interface AiProviderShellProps {
  apiEndpoint?: string;
  widgetRegistry: Record<string, WidgetAIMetadata>;
  keyboardVisible?: boolean;
  children: ReactNode;
}

export function AiProviderShell({
  apiEndpoint,
  widgetRegistry,
  keyboardVisible = false,
  children,
}: AiProviderShellProps) {
  return (
    <AIProvider widgetRegistry={widgetRegistry} apiEndpoint={apiEndpoint}>
      <AiKeyGate keyboardVisible={keyboardVisible}>{children}</AiKeyGate>
    </AIProvider>
  );
}

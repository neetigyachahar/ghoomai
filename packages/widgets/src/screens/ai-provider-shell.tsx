"use client";

import { type ReactNode } from "react";

import { AIProvider } from "@repo/hooks/ai";
import type { WidgetAIMetadata } from "@repo/types";

import { AiKeyGate } from "./ai-key-gate";

export interface AiProviderShellProps {
  apiBase?: string;
  widgetRegistry: Record<string, WidgetAIMetadata>;
  keyboardVisible?: boolean;
  children: ReactNode;
}

export function AiProviderShell({
  apiBase,
  widgetRegistry,
  keyboardVisible = false,
  children,
}: AiProviderShellProps) {
  return (
    <AIProvider widgetRegistry={widgetRegistry} apiBase={apiBase}>
      <AiKeyGate keyboardVisible={keyboardVisible}>{children}</AiKeyGate>
    </AIProvider>
  );
}

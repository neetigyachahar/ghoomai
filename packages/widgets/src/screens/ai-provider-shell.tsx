"use client";

import { type ReactNode } from "react";

import { AIProvider } from "@repo/hooks/ai";
import type { WidgetAIMetadata } from "@repo/types";

export interface AiProviderShellProps {
  apiEndpoint?: string;
  widgetRegistry: Record<string, WidgetAIMetadata>;
  children: ReactNode;
}

export function AiProviderShell({
  apiEndpoint,
  widgetRegistry,
  children,
}: AiProviderShellProps) {
  return (
    <AIProvider widgetRegistry={widgetRegistry} apiEndpoint={apiEndpoint}>
      {children}
    </AIProvider>
  );
}

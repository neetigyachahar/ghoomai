"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AIMessage,
  AIStatus,
  ContentItem,
  WidgetAIMetadata,
  WidgetAIResponse,
} from "@repo/types";

export interface AIContextValue {
  widgetRegistry: Record<string, WidgetAIMetadata>;
  apiEndpoint: string;
  status: AIStatus;
  messages: AIMessage[];
  pendingQuestion: string | null;
  pendingOptions: string[];
  generatedLayout: ContentItem | null;
  error: string | null;
  setStatus: (status: AIStatus) => void;
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>;
  setPendingQuestion: (question: string | null) => void;
  setPendingOptions: (options: string[]) => void;
  setGeneratedLayout: (layout: ContentItem | null) => void;
  setError: (error: string | null) => void;
  callServer: (messages: AIMessage[]) => Promise<WidgetAIResponse>;
  reset: () => void;
}

export const AIContext = createContext<AIContextValue | null>(null);

export interface AIProviderProps {
  widgetRegistry: Record<string, WidgetAIMetadata>;
  apiEndpoint?: string;
  children: ReactNode;
}

export function AIProvider({
  widgetRegistry,
  apiEndpoint = "/api/ai/layout",
  children,
}: AIProviderProps) {
  const [status, setStatus] = useState<AIStatus>("idle");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [pendingOptions, setPendingOptions] = useState<string[]>([]);
  const [generatedLayout, setGeneratedLayout] = useState<ContentItem | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const callServer = useCallback(
    async (conversationMessages: AIMessage[]): Promise<WidgetAIResponse> => {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationMessages,
          widgetRegistry,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? `Request failed (${response.status})`);
      }

      return (await response.json()) as WidgetAIResponse;
    },
    [apiEndpoint, widgetRegistry],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMessages([]);
    setPendingQuestion(null);
    setPendingOptions([]);
    setGeneratedLayout(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      widgetRegistry,
      apiEndpoint,
      status,
      messages,
      pendingQuestion,
      pendingOptions,
      generatedLayout,
      error,
      setStatus,
      setMessages,
      setPendingQuestion,
      setPendingOptions,
      setGeneratedLayout,
      setError,
      callServer,
      reset,
    }),
    [
      widgetRegistry,
      apiEndpoint,
      status,
      messages,
      pendingQuestion,
      pendingOptions,
      generatedLayout,
      error,
      callServer,
      reset,
    ],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

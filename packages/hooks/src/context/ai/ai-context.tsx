"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ANTHROPIC_API_KEY_HEADER } from "@repo/types";
import type {
  AIMessage,
  AIProgressEvent,
  AIStatus,
  AiServerConfig,
  ContentItem,
  WidgetAIMetadata,
  WidgetAIResponse,
} from "@repo/types";

import {
  getAiConfigEndpoint,
  getAiLayoutEndpoint,
} from "../../hooks/ai/api-endpoints";
import { parseSseStream } from "../../hooks/ai/parse-sse-stream";

export interface CallServerOptions {
  onProgress?: (event: AIProgressEvent) => void;
}

export interface AIContextValue {
  widgetRegistry: Record<string, WidgetAIMetadata>;
  apiBase: string;
  configLoading: boolean;
  requiresClientApiKey: boolean;
  setClientApiKey: (key: string) => void;
  status: AIStatus;
  messages: AIMessage[];
  pendingQuestion: string | null;
  pendingOptions: string[];
  generatedLayout: ContentItem | ContentItem[] | null;
  error: string | null;
  setStatus: (status: AIStatus) => void;
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>;
  setPendingQuestion: (question: string | null) => void;
  setPendingOptions: (options: string[]) => void;
  setGeneratedLayout: (layout: ContentItem | ContentItem[] | null) => void;
  setError: (error: string | null) => void;
  callServer: (
    messages: AIMessage[],
    options?: CallServerOptions,
  ) => Promise<WidgetAIResponse>;
  reset: () => void;
}

export const AIContext = createContext<AIContextValue | null>(null);

export interface AIProviderProps {
  widgetRegistry: Record<string, WidgetAIMetadata>;
  apiBase?: string;
  children: ReactNode;
}

export function AIProvider({
  widgetRegistry,
  apiBase = "",
  children,
}: AIProviderProps) {
  const [status, setStatus] = useState<AIStatus>("idle");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [pendingOptions, setPendingOptions] = useState<string[]>([]);
  const [generatedLayout, setGeneratedLayout] = useState<
    ContentItem | ContentItem[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [serverKeyConfigured, setServerKeyConfigured] = useState(true);
  const [clientApiKey, setClientApiKeyState] = useState<string | null>(null);
  const layoutEndpoint = getAiLayoutEndpoint(apiBase);
  const configEndpoint = getAiConfigEndpoint(apiBase);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const response = await fetch(configEndpoint);

        if (!response.ok) {
          throw new Error(`Config request failed (${response.status})`);
        }

        const config = (await response.json()) as AiServerConfig;

        if (!cancelled) {
          setServerKeyConfigured(config.serverKeyConfigured);
        }
      } catch {
        if (!cancelled) {
          setServerKeyConfigured(false);
        }
      } finally {
        if (!cancelled) {
          setConfigLoading(false);
        }
      }
    }

    void loadConfig();

    return () => {
      cancelled = true;
    };
  }, [configEndpoint]);

  const setClientApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    setClientApiKeyState(trimmed || null);
  }, []);

  const requiresClientApiKey =
    !configLoading && !serverKeyConfigured && clientApiKey === null;

  const callServer = useCallback(
    async (
      conversationMessages: AIMessage[],
      options?: CallServerOptions,
    ): Promise<WidgetAIResponse> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (!serverKeyConfigured && clientApiKey) {
        headers[ANTHROPIC_API_KEY_HEADER] = clientApiKey;
      }

      const response = await fetch(layoutEndpoint, {
        method: "POST",
        headers,
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

      if (!response.body) {
        throw new Error("No response body");
      }

      let result: WidgetAIResponse | null = null;

      for await (const message of parseSseStream(response.body)) {
        if (message.event === "progress") {
          options?.onProgress?.(message.data as AIProgressEvent);
          continue;
        }

        if (message.event === "result") {
          result = message.data as WidgetAIResponse;
          continue;
        }

        if (message.event === "error") {
          const data = message.data as { error?: string };
          throw new Error(data.error ?? "Failed to generate layout");
        }
      }

      if (!result) {
        throw new Error("Stream ended without a result");
      }

      return result;
    },
    [layoutEndpoint, clientApiKey, serverKeyConfigured, widgetRegistry],
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
      apiBase,
      configLoading,
      requiresClientApiKey,
      setClientApiKey,
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
      apiBase,
      configLoading,
      requiresClientApiKey,
      setClientApiKey,
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

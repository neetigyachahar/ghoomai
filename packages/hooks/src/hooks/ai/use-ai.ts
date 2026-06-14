"use client";

import { useCallback, useContext } from "react";

import type { AIStatus } from "@repo/types";

import { AIContext } from "../../context/ai/ai-context";

export interface UseAiOptions {
  onNavigateToResult?: () => void;
}

export function useAi(options: UseAiOptions = {}) {
  const { onNavigateToResult } = options;
  const context = useContext(AIContext);

  if (!context) {
    throw new Error("useAi must be used within AIProvider");
  }

  const {
    status,
    pendingQuestion,
    pendingOptions,
    error,
    messages,
    setStatus,
    setMessages,
    setPendingQuestion,
    setPendingOptions,
    setGeneratedLayout,
    setError,
    callServer,
    reset,
  } = context;

  const handleResponse = useCallback(
    async (conversationMessages: Parameters<typeof callServer>[0]) => {
      const response = await callServer(conversationMessages);

      if (response.type === "question") {
        setPendingQuestion(response.question);
        setPendingOptions(response.options ?? []);
        setMessages([
          ...conversationMessages,
          { role: "assistant", content: response.question },
        ]);
        setStatus("awaiting_answer");
        return;
      }

      setGeneratedLayout(response.layout);
      setPendingQuestion(null);
      setPendingOptions([]);
      setStatus("complete");
      onNavigateToResult?.();
    },
    [
      callServer,
      onNavigateToResult,
      setGeneratedLayout,
      setMessages,
      setPendingQuestion,
      setPendingOptions,
      setStatus,
    ],
  );

  const onPromptEnter = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "loading") {
        return;
      }

      const nextMessages = [{ role: "user" as const, content: trimmed }];

      setError(null);
      setStatus("loading");
      setMessages(nextMessages);

      try {
        await handleResponse(nextMessages);
      } catch (err) {
        setPendingQuestion(null);
        setPendingOptions([]);
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    },
    [handleResponse, setError, setMessages, setStatus, status],
  );

  const onAnswerQuestion = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status !== "awaiting_answer") {
        return;
      }

      const nextMessages = [
        ...messages,
        { role: "user" as const, content: trimmed },
      ];

      setError(null);
      setStatus("loading");
      setMessages(nextMessages);

      try {
        await handleResponse(nextMessages);
      } catch (err) {
        setPendingQuestion(null);
        setPendingOptions([]);
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    },
    [handleResponse, messages, setError, setMessages, setStatus, status],
  );

  const isLoading = status === "loading";

  return {
    onPromptEnter,
    onAnswerQuestion,
    state: status as AIStatus,
    pendingQuestion,
    pendingOptions,
    error,
    reset,
    isLoading,
  };
}

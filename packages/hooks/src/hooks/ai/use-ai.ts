"use client";

import { useCallback, useContext, useState } from "react";

import type { AIProgressEvent, AIStatus } from "@repo/types";

import { AIContext } from "../../context/ai/ai-context";
import { useQueuedProgress } from "./use-queued-progress";

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

  const [latestProgress, setLatestProgress] = useState<AIProgressEvent | null>(
    null,
  );
  const [progressTick, setProgressTick] = useState(0);

  const isLoading = status === "loading";
  const displayProgress = useQueuedProgress(
    latestProgress,
    progressTick,
    isLoading,
  );

  const handleResponse = useCallback(
    async (conversationMessages: Parameters<typeof callServer>[0]) => {
      setLatestProgress(null);
      setProgressTick(0);

      const response = await callServer(conversationMessages, {
        onProgress: (event) => {
          setPendingQuestion(null);
          setPendingOptions([]);

          setLatestProgress(event);
          setProgressTick((tick) => tick + 1);
        },
      });

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
    [handleResponse, setError, setMessages, setPendingOptions, setPendingQuestion, setStatus, status],
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
    [handleResponse, messages, setError, setMessages, setPendingOptions, setPendingQuestion, setStatus, status],
  );

  return {
    onPromptEnter,
    onAnswerQuestion,
    state: status as AIStatus,
    pendingQuestion,
    pendingOptions,
    error,
    reset,
    isLoading,
    displayProgress,
  };
}

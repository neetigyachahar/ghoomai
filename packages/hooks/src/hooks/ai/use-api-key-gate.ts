"use client";

import { useContext } from "react";

import { AIContext } from "../../context/ai/ai-context";

export function useApiKeyGate() {
  const context = useContext(AIContext);

  if (!context) {
    throw new Error("useApiKeyGate must be used within AIProvider");
  }

  const { configLoading, requiresClientApiKey, setClientApiKey } = context;

  return {
    configLoading,
    requiresClientApiKey,
    setClientApiKey,
  };
}

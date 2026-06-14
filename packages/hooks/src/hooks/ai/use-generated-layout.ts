"use client";

import { useContext } from "react";

import { AIContext } from "../../context/ai/ai-context";

export function useGeneratedLayout() {
  const context = useContext(AIContext);

  if (!context) {
    throw new Error("useGeneratedLayout must be used within AIProvider");
  }

  return {
    layout: context.generatedLayout,
    clearLayout: () => context.setGeneratedLayout(null),
  };
}

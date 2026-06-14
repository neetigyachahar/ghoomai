"use client";

import { useState } from "react";

import { useAi } from "@repo/hooks/ai";
import { Box } from "@repo/ui/box";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Text } from "@repo/ui/text";

export interface AiPromptScreenProps {
  onNavigateToResult?: () => void;
}

export function AiPromptScreen({ onNavigateToResult }: AiPromptScreenProps) {
  const [input, setInput] = useState("");
  const {
    onPromptEnter,
    onAnswerQuestion,
    state,
    pendingQuestion,
    error,
    isLoading,
  } = useAi({ onNavigateToResult });

  const isAwaitingAnswer = state === "awaiting_answer";
  const canSubmit = input.trim().length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    if (isAwaitingAnswer) {
      onAnswerQuestion(input);
    } else {
      onPromptEnter(input);
    }

    setInput("");
  };

  return (
    <Box
      className="mx-auto flex w-full max-w-lg flex-col gap-4 p-4"
      style={{
        flexDirection: "column",
        gap: 16,
        padding: 16,
        width: "100%",
        maxWidth: 512,
        alignSelf: "center",
      }}
    >
      <Text variant="title">Plan your trip</Text>
      <Text>
        Describe what you want to see and we will build a layout from registered
        widgets.
      </Text>

      {pendingQuestion ? (
        <Box
          className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
          style={{
            borderWidth: 1,
            borderColor: "#e4e4e7",
            borderRadius: 12,
            padding: 16,
            backgroundColor: "#fafafa",
          }}
        >
          <Text variant="title">Question</Text>
          <Text>{pendingQuestion}</Text>
        </Box>
      ) : null}

      <Input
        value={input}
        onChangeText={setInput}
        placeholder={
          isAwaitingAnswer
            ? "Type your answer..."
            : "e.g. Show a hotel booking section with actions"
        }
        multiline
        onSubmit={handleSubmit}
      />

      <Button onPress={handleSubmit}>
        {isLoading
          ? "Thinking..."
          : isAwaitingAnswer
            ? "Send answer"
            : "Generate layout"}
      </Button>

      {error ? <Text>{error}</Text> : null}
    </Box>
  );
}

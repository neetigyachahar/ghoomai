"use client";

import { useState } from "react";

import { useAi } from "@repo/hooks/ai";
import { AiProgressStrip } from "@repo/ui/ai-progress-strip";
import { Box } from "@repo/ui/box";
import { BrandMark } from "@repo/ui/brand-mark";
import { PromptBar } from "@repo/ui/prompt-bar";
import { QuestionSheet } from "@repo/ui/question-sheet";
import { Text } from "@repo/ui/text";
import { colors } from "@repo/ui/theme";

export interface AiPromptScreenProps {
  onNavigateToResult?: () => void;
  keyboardVisible?: boolean;
}

export function AiPromptScreen({
  onNavigateToResult,
  keyboardVisible = false,
}: AiPromptScreenProps) {
  const [promptInput, setPromptInput] = useState("");
  const [freeTextInput, setFreeTextInput] = useState("");
  const {
    onPromptEnter,
    onAnswerQuestion,
    pendingQuestion,
    pendingOptions,
    error,
    isLoading,
    displayProgress,
  } = useAi({ onNavigateToResult });

  const showQuestionSheet = Boolean(pendingQuestion);
  const showIntegratedComposer = isLoading && Boolean(displayProgress);

  const handlePromptSubmit = () => {
    const trimmed = promptInput.trim();
    if (!trimmed || isLoading) {
      return;
    }

    onPromptEnter(trimmed);
    setPromptInput("");
  };

  const handleOptionSelect = (option: string) => {
    if (isLoading) {
      return;
    }

    onAnswerQuestion(option);
    setFreeTextInput("");
  };

  const handleFreeTextSubmit = () => {
    const trimmed = freeTextInput.trim();
    if (!trimmed || isLoading) {
      return;
    }

    onAnswerQuestion(trimmed);
    setFreeTextInput("");
  };

  const promptBar = (
    <PromptBar
      value={promptInput}
      onChangeText={setPromptInput}
      placeholder="What's on your mind?"
      onSubmit={handlePromptSubmit}
      loading={isLoading}
      disabled={isLoading}
      embedded={showIntegratedComposer}
    />
  );

  const bottomContent = (
    <Box
      className="flex w-full flex-col gap-3"
      style={{ width: "100%", flexDirection: "column", gap: 12 }}
    >
      {showQuestionSheet && pendingQuestion ? (
        <QuestionSheet
          question={pendingQuestion}
          options={pendingOptions}
          freeTextValue={freeTextInput}
          onFreeTextChange={setFreeTextInput}
          onSelectOption={handleOptionSelect}
          onFreeTextSubmit={handleFreeTextSubmit}
          disabled={isLoading}
          loading={isLoading}
        />
      ) : null}

      {!showQuestionSheet ? (
        showIntegratedComposer && displayProgress ? (
          <Box
            className="w-full overflow-hidden rounded-2xl border border-stone-200 bg-white transition-colors focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20"
            style={{
              width: "100%",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.borderDefault,
              backgroundColor: colors.bgSurface,
              overflow: "hidden",
            }}
          >
            <AiProgressStrip
              eventType={displayProgress.type}
              embedded
            />
            {promptBar}
          </Box>
        ) : (
          promptBar
        )
      ) : null}

      {error ? (
        <Text
          variant="caption"
          className="px-1 text-center"
          style={{ textAlign: "center", paddingHorizontal: 4 }}
        >
          {error}
        </Text>
      ) : null}
    </Box>
  );

  return (
    <Box
      className="flex w-full flex-col"
      style={{
        flex: 1,
        width: "100%",
        flexDirection: "column",
        backgroundColor: colors.bgBase,
      }}
    >
      <Box
        className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pt-4 md:min-h-dvh md:pt-8"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 480,
          alignSelf: "center",
          flexDirection: "column",
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        {keyboardVisible ? (
          <>
            <Box
              className="flex flex-1 items-center justify-center"
              style={{
                flex: 1,
                minHeight: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrandMark />
            </Box>
            <Box
              className="w-full"
              style={{ width: "100%", flexShrink: 0 }}
            >
              {bottomContent}
            </Box>
          </>
        ) : (
          <>
            <Box
              className="flex flex-1 items-center justify-center"
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrandMark />
            </Box>
            <Box
              className="flex flex-1 flex-col justify-end pb-4 md:pb-8"
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
                paddingBottom: 16,
              }}
            >
              {bottomContent}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

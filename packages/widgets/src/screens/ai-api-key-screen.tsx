"use client";

import { useState } from "react";

import { useApiKeyGate } from "@repo/hooks/ai";
import { Box } from "@repo/ui/box";
import { BrandMark } from "@repo/ui/brand-mark";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Text } from "@repo/ui/text";
import { colors } from "@repo/ui/theme";

export interface AiApiKeyScreenProps {
  keyboardVisible?: boolean;
}

export function AiApiKeyScreen({
  keyboardVisible = false,
}: AiApiKeyScreenProps = {}) {
  const { setClientApiKey } = useApiKeyGate();
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const trimmed = apiKeyInput.trim();

    if (!trimmed) {
      setError("Enter your Anthropic API key to continue.");
      return;
    }

    if (!trimmed.startsWith("sk-ant-")) {
      setError("That does not look like an Anthropic API key.");
      return;
    }

    setError(null);
    setClientApiKey(trimmed);
    setApiKeyInput("");
  };

  const bottomContent = (
    <Box
      className="flex w-full flex-col gap-4"
      style={{
        width: "100%",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Box
        className="flex w-full flex-col gap-2"
        style={{ width: "100%", flexDirection: "column", gap: 8 }}
      >
        <Text
          variant="title"
          className="text-center"
          style={{ textAlign: "center" }}
        >
          Bring your own key
        </Text>
        <Text
          variant="body"
          className="text-center text-stone-600"
          style={{ textAlign: "center", color: colors.textMuted }}
        >
          This demo has no server API key. Add your Anthropic key to start
          planning. It stays in memory only and is cleared when you refresh or
          close the app.
        </Text>
      </Box>

      <Input
        value={apiKeyInput}
        onChangeText={setApiKeyInput}
        placeholder="sk-ant-..."
        secureTextEntry
        onSubmit={handleContinue}
      />

      <Button onPress={handleContinue}>Continue</Button>

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

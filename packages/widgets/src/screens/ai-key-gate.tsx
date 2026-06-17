"use client";

import { type ReactNode } from "react";

import { useApiKeyGate } from "@repo/hooks/ai";
import { Box } from "@repo/ui/box";
import { Text } from "@repo/ui/text";
import { colors } from "@repo/ui/theme";

import { AiApiKeyScreen } from "./ai-api-key-screen";

export interface AiKeyGateProps {
  keyboardVisible?: boolean;
  children: ReactNode;
}

export function AiKeyGate({
  keyboardVisible = false,
  children,
}: AiKeyGateProps) {
  const { configLoading, requiresClientApiKey } = useApiKeyGate();

  if (configLoading) {
    return (
      <Box
        className="flex min-h-dvh w-full items-center justify-center"
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.bgBase,
        }}
      >
        <Text variant="body" style={{ color: colors.textMuted }}>
          Loading...
        </Text>
      </Box>
    );
  }

  if (requiresClientApiKey) {
    return <AiApiKeyScreen keyboardVisible={keyboardVisible} />;
  }

  return children;
}

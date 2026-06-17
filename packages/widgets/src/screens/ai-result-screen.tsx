"use client";

import { useEffect, type ReactNode } from "react";

import { useGeneratedLayout } from "@repo/hooks/ai";
import { Box } from "@repo/ui/box";
import { ScrollBox } from "@repo/ui/scroll-box";
import { colors } from "@repo/ui/theme";

import { ContentRenderer } from "../renderer";

export interface AiResultScreenProps {
  onNavigateBack?: () => void;
}

function ResultBody({ children }: { children: ReactNode }) {
  return (
    <Box
      className="mx-auto w-full max-w-3xl px-4 pt-6 pb-12 md:px-8 md:pt-10 lg:max-w-5xl lg:px-12 lg:pb-16"
      style={{
        width: "100%",
        maxWidth: 1024,
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 48,
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  );
}

export function AiResultScreen({ onNavigateBack }: AiResultScreenProps = {}) {
  const { layout } = useGeneratedLayout();

  useEffect(() => {
    if (!layout) {
      onNavigateBack?.();
    }
  }, [layout, onNavigateBack]);

  if (!layout) {
    return null;
  }

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
      <ScrollBox
        style={{ flex: 1, width: "100%", backgroundColor: colors.bgBase }}
        contentContainerStyle={{ width: "100%" }}
        contentContainerClassName="flex w-full flex-col items-center"
      >
        <ResultBody>
          <ContentRenderer content={layout} />
        </ResultBody>
      </ScrollBox>
    </Box>
  );
}

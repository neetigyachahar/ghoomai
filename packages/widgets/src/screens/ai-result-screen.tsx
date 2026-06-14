"use client";

import type { ReactNode } from "react";

import { DemoBookingProvider } from "@repo/hooks/demo";
import { useGeneratedLayout } from "@repo/hooks/ai";
import { Box } from "@repo/ui/box";
import { ScrollBox } from "@repo/ui/scroll-box";
import { Text } from "@repo/ui/text";
import { colors } from "@repo/ui/theme";

import { ContentRenderer } from "../renderer";

function ResultBody({ children }: { children: ReactNode }) {
  return (
    <Box
      className="w-full px-4 pt-6 pb-12"
      style={{
        width: "100%",
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

export function AiResultScreen() {
  const { layout } = useGeneratedLayout();

  const shell = (
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
      >
        {layout ? (
          <ResultBody>
            <ContentRenderer content={layout} />
          </ResultBody>
        ) : (
          <ResultBody>
            <Text variant="title">No layout yet</Text>
            <Text>Generate a layout from the prompt screen first.</Text>
          </ResultBody>
        )}
      </ScrollBox>
    </Box>
  );

  return layout ? (
    <DemoBookingProvider>{shell}</DemoBookingProvider>
  ) : (
    shell
  );
}

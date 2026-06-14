"use client";

import { DemoBookingProvider } from "@repo/hooks/demo";
import { useGeneratedLayout } from "@repo/hooks/ai";
import { Box } from "@repo/ui/box";
import { Text } from "@repo/ui/text";

import { ContentRenderer } from "../renderer";

export function AiResultScreen() {
  const { layout } = useGeneratedLayout();

  if (!layout) {
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
        <Text variant="title">No layout yet</Text>
        <Text>Generate a layout from the prompt screen first.</Text>
      </Box>
    );
  }

  return (
    <DemoBookingProvider>
      <Box
        className="mx-auto w-full max-w-lg p-4"
        style={{
          width: "100%",
          maxWidth: 512,
          padding: 16,
          alignSelf: "center",
        }}
      >
        <ContentRenderer content={layout} />
      </Box>
    </DemoBookingProvider>
  );
}

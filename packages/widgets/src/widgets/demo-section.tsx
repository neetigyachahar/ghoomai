import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

import { Box } from "@repo/ui/box";
import { Text } from "@repo/ui/text";

export interface DemoSectionWidgetProps {
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
}

const containerStyle: ViewStyle = {
  flexDirection: "column",
  gap: 12,
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#e4e4e7",
};

export function DemoSectionWidget({
  title,
  children,
  footer,
}: DemoSectionWidgetProps) {
  return (
    <Box
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4"
      style={containerStyle}
    >
      <Text variant="title">{title}</Text>
      {children}
      {footer}
    </Box>
  );
}

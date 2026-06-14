import {
  ScrollView,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import type { ScrollBoxProps } from "./scroll-box.types";

export type { ScrollBoxProps } from "./scroll-box.types";

export function ScrollBox({
  children,
  style,
  contentContainerStyle,
}: ScrollBoxProps) {
  return (
    <ScrollView
      style={[{ flex: 1 }, style as StyleProp<ViewStyle>]}
      contentContainerStyle={contentContainerStyle as StyleProp<ViewStyle>}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
    >
      {children}
    </ScrollView>
  );
}

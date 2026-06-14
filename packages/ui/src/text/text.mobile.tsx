import {
  StyleSheet,
  Text as RNText,
  type StyleProp,
  type TextStyle,
} from "react-native";

import type { TextProps } from "./text.types";

export type { TextProps, TextVariant } from "./text.types";

export function Text({
  children,
  variant = "body",
  style,
}: TextProps) {
  return (
    <RNText
      style={[
        styles.base,
        variant === "title" ? styles.title : styles.body,
        style as StyleProp<TextStyle>,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: "#3f3f46",
  },
  body: {
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#18181b",
  },
});

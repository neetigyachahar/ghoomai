import { Pressable, StyleSheet, Text } from "react-native";

import type { ButtonProps } from "./button.types";

export type { ButtonProps, ButtonVariant } from "./button.types";

export function Button({
  children,
  variant = "primary",
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
      ]}
      onPress={onPress}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.text,
            variant === "primary" ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#18181b",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d4d4d8",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  primaryText: {
    color: "#fafafa",
  },
  secondaryText: {
    color: "#18181b",
  },
});

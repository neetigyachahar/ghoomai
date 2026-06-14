import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { OrDividerProps } from "./or-divider.types";

export type { OrDividerProps } from "./or-divider.types";

export function OrDivider({ style }: OrDividerProps) {
  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      <View style={styles.line} />
      <Text style={styles.label}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderDefault,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
});

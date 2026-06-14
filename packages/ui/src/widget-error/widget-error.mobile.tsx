import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { WidgetErrorProps } from "./widget-error.types";

export type { WidgetErrorProps } from "./widget-error.types";

export function WidgetError({
  widgetKey,
  message,
  details,
  style,
}: WidgetErrorProps) {
  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      <Text style={styles.message}>{message}</Text>
      {widgetKey ? <Text style={styles.widgetKey}>Widget: {widgetKey}</Text> : null}
      {details ? <Text style={styles.details}>{details}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  message: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.error,
  },
  widgetKey: {
    fontSize: 12,
    color: colors.textMuted,
  },
  details: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
});

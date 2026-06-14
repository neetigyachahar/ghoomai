import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { WidgetDividerProps } from "./widget-divider.types";

export type { WidgetDividerProps } from "./widget-divider.types";

export function WidgetDivider({ style }: WidgetDividerProps) {
  return <View style={[styles.divider, style as StyleProp<ViewStyle>]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.borderDefault,
    marginVertical: 4,
  },
});

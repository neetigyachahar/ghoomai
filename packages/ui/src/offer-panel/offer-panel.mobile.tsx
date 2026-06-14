import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { OfferPanelProps } from "./offer-panel.types";

export type { OfferPanelProps } from "./offer-panel.types";

export function OfferPanel({ children, highlight, style }: OfferPanelProps) {
  return (
    <View
      style={[
        styles.panel,
        style as StyleProp<ViewStyle>,
      ]}
    >
      {highlight ? (
        <View style={styles.highlightBar}>
          <View style={styles.highlightChip}>
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderLeftWidth: 3,
    borderLeftColor: colors.brandGhoom,
    backgroundColor: colors.bgSurface,
    overflow: "hidden",
  },
  highlightBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.bgAccentSoft,
  },
  highlightChip: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.bgSurface,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.brandGhoom,
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { SectionHeaderProps } from "./section-header.types";

export type { SectionHeaderProps } from "./section-header.types";

export function SectionHeader({ title, description, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      <View style={styles.pill}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 4,
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.bgAccentSoft,
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.brandGhoom,
  },
  description: {
    fontSize: 14,
    lineHeight: 19,
    color: colors.textSecondary,
  },
});

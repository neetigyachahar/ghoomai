import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { normalizeTripStats } from "./trip-header.types";
import type { TripHeaderProps } from "./trip-header.types";

export type { TripHeaderProps, TripStat } from "./trip-header.types";
export { normalizeTripStats } from "./trip-header.types";

export function TripHeader({ title, subtitle, stats, style }: TripHeaderProps) {
  const displayStats = normalizeTripStats(stats);
  const hasStats = Boolean(displayStats?.length);

  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>Your trip</Text>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      {hasStats ? (
        <View style={styles.statGrid}>
          {displayStats!.map((stat, index) => (
            <View key={`${stat.label}-${index}`} style={styles.statCell}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    gap: 16,
  },
  heading: {
    flexDirection: "column",
    gap: 12,
  },
  titleGroup: {
    flexDirection: "column",
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.brandGhoom,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    overflow: "hidden",
  },
  statCell: {
    flexBasis: "50%",
    flexGrow: 1,
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 19,
    color: colors.textPrimary,
  },
});

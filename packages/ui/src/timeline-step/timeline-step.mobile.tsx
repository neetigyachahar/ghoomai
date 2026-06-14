import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { TimelineStepProps } from "./timeline-step.types";

export type { TimelineStepProps } from "./timeline-step.types";

export function TimelineStep({
  dayLabel,
  label,
  time,
  note,
  isLast = false,
  children,
  style,
}: TimelineStepProps) {
  const hasHeader = Boolean(dayLabel || label || time || note);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: isLast ? 0 : 24 },
        style as StyleProp<ViewStyle>,
      ]}
    >
      {hasHeader ? (
        <View style={styles.header}>
          {dayLabel ? <Text style={styles.dayLabel}>{dayLabel}</Text> : null}
          {label || time ? (
            <View style={styles.labelRow}>
              {label ? <Text style={styles.label}>{label}</Text> : null}
              {time ? <Text style={styles.time}>{time}</Text> : null}
            </View>
          ) : null}
          {note ? <Text style={styles.note}>{note}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
  },
  header: {
    marginBottom: 12,
    gap: 6,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.brandGhoom,
  },
  labelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
    color: colors.textPrimary,
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});

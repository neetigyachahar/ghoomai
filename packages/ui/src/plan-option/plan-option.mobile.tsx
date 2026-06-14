import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { PlanOptionProps } from "./plan-option.types";

export type { PlanOptionProps } from "./plan-option.types";

export function PlanOption({
  label,
  summary,
  selected = false,
  onPress,
  style,
}: PlanOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: selected ? colors.borderFocus : colors.borderDefault,
          backgroundColor: pressed ? colors.bgAccentSoft : colors.bgSurface,
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {summary ? <Text style={styles.summary}>{summary}</Text> : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderDefault,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.brandGhoom,
    backgroundColor: colors.brandGhoom,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bgSurface,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: colors.textPrimary,
  },
  summary: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 18,
    color: colors.textMuted,
  },
});

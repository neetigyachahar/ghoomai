import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme/colors";
import type { OptionChipProps } from "./option-chip.types";

export type { OptionChipProps } from "./option-chip.types";

export function OptionChip({ label, onPress, disabled = false }: OptionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pressed: {
    backgroundColor: colors.bgAccentSoft,
    borderColor: colors.borderFocus,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
  },
});

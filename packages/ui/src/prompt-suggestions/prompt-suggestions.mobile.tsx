import { StyleSheet, View } from "react-native";

import { OptionChip } from "../option-chip/option-chip.mobile";
import { Text } from "../text/text.mobile";
import { colors } from "../theme/colors";
import type { PromptSuggestionsProps } from "./prompt-suggestions.types";

export type { PromptSuggestionsProps } from "./prompt-suggestions.types";

export function PromptSuggestions({
  suggestions,
  onSelect,
  disabled = false,
}: PromptSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="caption" style={styles.heading}>
        Try these prompts
      </Text>
      <View style={styles.list}>
        {suggestions.map((suggestion) => (
          <OptionChip
            key={suggestion}
            label={suggestion}
            onPress={() => onSelect(suggestion)}
            disabled={disabled}
            fullWidth
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
  heading: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
    color: colors.textMuted,
  },
  list: {
    gap: 8,
  },
});

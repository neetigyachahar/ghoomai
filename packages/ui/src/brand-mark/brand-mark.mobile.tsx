import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import type { BrandMarkProps } from "./brand-mark.types";

export type { BrandMarkProps } from "./brand-mark.types";

export function BrandMark({
  size = "default",
  tagline = "Plan your trips with ease",
}: BrandMarkProps) {
  const fontSize = size === "large" ? 52 : 40;

  return (
    <View style={styles.container} accessibilityLabel="GhoomAI">
      <Text style={[styles.mark, { fontSize }]}>
        <Text style={styles.ghoom}>Ghoom</Text>
        <Text style={styles.ai}>AI</Text>
      </Text>
      {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  mark: {
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "center",
  },
  ghoom: {
    color: colors.brandGhoom,
  },
  ai: {
    color: colors.brandAi,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

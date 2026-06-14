import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { ContentBlockProps } from "./content-block.types";

export type { ContentBlockProps } from "./content-block.types";

export function ContentBlock({ heading, content, style }: ContentBlockProps) {
  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      {content ? <Text style={styles.content}>{content}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
  },
  heading: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
  },
});

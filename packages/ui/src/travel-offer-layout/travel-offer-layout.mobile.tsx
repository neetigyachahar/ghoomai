import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { TravelTypeIcon } from "../travel-type-icon/travel-type-icon.mobile";
import type {
  TravelOfferLayoutProps,
  TravelOfferTagTone,
} from "./travel-offer-layout.types";

export type {
  TravelOfferLayoutProps,
  TravelOfferTag,
  TravelOfferTagTone,
} from "./travel-offer-layout.types";

const tagToneStyles: Record<
  TravelOfferTagTone,
  { backgroundColor: string; color: string }
> = {
  teal: { backgroundColor: colors.bgAccentSoft, color: colors.brandGhoom },
  orange: { backgroundColor: "#FFEDD5", color: colors.brandAi },
  stone: { backgroundColor: colors.bgSubtle, color: colors.textSecondary },
};

export function TravelOfferLayout({
  type,
  header,
  footer,
  tag,
  highlight,
  style,
}: TravelOfferLayoutProps) {
  const tagStyle = tagToneStyles[tag?.tone ?? "stone"];

  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
      <View style={styles.headerRow}>
        <View style={styles.headerContent}>{header}</View>
        <TravelTypeIcon type={type} style={styles.icon} />
      </View>
      <View>{footer}</View>
      <View style={styles.actionsRow}>
        {tag ? (
          <View style={[styles.tag, { backgroundColor: tagStyle.backgroundColor }]}>
            <Text style={[styles.tagText, { color: tagStyle.color }]}>
              {tag.label}
            </Text>
          </View>
        ) : (
          <View />
        )}
        <Pressable accessibilityRole="button">
          <Text style={styles.changeText}>Change</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 12,
  },
  highlight: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  icon: {
    flexShrink: 0,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    paddingTop: 12,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.brandGhoom,
  },
});

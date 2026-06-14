import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { ContentBlockGroupProps } from "./content-block-group.types";

export type {
  ContentBlockGroupItem,
  ContentBlockGroupProps,
} from "./content-block-group.types";

export function ContentBlockGroup({ items, style }: ContentBlockGroupProps) {
  if (items.length === 0) {
    return null;
  }

  const showNumbers =
    items.length > 1 && items.every((item) => Boolean(item.heading));

  return (
    <View style={[styles.list, style as StyleProp<ViewStyle>]}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View
            key={`${item.heading ?? "item"}-${index}`}
            style={[
              styles.item,
              index === 0 ? styles.itemFirst : null,
              !isLast ? styles.itemBorder : null,
            ]}
          >
            {showNumbers ? (
              <Text style={styles.index}>{index + 1}</Text>
            ) : null}
            <View style={styles.body}>
              {item.heading ? (
                <Text style={styles.heading}>{item.heading}</Text>
              ) : null}
              <Text style={styles.content}>{item.content}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    flexDirection: "column",
  },
  item: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 18,
  },
  itemFirst: {
    paddingTop: 0,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderDefault,
  },
  index: {
    marginTop: 2,
    minWidth: 16,
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: colors.brandGhoom,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 6,
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

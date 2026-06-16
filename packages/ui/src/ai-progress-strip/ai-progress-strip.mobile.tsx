import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  View,
} from "react-native";
import { LayoutGrid, SlidersHorizontal } from "lucide-react-native";

import type { TravelResourceType } from "@repo/types";

import { Text } from "../text/text.mobile";
import { colors } from "../theme/colors";
import { TravelTypeIcon } from "../travel-type-icon/travel-type-icon.mobile";
import {
  AI_PROGRESS_LABELS,
  type AiProgressStripProps,
} from "./ai-progress-strip.types";

export type { AiProgressStripProps } from "./ai-progress-strip.types";

const EMBEDDED_STRIP_HEIGHT = 36;

const TRAVEL_ICON_TYPES: Partial<Record<AiProgressStripProps["eventType"], TravelResourceType>> =
  {
    search_flights: "flight",
    search_buses: "bus",
    search_trains: "train",
    search_cabs: "cab",
    search_hotels: "hotel",
  };

function EventIcon({
  eventType,
  compact = false,
}: Pick<AiProgressStripProps, "eventType"> & { compact?: boolean }) {
  const travelType = TRAVEL_ICON_TYPES[eventType];
  const iconSize = compact ? 13 : 16;
  const boxSize = compact ? 22 : 26;

  if (travelType) {
    return <TravelTypeIcon type={travelType} size={iconSize} />;
  }

  if (eventType === "get_user_personalization") {
    return (
      <View style={[styles.customIconBox, compact && { width: boxSize, height: boxSize }]}>
        <SlidersHorizontal size={iconSize} color={colors.accent} strokeWidth={2} />
      </View>
    );
  }

  return (
    <View style={[styles.customIconBox, compact && { width: boxSize, height: boxSize }]}>
      <LayoutGrid size={iconSize} color={colors.accent} strokeWidth={2} />
    </View>
  );
}

export function AiProgressStrip({
  eventType,
  embedded = false,
}: AiProgressStripProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: embedded ? 250 : 200,
      useNativeDriver: false,
    }).start();
  }, [eventType, embedded, progress]);

  const maxHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, embedded ? EMBEDDED_STRIP_HEIGHT : 56],
  });

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: embedded ? [0, 0] : [-8, 0],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        maxHeight,
        opacity,
        transform: [{ translateY }],
        overflow: "hidden",
      }}
    >
      <View style={[styles.container, embedded && styles.containerEmbedded]}>
        <EventIcon eventType={eventType} compact={embedded} />
        <Text
          variant="body"
          style={[styles.label, embedded && styles.labelEmbedded]}
        >
          {AI_PROGRESS_LABELS[eventType]}
        </Text>
        <ActivityIndicator
          size="small"
          color={embedded ? colors.accent : colors.textMuted}
          style={embedded ? styles.compactSpinner : undefined}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  containerEmbedded: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${colors.borderFocus}14`,
    backgroundColor: colors.bgAccentMuted,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  customIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
  },
  labelEmbedded: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: "#115E59",
  },
  compactSpinner: {
    transform: [{ scale: 0.85 }],
  },
});

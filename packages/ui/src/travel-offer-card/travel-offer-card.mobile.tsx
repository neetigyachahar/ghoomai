import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import type { TravelOfferCardProps } from "./travel-offer-card.types";

export type { TravelOfferCardProps } from "./travel-offer-card.types";

export function TravelOfferCard({ children, style }: TravelOfferCardProps) {
  return <View style={[styles.card, style as StyleProp<ViewStyle>]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});

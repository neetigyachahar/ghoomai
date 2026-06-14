import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.mobile";
import type { TravelCabOfferProps } from "./travel-cab-offer.types";

export type { TravelCabOfferProps } from "./travel-cab-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min ride`;
  if (mins === 0) return `${hours} hr ride`;
  return `${hours} hr ${mins} min ride`;
}

export function TravelCabOffer({
  cab,
  type = "cab",
  highlight,
  style,
}: TravelCabOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      style={style}
      tag={{ label: cab.vehicleType, tone: "orange" }}
      header={
        <View style={styles.header}>
          <Text style={styles.provider}>{cab.provider}</Text>
          <Text style={styles.route}>
            {cab.from} → {cab.to}
          </Text>
        </View>
      }
      footer={
        <View style={styles.footer}>
          <View style={styles.times}>
            <Text style={styles.timeRange}>
              Departs {cab.departureTime} · {cab.dayLabel}
            </Text>
            <Text style={styles.subtext}>{formatDuration(cab.durationMinutes)}</Text>
          </View>
          <Text style={styles.price}>{formatPrice(cab.priceInr)}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  provider: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  route: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    paddingTop: 12,
  },
  times: {
    flex: 1,
    gap: 2,
  },
  timeRange: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  subtext: {
    fontSize: 13,
    color: colors.textMuted,
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});

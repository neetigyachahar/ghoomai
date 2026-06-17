import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.mobile";
import type { TravelBusOfferProps } from "./travel-bus-offer.types";

export type { TravelBusOfferProps } from "./travel-bus-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function TravelBusOffer({ bus, type = "bus", highlight, style }: TravelBusOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      style={style}
      tag={bus.overnight ? { label: "Overnight", tone: "teal" } : undefined}
      header={
        <View style={styles.header}>
          <Text style={styles.operator}>{bus.operator}</Text>
          <Text style={styles.route}>
            {bus.from} → {bus.to} · {bus.dayLabel}
          </Text>
        </View>
      }
      footer={
        <View style={styles.footer}>
          <View style={styles.times}>
            <Text style={styles.timeRange}>
              {bus.departureTime} – {bus.arrivalTime}
            </Text>
            <Text style={styles.subtext}>Direct service</Text>
          </View>
          <Text style={styles.price}>{formatPrice(bus.priceInr)}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  operator: {
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

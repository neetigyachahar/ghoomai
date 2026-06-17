import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.mobile";
import type { TravelFlightOfferProps } from "./travel-flight-offer.types";

export type { TravelFlightOfferProps } from "./travel-flight-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function TravelFlightOffer({
  flight,
  type = "flight",
  highlight,
  style,
}: TravelFlightOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      style={style}
      header={
        <View style={styles.routeRow}>
          <View style={styles.endpoint}>
            <Text style={styles.time}>{flight.departureTime}</Text>
            <Text style={styles.place} numberOfLines={1}>
              {flight.from}
            </Text>
          </View>
          <View style={styles.durationBlock}>
            <Text style={styles.duration}>{formatDuration(flight.durationMinutes)}</Text>
            <View style={styles.durationLine}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <View style={styles.dot} />
            </View>
          </View>
          <View style={[styles.endpoint, styles.endpointEnd]}>
            <Text style={styles.time}>{flight.arrivalTime}</Text>
            <Text style={styles.place} numberOfLines={1}>
              {flight.to}
            </Text>
          </View>
        </View>
      }
      footer={
        <View style={styles.footer}>
          <View style={styles.meta}>
            <Text style={styles.airline}>{flight.airline}</Text>
            <Text style={styles.detail}>
              {flight.flightNumber} · {flight.dayLabel}
            </Text>
          </View>
          <Text style={styles.price}>{formatPrice(flight.priceInr)}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  endpoint: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  endpointEnd: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  place: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  durationBlock: {
    alignItems: "center",
    gap: 4,
    minWidth: 72,
  },
  duration: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.brandGhoom,
  },
  durationLine: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderDefault,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandGhoom,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    paddingTop: 12,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  airline: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  detail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});

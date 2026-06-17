import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.mobile";
import type { TravelTrainOfferProps } from "./travel-train-offer.types";

export type { TravelTrainOfferProps } from "./travel-train-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function TravelTrainOffer({
  train,
  type = "train",
  highlight,
  style,
}: TravelTrainOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      style={style}
      tag={{ label: train.travelClass, tone: "stone" }}
      header={
        <View style={styles.header}>
          <Text style={styles.name}>{train.name}</Text>
          <Text style={styles.route}>
            {train.trainNumber} · {train.from} → {train.to}
          </Text>
        </View>
      }
      footer={
        <View style={styles.footer}>
          <View style={styles.times}>
            <Text style={styles.timeRange}>
              {train.departureTime} – {train.arrivalTime}
            </Text>
            <Text style={styles.subtext}>{train.dayLabel}</Text>
          </View>
          <Text style={styles.price}>{formatPrice(train.priceInr)}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  name: {
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

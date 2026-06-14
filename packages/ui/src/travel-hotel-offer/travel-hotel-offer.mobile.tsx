import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import type { Hotel } from "@repo/types";

import { colors } from "../theme/colors";
import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.mobile";
import type { TravelHotelOfferProps } from "./travel-hotel-offer.types";

export type { TravelHotelOfferProps } from "./travel-hotel-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatAccommodationType(type: Hotel["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function TravelHotelOffer({
  hotel,
  type = "hotel",
  highlight,
  style,
}: TravelHotelOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      style={style}
      tag={{ label: formatAccommodationType(hotel.type), tone: "stone" }}
      header={
        <View style={styles.header}>
          <Text style={styles.name}>{hotel.name}</Text>
          <Text style={styles.meta}>
            ★ {hotel.rating} · {hotel.location}
          </Text>
        </View>
      }
      footer={
        <View style={styles.footer}>
          <View style={styles.times}>
            <Text style={styles.checkTimes}>
              Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}
            </Text>
            <Text style={styles.subtext}>Per night</Text>
          </View>
          <Text style={styles.price}>{formatPrice(hotel.pricePerNightInr)}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 26,
    color: colors.textPrimary,
  },
  meta: {
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
  checkTimes: {
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

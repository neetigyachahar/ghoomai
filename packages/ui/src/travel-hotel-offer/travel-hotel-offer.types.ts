import type { Hotel, TravelResourceType } from "@repo/types";
import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TravelHotelOfferProps {
  hotel: Hotel;
  type?: TravelResourceType;
  highlight?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

import type { Flight, TravelResourceType } from "@repo/types";
import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TravelFlightOfferProps {
  flight: Flight;
  type?: TravelResourceType;
  highlight?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

import type { Bus, TravelResourceType } from "@repo/types";
import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TravelBusOfferProps {
  bus: Bus;
  type?: TravelResourceType;
  highlight?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

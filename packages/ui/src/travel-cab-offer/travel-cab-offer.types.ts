import type { Cab, TravelResourceType } from "@repo/types";
import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TravelCabOfferProps {
  cab: Cab;
  type?: TravelResourceType;
  highlight?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

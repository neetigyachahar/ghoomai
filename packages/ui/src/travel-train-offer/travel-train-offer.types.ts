import type { Train, TravelResourceType } from "@repo/types";
import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TravelTrainOfferProps {
  train: Train;
  type?: TravelResourceType;
  highlight?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

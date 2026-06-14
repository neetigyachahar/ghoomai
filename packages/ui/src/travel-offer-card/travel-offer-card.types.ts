import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TravelOfferCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

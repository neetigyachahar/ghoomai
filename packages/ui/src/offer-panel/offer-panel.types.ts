import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface OfferPanelProps {
  children?: ReactNode;
  highlight?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TripStat {
  label: string;
  value: string;
}

export interface TripHeaderProps {
  title: string;
  subtitle?: string;
  stats?: TripStat[];
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

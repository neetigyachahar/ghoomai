import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TimelineStepProps {
  dayLabel?: string;
  label?: string;
  time?: string;
  note?: string;
  isLast?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

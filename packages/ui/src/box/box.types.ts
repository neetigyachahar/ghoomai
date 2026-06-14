import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface BoxProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

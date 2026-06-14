import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface ScrollBoxProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
  contentContainerClassName?: string;
  contentContainerStyle?: CSSProperties | StyleProp<ViewStyle>;
}

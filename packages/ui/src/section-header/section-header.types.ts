import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

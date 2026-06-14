import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface ContentBlockProps {
  heading?: string;
  content?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

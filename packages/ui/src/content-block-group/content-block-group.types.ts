import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface ContentBlockGroupItem {
  heading?: string;
  content: string;
}

export interface ContentBlockGroupProps {
  items: ContentBlockGroupItem[];
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

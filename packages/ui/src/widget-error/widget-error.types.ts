import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface WidgetErrorProps {
  widgetKey?: string;
  message: string;
  details?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

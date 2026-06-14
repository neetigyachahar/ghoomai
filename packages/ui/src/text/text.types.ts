import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

export type TextVariant = "body" | "title";

export interface TextProps {
  children?: ReactNode;
  variant?: TextVariant;
  className?: string;
  style?: CSSProperties | StyleProp<TextStyle>;
}

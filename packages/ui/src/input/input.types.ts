import type { CSSProperties } from "react";
import type { TextStyle, ViewStyle } from "react-native";

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  className?: string;
  style?: ViewStyle | TextStyle;
  webStyle?: CSSProperties;
  onSubmit?: () => void;
}

import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface PlanOptionProps {
  label: string;
  summary?: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
  /** @deprecated Locked state is handled by plan-choice widget */
  locked?: boolean;
  /** @deprecated Locked state is handled by plan-choice widget */
  children?: ReactNode;
}

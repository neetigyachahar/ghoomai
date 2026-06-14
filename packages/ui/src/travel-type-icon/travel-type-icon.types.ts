import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type { TravelResourceType } from "@repo/types";

export interface TravelTypeIconProps {
  type: TravelResourceType;
  size?: number;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}

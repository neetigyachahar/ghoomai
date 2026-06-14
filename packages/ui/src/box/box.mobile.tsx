import { View, type StyleProp, type ViewStyle } from "react-native";

import type { BoxProps } from "./box.types";

export type { BoxProps } from "./box.types";

export function Box({ children, style }: BoxProps) {
  return <View style={style as StyleProp<ViewStyle>}>{children}</View>;
}

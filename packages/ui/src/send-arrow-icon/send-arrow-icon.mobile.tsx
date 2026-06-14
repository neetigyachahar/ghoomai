import Svg, { Path } from "react-native-svg";

import type { SendArrowIconProps } from "./send-arrow-icon.types";

export type { SendArrowIconProps } from "./send-arrow-icon.types";

export function SendArrowIcon({
  size = 20,
  color = "#ffffff",
}: SendArrowIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m13 6 6 6-6 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

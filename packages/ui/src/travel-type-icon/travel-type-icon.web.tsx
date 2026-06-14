import type { CSSProperties } from "react";
import { BedDouble, Bus, Car, Plane, TrainFront } from "lucide-react";

import type { TravelResourceType } from "@repo/types";

import {
  travelTypeIconBackgrounds,
  travelTypeIconBoxPadding,
  travelTypeIconColors,
} from "./travel-type-icon.theme";
import type { TravelTypeIconProps } from "./travel-type-icon.types";

export type { TravelTypeIconProps } from "./travel-type-icon.types";

const iconComponents = {
  flight: Plane,
  bus: Bus,
  train: TrainFront,
  cab: Car,
  hotel: BedDouble,
} satisfies Record<TravelResourceType, typeof Bus>;

export function TravelTypeIcon({
  type,
  size = 18,
  className,
  style,
}: TravelTypeIconProps) {
  const color = travelTypeIconColors[type];
  const background = travelTypeIconBackgrounds[type];
  const Icon = iconComponents[type];
  const boxSize = size + travelTypeIconBoxPadding;

  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: boxSize,
        height: boxSize,
        backgroundColor: background,
        ...(style as CSSProperties),
      }}
      aria-hidden
    >
      <Icon size={size} color={color} strokeWidth={2} />
    </div>
  );
}

import type { CSSProperties } from "react";

import { colors } from "../theme/colors";
import type { TravelOfferCardProps } from "./travel-offer-card.types";

export type { TravelOfferCardProps } from "./travel-offer-card.types";

export function TravelOfferCard({
  children,
  className,
  style,
}: TravelOfferCardProps) {
  return (
    <div
      className={["rounded-xl border px-4 py-3.5", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: colors.bgSurface,
        borderColor: colors.borderDefault,
        ...(style as CSSProperties),
      }}
    >
      {children}
    </div>
  );
}

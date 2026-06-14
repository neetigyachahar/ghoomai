import type { CSSProperties } from "react";

import { colors } from "../theme/colors";
import { TravelTypeIcon } from "../travel-type-icon/travel-type-icon.web";
import type {
  TravelOfferLayoutProps,
  TravelOfferTagTone,
} from "./travel-offer-layout.types";

export type {
  TravelOfferLayoutProps,
  TravelOfferTag,
  TravelOfferTagTone,
} from "./travel-offer-layout.types";

const tagToneStyles: Record<
  TravelOfferTagTone,
  { backgroundColor: string; color: string }
> = {
  teal: { backgroundColor: colors.bgAccentSoft, color: colors.brandGhoom },
  orange: { backgroundColor: "#FFEDD5", color: colors.brandAi },
  stone: { backgroundColor: colors.bgSubtle, color: colors.textSecondary },
};

export function TravelOfferLayout({
  type,
  header,
  footer,
  tag,
  highlight,
  className,
  style,
}: TravelOfferLayoutProps) {
  const tagStyle = tagToneStyles[tag?.tone ?? "stone"];

  return (
    <div
      className={["flex flex-col gap-3", className].filter(Boolean).join(" ")}
      style={style as CSSProperties}
    >
      {highlight ? (
        <p
          className="text-[14px] leading-relaxed"
          style={{ color: colors.textSecondary }}
        >
          {highlight}
        </p>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">{header}</div>
        <TravelTypeIcon type={type} className="shrink-0" />
      </div>
      <div>{footer}</div>
      <div className="flex items-center justify-between gap-3 border-t border-stone-200 pt-3">
        {tag ? (
          <span
            className="rounded-full px-2.5 py-1 text-[12px] font-medium"
            style={{
              backgroundColor: tagStyle.backgroundColor,
              color: tagStyle.color,
            }}
          >
            {tag.label}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="shrink-0 text-[14px] font-medium"
          style={{ color: colors.brandGhoom }}
        >
          Change
        </button>
      </div>
    </div>
  );
}
